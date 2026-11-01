from datetime import timedelta

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers

from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        models.Profile.objects.create(user=user)
        return user


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Region
        fields = ('id', 'slug', 'name_sq', 'name_en', 'name_de', 'name_fr')


class MunicipalitySerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)
    places_count = serializers.IntegerField(source='places.count', read_only=True)

    class Meta:
        model = models.Municipality
        fields = (
            'id', 'slug', 'region', 'name_sq', 'name_en', 'name_de', 'name_fr', 'name_sr',
            'blurb_sq', 'blurb_en', 'blurb_de', 'blurb_fr',
            'lat', 'lng', 'population', 'population_year', 'area_km2',
            'website', 'wikidata', 'image', 'places_count',
        )


class MunicipalityBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Municipality
        fields = ('id', 'slug', 'name_sq', 'name_en')


class PlaceSerializer(serializers.ModelSerializer):
    municipality = MunicipalityBriefSerializer(read_only=True)

    class Meta:
        model = models.Place
        fields = (
            'id', 'slug', 'municipality',
            'name_sq', 'name_en', 'name_de', 'name_fr', 'name_sr',
            'category', 'tags', 'lat', 'lng', 'unlock_radius_m', 'elevation_m',
            'summary_sq', 'summary_en', 'summary_de', 'summary_fr',
            'summary_source', 'summary_url',
            'best_time', 'duration_min', 'difficulty', 'sensitive',
            'opening_hours', 'website', 'phone', 'wheelchair', 'fee', 'access',
            'osm_id', 'osm_url', 'wikidata', 'checked_at',
            'photos', 'image', 'xp', 'score',
        )


class PlaceListSerializer(serializers.ModelSerializer):
    """Lighter payload for the map and grid: no long summaries."""

    municipality = MunicipalityBriefSerializer(read_only=True)

    class Meta:
        model = models.Place
        fields = (
            'id', 'slug', 'municipality', 'name_sq', 'name_en',
            'category', 'tags', 'lat', 'lng', 'unlock_radius_m',
            'sensitive', 'image', 'xp',
        )


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    home_municipality = MunicipalityBriefSerializer(read_only=True)
    friend_code = serializers.CharField(read_only=True)
    stats = serializers.SerializerMethodField()
    home_municipality_slug = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=models.Municipality.objects.all(),
        source='home_municipality',
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = models.Profile
        fields = (
            'id', 'user', 'friend_code', 'display_name', 'home_municipality',
            'home_municipality_slug', 'language', 'avatar', 'bio', 'ghost_mode',
            'location_sharing', 'sharing_precision', 'stop_sharing_after_minutes',
            'notification_preferences', 'stats',
            'created_at', 'updated_at',
        )
        read_only_fields = ('stats',)

    def validate_notification_preferences(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError('Notification preferences must be an object.')
        defaults = models.default_notification_preferences()
        unknown = set(value) - set(defaults)
        if unknown:
            raise serializers.ValidationError(
                f'Unknown notification preference(s): {", ".join(sorted(unknown))}.'
            )
        if any(not isinstance(enabled, bool) for enabled in value.values()):
            raise serializers.ValidationError('Each notification preference must be a boolean.')

        current = dict(defaults)
        if self.instance:
            current.update(self.instance.notification_preferences or {})
        current.update(value)
        return current

    def validate(self, attrs):
        ghost_mode = attrs.get('ghost_mode', getattr(self.instance, 'ghost_mode', False))
        if ghost_mode and attrs.get('location_sharing') is True:
            raise serializers.ValidationError({
                'location_sharing': 'Location sharing must be off while ghost mode is on.'
            })
        return attrs

    @transaction.atomic
    def update(self, instance, validated_data):
        profile = super().update(instance, validated_data)
        if profile.ghost_mode and profile.location_sharing:
            profile.location_sharing = False
            profile.save(update_fields=['location_sharing', 'updated_at'])
        if profile.ghost_mode or not profile.location_sharing:
            profile.user.location_shares.all().delete()
        else:
            share = profile.user.location_shares.order_by('-updated_at').first()
            if share:
                changed = []
                if 'sharing_precision' in validated_data:
                    share.precision = profile.sharing_precision
                    changed.append('precision')
                if 'stop_sharing_after_minutes' in validated_data:
                    minutes = profile.stop_sharing_after_minutes
                    share.expires_at = (
                        timezone.now() + timedelta(minutes=minutes) if minutes is not None else None
                    )
                    changed.append('expires_at')
                if changed:
                    share.save(update_fields=[*changed, 'updated_at'])
        return profile

    def get_stats(self, profile):
        user = profile.user
        streak = models.Streak.objects.filter(user=user).first()
        municipalities_visited = models.Stamp.objects.filter(
            user=user
        ).values('place__municipality_id').distinct().count()
        return {
            'stamps': models.Stamp.objects.filter(user=user).count(),
            'municipalities': {
                'visited': municipalities_visited,
                'total': models.Municipality.objects.count(),
            },
            'streak': {
                'current': streak.current if streak else 0,
                'longest': streak.longest if streak else 0,
            },
            'saved_places': models.SavedPlace.objects.filter(user=user).count(),
            'trips': models.Trip.objects.filter(
                Q(owner=user) | Q(participants=user)
            ).distinct().count(),
            'postcards': models.Postcard.objects.filter(
                Q(sender=user) | Q(recipient=user)
            ).count(),
        }


class StampSerializer(serializers.ModelSerializer):
    place = PlaceListSerializer(read_only=True)

    class Meta:
        model = models.Stamp
        fields = ('id', 'place', 'created_at')


class UnlockSerializer(serializers.ModelSerializer):
    place = PlaceListSerializer(read_only=True)

    class Meta:
        model = models.Unlock
        fields = ('id', 'place', 'unlocked_at', 'lat', 'lng', 'accuracy_m', 'photo')


class SavedPlaceSerializer(serializers.ModelSerializer):
    place = PlaceListSerializer(read_only=True)
    place_slug = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=models.Place.objects.filter(is_active=True),
        source='place',
        write_only=True,
    )

    class Meta:
        model = models.SavedPlace
        fields = ('id', 'place', 'place_slug', 'created_at')
        read_only_fields = ('id', 'place', 'created_at')


class PrivatePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PrivatePhoto
        fields = ('id', 'image_url', 'caption', 'created_at')
        read_only_fields = ('id', 'created_at')


class ActivitySerializer(serializers.ModelSerializer):
    place = PlaceListSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = models.Activity
        fields = ('id', 'user', 'username', 'type', 'place', 'text_sq', 'text_en', 'created_at')


class FriendshipSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)

    class Meta:
        model = models.Friendship
        fields = ('id', 'from_user', 'to_user', 'status', 'created_at', 'updated_at')


class PostcardSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    place = PlaceListSerializer(read_only=True)

    class Meta:
        model = models.Postcard
        fields = ('id', 'sender', 'recipient', 'place', 'message', 'created_at')


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = models.Message
        fields = ('id', 'sender', 'content', 'created_at', 'read')


class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = models.Conversation
        fields = ('id', 'participants', 'created_at', 'updated_at', 'last_message')

    def get_last_message(self, obj):
        message = obj.messages.order_by('-created_at').first()
        return MessageSerializer(message).data if message else None


class TripSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    participants = UserSerializer(many=True, read_only=True)
    places = PlaceListSerializer(many=True, read_only=True)
    place_slugs = serializers.ListField(
        child=serializers.SlugField(), write_only=True, required=False
    )

    class Meta:
        model = models.Trip
        fields = (
            'id', 'name', 'owner', 'participants', 'municipality',
            'start_date', 'end_date', 'places', 'place_slugs', 'created_at',
        )

    def create(self, validated_data):
        place_slugs = validated_data.pop('place_slugs', [])
        trip = models.Trip.objects.create(owner=self.context['request'].user, **validated_data)
        if place_slugs:
            trip.places.set(models.Place.objects.filter(slug__in=place_slugs))
        return trip


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Challenge
        fields = '__all__'


class StreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Streak
        fields = ('current', 'longest', 'last_unlock_date')


class LocationShareSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    lat = serializers.SerializerMethodField()
    lng = serializers.SerializerMethodField()

    class Meta:
        model = models.LocationShare
        fields = ('id', 'username', 'lat', 'lng', 'precision', 'expires_at', 'updated_at')
        read_only_fields = ('id', 'username', 'precision', 'expires_at', 'updated_at')

    def _coordinates(self, obj):
        if obj.precision == 'city':
            profile = obj.user.profile
            municipality = profile.home_municipality
            if municipality and municipality.lat is not None and municipality.lng is not None:
                return municipality.lat, municipality.lng
            return None, None
        if obj.precision == 'km':
            return round(obj.lat, 2), round(obj.lng, 2)
        return obj.lat, obj.lng

    def get_lat(self, obj):
        return self._coordinates(obj)[0]

    def get_lng(self, obj):
        return self._coordinates(obj)[1]


class EventSerializer(serializers.ModelSerializer):
    municipality = MunicipalityBriefSerializer(read_only=True)

    class Meta:
        model = models.Event
        fields = '__all__'


class WaitlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.WaitlistEntry
        fields = ('id', 'email', 'source', 'created_at')


# ------------------------------------------------------------ request payloads


class UnlockCreateSerializer(serializers.Serializer):
    place_slug = serializers.SlugField()
    lat = serializers.FloatField()
    lng = serializers.FloatField()
    accuracy_m = serializers.FloatField(required=False, allow_null=True)


class AskKosovoSerializer(serializers.Serializer):
    question = serializers.CharField()
    language = serializers.ChoiceField(choices=['sq', 'en'], default='sq')


class DeleteAccountSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)


class BlockUserSerializer(serializers.Serializer):
    username = serializers.CharField()


class LocationShareCreateSerializer(serializers.Serializer):
    lat = serializers.FloatField()
    lng = serializers.FloatField()

    def validate_lat(self, value):
        if not -90 <= value <= 90:
            raise serializers.ValidationError('Latitude must be between -90 and 90.')
        return value

    def validate_lng(self, value):
        if not -180 <= value <= 180:
            raise serializers.ValidationError('Longitude must be between -180 and 180.')
        return value


class PlanMyDaySerializer(serializers.Serializer):
    hours = serializers.IntegerField(default=4, min_value=1, max_value=12)
    municipality = serializers.SlugField(required=False, allow_blank=True)
    interests = serializers.ListField(child=serializers.CharField(), required=False)
