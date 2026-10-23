from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

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
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        models.Profile.objects.create(user=user)
        return user


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Region
        fields = '__all__'


class MunicipalitySerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)

    class Meta:
        model = models.Municipality
        fields = '__all__'


class PlaceSerializer(serializers.ModelSerializer):
    municipality = MunicipalitySerializer(read_only=True)

    class Meta:
        model = models.Place
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = models.Profile
        fields = '__all__'


class UnlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Unlock
        fields = '__all__'
        read_only_fields = ('user', 'unlocked_at')


class UnlockCreateSerializer(serializers.Serializer):
    place_slug = serializers.SlugField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    accuracy_m = serializers.FloatField(required=False, allow_null=True)


class StampSerializer(serializers.ModelSerializer):
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = models.Stamp
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = models.Activity
        fields = '__all__'


class FriendshipSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)

    class Meta:
        model = models.Friendship
        fields = '__all__'
        read_only_fields = ('from_user', 'status', 'created_at', 'updated_at')


class PostcardSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    place = PlaceSerializer(read_only=True)

    class Meta:
        model = models.Postcard
        fields = '__all__'
        read_only_fields = ('sender', 'created_at')
