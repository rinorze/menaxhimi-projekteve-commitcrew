from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import connection

from . import models, serializers


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
