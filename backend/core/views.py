from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import connection, transaction

from . import models, serializers
from .utils import haversine_m


@api_view(['GET'])
def health(request):
    """Is the API up, and which database is it talking to (sqlite or postgresql)?"""
    return Response({'ok': True, 'database': connection.vendor})


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = serializers.RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': serializers.UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class RegionListView(generics.ListAPIView):
    queryset = models.Region.objects.all()
    serializer_class = serializers.RegionSerializer
    permission_classes = (permissions.AllowAny,)


class MunicipalityListView(generics.ListAPIView):
    serializer_class = serializers.MunicipalitySerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = models.Municipality.objects.all().select_related('region')
        region = self.request.query_params.get('region')
        if region:
            queryset = queryset.filter(region__slug=region)
        return queryset


class PlaceListView(generics.ListAPIView):
    serializer_class = serializers.PlaceSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = models.Place.objects.filter(is_active=True).select_related('municipality', 'municipality__region')
        municipality = self.request.query_params.get('municipality')
        if municipality:
            queryset = queryset.filter(municipality__slug=municipality)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class PlaceDetailView(generics.RetrieveAPIView):
    queryset = models.Place.objects.filter(is_active=True)
    serializer_class = serializers.PlaceSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = 'slug'


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.ProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        profile, _ = models.Profile.objects.get_or_create(user=self.request.user)
        return profile


class MyStampsView(generics.ListAPIView):
    serializer_class = serializers.StampSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.Stamp.objects.filter(user=self.request.user).select_related('place')


class UnlockCreateView(generics.CreateAPIView):
    serializer_class = serializers.UnlockCreateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            place = models.Place.objects.get(slug=data['place_slug'], is_active=True)
        except models.Place.DoesNotExist:
            return Response({'error': 'Place not found'}, status=status.HTTP_404_NOT_FOUND)

        if models.Unlock.objects.filter(user=request.user, place=place).exists():
            return Response({'error': 'Place already unlocked'}, status=status.HTTP_400_BAD_REQUEST)

        lat = data['latitude']
        lng = data['longitude']
        acc = data.get('accuracy_m')

        # Basic validation
        if acc is not None and acc > 75:
            return Response({'error': 'Location accuracy too low (max 75m)'}, status=status.HTTP_400_BAD_REQUEST)

        distance = haversine_m(lat, lng, place.latitude, place.longitude)
        if distance > place.unlock_radius_m + 5:  # small tolerance
            return Response({'error': 'Not close enough to unlock', 'distance_m': round(distance, 1)}, status=status.HTTP_400_BAD_REQUEST)

        unlock = models.Unlock.objects.create(
            user=request.user,
            place=place,
            latitude=lat,
            longitude=lng,
            accuracy_m=acc,
        )
        stamp = models.Stamp.objects.create(user=request.user, place=place, unlock=unlock)
        models.Activity.objects.create(
            user=request.user,
            type='unlock',
            place=place,
            text_en=f'Unlocked {place.name_en}',
            text_sq=f'Zhbllokoi {place.name_sq}',
        )

        return Response({
            'success': True,
            'unlock_id': unlock.id,
            'stamp_id': stamp.id,
            'place': serializers.PlaceSerializer(place).data,
        }, status=status.HTTP_201_CREATED)
