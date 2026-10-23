from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
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
            'id', 'user', 'display_name', 'home_municipality', 'home_municipality_slug',
            'language', 'avatar', 'bio', 'ghost_mode', 'location_sharing',
            'created_at', 'updated_at',
        )


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


class PlanMyDaySerializer(serializers.Serializer):
    hours = serializers.IntegerField(default=4, min_value=1, max_value=12)
    municipality = serializers.SlugField(required=False, allow_blank=True)
    interests = serializers.ListField(child=serializers.CharField(), required=False)
