from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import connection, transaction
from django.db.models import Q

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


class FriendshipListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.FriendshipSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return models.Friendship.objects.filter(
            Q(from_user=user) | Q(to_user=user)
        ).select_related('from_user', 'to_user')

    def create(self, request, *args, **kwargs):
        to_username = request.data.get('to_username') or request.data.get('username')
        if not to_username:
            return Response({'error': 'to_username required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            to_user = User.objects.get(username=to_username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if to_user == request.user:
            return Response({'error': 'Cannot add yourself'}, status=status.HTTP_400_BAD_REQUEST)
        if models.Friendship.objects.filter(
            Q(from_user=request.user, to_user=to_user) | Q(from_user=to_user, to_user=request.user)
        ).exists():
            return Response({'error': 'Friendship already exists'}, status=status.HTTP_400_BAD_REQUEST)
        friendship = models.Friendship.objects.create(from_user=request.user, to_user=to_user, status='pending')
        return Response(serializers.FriendshipSerializer(friendship).data, status=status.HTTP_201_CREATED)


class FriendshipActionView(generics.UpdateAPIView):
    serializer_class = serializers.FriendshipSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        return models.Friendship.objects.filter(to_user=self.request.user)

    def post(self, request, *args, **kwargs):
        return self.handle_action(request)

    def update(self, request, *args, **kwargs):
        return self.handle_action(request)

    def handle_action(self, request, *args, **kwargs):
        friendship = self.get_object()
        action = request.data.get('action')
        if action == 'accept':
            friendship.status = 'accepted'
            friendship.save()
            models.Activity.objects.create(
                user=friendship.to_user,
                type='friend',
                text_en=f'Became friends with {friendship.from_user.username}',
                text_sq=f'U bënë miq me {friendship.from_user.username}',
            )
            models.Activity.objects.create(
                user=friendship.from_user,
                type='friend',
                text_en=f'Became friends with {friendship.to_user.username}',
                text_sq=f'U bënë miq me {friendship.to_user.username}',
            )
            return Response(serializers.FriendshipSerializer(friendship).data)
        elif action == 'block':
            friendship.status = 'blocked'
            friendship.save()
            return Response(serializers.FriendshipSerializer(friendship).data)
        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)


class ActivityFeedView(generics.ListAPIView):
    serializer_class = serializers.ActivitySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        friends = models.Friendship.objects.filter(
            status='accepted'
        ).filter(
            Q(from_user=user) | Q(to_user=user)
        )
        friend_ids = set()
        for f in friends:
            if f.from_user_id == user.id:
                friend_ids.add(f.to_user_id)
            else:
                friend_ids.add(f.from_user_id)
        friend_ids.add(user.id)
        return models.Activity.objects.filter(user_id__in=friend_ids).select_related('place').order_by('-created_at')[:50]


class PostcardListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.PostcardSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return models.Postcard.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).select_related('sender', 'recipient', 'place').order_by('-created_at')

    def create(self, request, *args, **kwargs):
        recipient_username = request.data.get('recipient_username')
        place_slug = request.data.get('place_slug')
        message = request.data.get('message', '')
        if not recipient_username:
            return Response({'error': 'recipient_username required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            recipient = User.objects.get(username=recipient_username)
        except User.DoesNotExist:
            return Response({'error': 'Recipient not found'}, status=status.HTTP_404_NOT_FOUND)
        place = None
        if place_slug:
            try:
                place = models.Place.objects.get(slug=place_slug)
            except models.Place.DoesNotExist:
                pass
        postcard = models.Postcard.objects.create(sender=request.user, recipient=recipient, place=place, message=message)
        return Response(serializers.PostcardSerializer(postcard).data, status=status.HTTP_201_CREATED)


class ConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.ConversationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return self.request.user.conversations.all().prefetch_related('participants', 'messages').order_by('-updated_at')

    def create(self, request, *args, **kwargs):
        other_username = request.data.get('username') or request.data.get('participant')
        if not other_username:
            return Response({'error': 'username required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            other = User.objects.get(username=other_username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if other == request.user:
            return Response({'error': 'Cannot create conversation with yourself'}, status=status.HTTP_400_BAD_REQUEST)
        # check existing
        for conv in request.user.conversations.all():
            if conv.participants.filter(id=other.id).exists() and conv.participants.count() == 2:
                return Response(serializers.ConversationSerializer(conv).data)
        conv = models.Conversation.objects.create()
        conv.participants.add(request.user, other)
        return Response(serializers.ConversationSerializer(conv).data, status=status.HTTP_201_CREATED)


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.MessageSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        conv_id = self.kwargs['pk']
        conv = generics.get_object_or_404(models.Conversation, pk=conv_id, participants=self.request.user)
        return conv.messages.all().select_related('sender').order_by('created_at')

    def create(self, request, *args, **kwargs):
        conv_id = self.kwargs['pk']
        conv = generics.get_object_or_404(models.Conversation, pk=conv_id, participants=self.request.user)
        content = request.data.get('content', '').strip()
        if not content:
            return Response({'error': 'content required'}, status=status.HTTP_400_BAD_REQUEST)
        msg = models.Message.objects.create(conversation=conv, sender=request.user, content=content)
        conv.updated_at = msg.created_at
        conv.save(update_fields=['updated_at'])
        return Response(serializers.MessageSerializer(msg).data, status=status.HTTP_201_CREATED)


class AskKosovoView(generics.GenericAPIView):
    serializer_class = serializers.AskKosovoSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.validated_data['question'].lower()

        places = models.Place.objects.filter(is_active=True).select_related('municipality')[:10]
        results = []
        for p in places:
            if any(word in question for word in p.name_en.lower().split() + p.municipality.name_en.lower().split()):
                results.append(serializers.PlaceSerializer(p).data)
        if not results:
            results = [serializers.PlaceSerializer(p).data for p in places[:5]]

        return Response({
            'answer_en': 'Here are some real places from our database you can explore in Kosovo.',
            'answer_sq': "Këtu janë disa vende reale nga databaza jonë që mund t'i eksplorosh në Kosovë.",
            'places': results,
        })


class PlanMyDayView(generics.GenericAPIView):
    serializer_class = serializers.PlanMyDaySerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hours = serializer.validated_data.get('hours', 4)
        municipality_slug = serializer.validated_data.get('municipality_slug')

        qs = models.Place.objects.filter(is_active=True).select_related('municipality')
        if municipality_slug:
            qs = qs.filter(municipality__slug=municipality_slug)
        places = list(qs[: max(3, hours)])

        return Response({
            'plan_en': f'A {hours}-hour plan using only places from our database.',
            'plan_sq': f'Një plan {hours}-orësh duke përdorur vetëm vende nga databaza jonë.',
            'stops': [serializers.PlaceSerializer(p).data for p in places],
        })
