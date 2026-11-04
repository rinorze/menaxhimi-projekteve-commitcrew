from datetime import timedelta

from django.contrib.auth.models import User
from django.db import connection, transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from . import models, serializers
from .utils import haversine_m


@api_view(['GET'])
def health(request):
    """Is the API up, and which database is it talking to (sqlite or postgresql)?"""
    return Response({'ok': True, 'database': connection.vendor})


def users_are_blocked(first_user, second_user):
    return models.Friendship.objects.filter(status='blocked').filter(
        Q(from_user=first_user, to_user=second_user)
        | Q(from_user=second_user, to_user=first_user)
    ).exists()


# ---------------------------------------------------------------- accounts


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


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.ProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        profile, _ = models.Profile.objects.get_or_create(user=self.request.user)
        return profile


class DeleteAccountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @transaction.atomic
    def delete(self, request):
        serializer = serializers.DeleteAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if not request.user.check_password(serializer.validated_data['password']):
            return Response(
                {'password': ['The password is incorrect.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PrivatePhotoListView(generics.ListCreateAPIView):
    serializer_class = serializers.PrivatePhotoSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.PrivatePhoto.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PrivatePhotoDetailView(generics.DestroyAPIView):
    serializer_class = serializers.PrivatePhotoSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.PrivatePhoto.objects.filter(user=self.request.user)


class SavedPlaceListView(generics.ListCreateAPIView):
    serializer_class = serializers.SavedPlaceSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.SavedPlace.objects.filter(user=self.request.user).select_related(
            'place', 'place__municipality'
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        saved, created = models.SavedPlace.objects.get_or_create(
            user=request.user, place=serializer.validated_data['place']
        )
        return Response(
            self.get_serializer(saved).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class SavedPlaceDetailView(generics.DestroyAPIView):
    serializer_class = serializers.SavedPlaceSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.SavedPlace.objects.filter(user=self.request.user)


class LocationSharesView(generics.ListCreateAPIView):
    serializer_class = serializers.LocationShareSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        friendships = models.Friendship.objects.filter(status='accepted').filter(
            Q(from_user=user) | Q(to_user=user)
        )
        friend_ids = set()
        for friendship in friendships:
            friend_ids.add(
                friendship.to_user_id if friendship.from_user_id == user.id else friendship.from_user_id
            )
        blocked_ids = models.Friendship.objects.filter(status='blocked').filter(
            Q(from_user=user) | Q(to_user=user)
        ).values_list('from_user_id', 'to_user_id')
        excluded_ids = {
            blocked_user_id
            for from_user_id, to_user_id in blocked_ids
            for blocked_user_id in (
                to_user_id if from_user_id == user.id else from_user_id,
            )
        }
        return models.LocationShare.objects.filter(
            user_id__in=friend_ids - excluded_ids,
            user__profile__ghost_mode=False,
            user__profile__location_sharing=True,
        ).filter(
            Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now())
        ).select_related(
            'user', 'user__profile', 'user__profile__home_municipality'
        ).order_by('-updated_at', '-pk')

    def create(self, request, *args, **kwargs):
        serializer = serializers.LocationShareCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile, _ = models.Profile.objects.get_or_create(user=request.user)
        if profile.ghost_mode or not profile.location_sharing:
            return Response(
                {'error': 'Enable location sharing and turn off ghost mode first.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        expires_at = None
        if profile.stop_sharing_after_minutes is not None:
            expires_at = timezone.now() + timedelta(
                minutes=profile.stop_sharing_after_minutes
            )
        share = models.LocationShare.objects.filter(user=request.user).order_by(
            '-updated_at'
        ).first()
        values = {
            **serializer.validated_data,
            'precision': profile.sharing_precision,
            'expires_at': expires_at,
        }
        if share:
            for field, value in values.items():
                setattr(share, field, value)
            share.save()
            created = False
        else:
            share = models.LocationShare.objects.create(user=request.user, **values)
            created = True
        return Response(
            self.get_serializer(share).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


# ---------------------------------------------------------------- places


class RegionListView(generics.ListAPIView):
    queryset = models.Region.objects.all()
    serializer_class = serializers.RegionSerializer
    permission_classes = (permissions.AllowAny,)


class MunicipalityListView(generics.ListAPIView):
    serializer_class = serializers.MunicipalitySerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = None

    def get_queryset(self):
        queryset = models.Municipality.objects.select_related('region').order_by('name_en')
        region = self.request.query_params.get('region')
        if region:
            queryset = queryset.filter(region__slug=region)
        return queryset


class MunicipalityDetailView(generics.RetrieveAPIView):
    queryset = models.Municipality.objects.select_related('region')
    serializer_class = serializers.MunicipalitySerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = 'slug'


class PlaceListView(generics.ListAPIView):
    serializer_class = serializers.PlaceListSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = models.Place.objects.filter(is_active=True).select_related('municipality')
        params = self.request.query_params

        municipality = params.get('municipality')
        if municipality:
            queryset = queryset.filter(municipality__slug=municipality)

        region = params.get('region')
        if region:
            queryset = queryset.filter(municipality__region__slug=region)

        category = params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        search = params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name_sq__icontains=search) | Q(name_en__icontains=search)
            )

        return queryset.order_by('name_en')


class PlaceDetailView(generics.RetrieveAPIView):
    queryset = models.Place.objects.filter(is_active=True).select_related('municipality')
    serializer_class = serializers.PlaceSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = 'slug'


# ---------------------------------------------------------------- passport & unlock


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

        place = models.Place.objects.filter(slug=data['place_slug'], is_active=True).first()
        if place is None:
            return Response({'error': 'Place not found'}, status=status.HTTP_404_NOT_FOUND)

        if models.Unlock.objects.filter(user=request.user, place=place).exists():
            return Response({'error': 'Place already unlocked'}, status=status.HTTP_400_BAD_REQUEST)

        accuracy = data.get('accuracy_m')
        if accuracy is not None and accuracy > 75:
            return Response(
                {'error': 'Location accuracy too low (max 75 m)'}, status=status.HTTP_400_BAD_REQUEST
            )

        distance = haversine_m(data['lat'], data['lng'], place.lat, place.lng)
        if distance > place.unlock_radius_m:
            return Response(
                {'error': 'Not close enough to unlock', 'distance_m': round(distance, 1),
                 'radius_m': place.unlock_radius_m},
                status=status.HTTP_400_BAD_REQUEST,
            )

        unlock = models.Unlock.objects.create(
            user=request.user, place=place,
            lat=data['lat'], lng=data['lng'], accuracy_m=accuracy,
        )
        models.Stamp.objects.get_or_create(user=request.user, place=place)
        models.Activity.objects.create(
            user=request.user, type='unlock', place=place,
            text_en=f'Unlocked {place.name_en}',
            text_sq=f'Zhbllokoi {place.name_sq}',
        )

        return Response({
            'success': True,
            'place': serializers.PlaceListSerializer(place).data,
            'stamp': models.Stamp.objects.filter(user=request.user, place=place).count(),
        }, status=status.HTTP_201_CREATED)


# ---------------------------------------------------------------- social


class FriendshipListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.FriendshipSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return models.Friendship.objects.filter(
            Q(from_user=user) | Q(to_user=user)
        ).select_related('from_user', 'to_user')

    def create(self, request, *args, **kwargs):
        username = request.data.get('to_username') or request.data.get('username')
        if not username:
            return Response({'error': 'to_username required'}, status=status.HTTP_400_BAD_REQUEST)

        to_user = User.objects.filter(username=username).first()
        if to_user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if to_user == request.user:
            return Response({'error': 'Cannot add yourself'}, status=status.HTTP_400_BAD_REQUEST)
        if users_are_blocked(request.user, to_user):
            return Response({'error': 'This user is blocked'}, status=status.HTTP_403_FORBIDDEN)
        if models.Friendship.objects.filter(
            Q(from_user=request.user, to_user=to_user) | Q(from_user=to_user, to_user=request.user)
        ).exists():
            return Response({'error': 'Friendship already exists'}, status=status.HTTP_400_BAD_REQUEST)

        friendship = models.Friendship.objects.create(
            from_user=request.user, to_user=to_user, status='pending'
        )
        return Response(
            serializers.FriendshipSerializer(friendship).data, status=status.HTTP_201_CREATED
        )


class FriendshipActionView(generics.GenericAPIView):
    serializer_class = serializers.FriendshipSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        friendship = get_object_or_404(models.Friendship, pk=pk, to_user=request.user)
        action = request.data.get('action')

        if action == 'accept':
            if users_are_blocked(request.user, friendship.from_user):
                return Response({'error': 'This user is blocked'}, status=status.HTTP_403_FORBIDDEN)
            friendship.status = 'accepted'
            friendship.save(update_fields=['status', 'updated_at'])
            for owner, other in (
                (friendship.to_user, friendship.from_user),
                (friendship.from_user, friendship.to_user),
            ):
                models.Activity.objects.create(
                    user=owner, type='friend',
                    text_en=f'Became friends with {other.username}',
                    text_sq=f'U bënë miq me {other.username}',
                )
        elif action == 'block':
            friendship = self.block_user(request.user, friendship.from_user)
        else:
            return Response({'error': "action must be 'accept' or 'block'"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializers.FriendshipSerializer(friendship).data)

    @staticmethod
    def block_user(user, other):
        models.Friendship.objects.filter(
            from_user=other, to_user=user
        ).delete()
        friendship, created = models.Friendship.objects.get_or_create(
            from_user=user,
            to_user=other,
            defaults={'status': 'blocked'},
        )
        if not created and friendship.status != 'blocked':
            friendship.status = 'blocked'
            friendship.save(update_fields=['status', 'updated_at'])
        return friendship


class BlockedUsersView(generics.ListCreateAPIView):
    serializer_class = serializers.FriendshipSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return models.Friendship.objects.filter(
            from_user=self.request.user, status='blocked'
        ).select_related('from_user', 'to_user').order_by('-created_at', '-pk')

    def create(self, request, *args, **kwargs):
        serializer = serializers.BlockUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        other = User.objects.filter(username=serializer.validated_data['username']).first()
        if other is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if other == request.user:
            return Response({'error': 'Cannot block yourself'}, status=status.HTTP_400_BAD_REQUEST)
        blocked = FriendshipActionView.block_user(request.user, other)
        return Response(
            serializers.FriendshipSerializer(blocked).data,
            status=status.HTTP_201_CREATED,
        )


class BlockedUserDetailView(generics.GenericAPIView):
    serializer_class = serializers.FriendshipSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request, pk):
        friendship = get_object_or_404(
            models.Friendship,
            pk=pk,
            from_user=request.user,
            status='blocked',
        )
        friendship.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ActivityFeedView(generics.ListAPIView):
    serializer_class = serializers.ActivitySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        friends = models.Friendship.objects.filter(status='accepted').filter(
            Q(from_user=user) | Q(to_user=user)
        )
        user_ids = {user.id}
        for friendship in friends:
            user_ids.add(
                friendship.to_user_id if friendship.from_user_id == user.id else friendship.from_user_id
            )
        return models.Activity.objects.filter(user_id__in=user_ids).filter(
            Q(user=user) | Q(user__profile__ghost_mode=False)
        ).select_related('place', 'user')


class PostcardListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.PostcardSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return models.Postcard.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).select_related('sender', 'recipient', 'place')

    def create(self, request, *args, **kwargs):
        username = request.data.get('recipient_username')
        if not username:
            return Response({'error': 'recipient_username required'}, status=status.HTTP_400_BAD_REQUEST)

        recipient = User.objects.filter(username=username).first()
        if recipient is None:
            return Response({'error': 'Recipient not found'}, status=status.HTTP_404_NOT_FOUND)
        if users_are_blocked(request.user, recipient):
            return Response({'error': 'This user is blocked'}, status=status.HTTP_403_FORBIDDEN)

        place = models.Place.objects.filter(slug=request.data.get('place_slug')).first()
        postcard = models.Postcard.objects.create(
            sender=request.user, recipient=recipient, place=place,
            message=request.data.get('message', ''),
        )
        return Response(
            serializers.PostcardSerializer(postcard).data, status=status.HTTP_201_CREATED
        )


# ---------------------------------------------------------------- chat


class ConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.ConversationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return self.request.user.conversations.prefetch_related('participants', 'messages')

    def create(self, request, *args, **kwargs):
        username = request.data.get('username') or request.data.get('participant')
        if not username:
            return Response({'error': 'username required'}, status=status.HTTP_400_BAD_REQUEST)

        other = User.objects.filter(username=username).first()
        if other is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if other == request.user:
            return Response(
                {'error': 'Cannot create a conversation with yourself'}, status=status.HTTP_400_BAD_REQUEST
            )
        if users_are_blocked(request.user, other):
            return Response({'error': 'This user is blocked'}, status=status.HTTP_403_FORBIDDEN)

        for conversation in request.user.conversations.all():
            if conversation.participants.count() == 2 and conversation.participants.filter(id=other.id).exists():
                return Response(serializers.ConversationSerializer(conversation).data)

        conversation = models.Conversation.objects.create()
        conversation.participants.add(request.user, other)
        return Response(
            serializers.ConversationSerializer(conversation).data, status=status.HTTP_201_CREATED
        )


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.MessageSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_conversation(self):
        return get_object_or_404(
            models.Conversation, pk=self.kwargs['pk'], participants=self.request.user
        )

    def get_queryset(self):
        return self.get_conversation().messages.select_related('sender')

    def create(self, request, *args, **kwargs):
        conversation = self.get_conversation()
        content = (request.data.get('content') or '').strip()
        if not content:
            return Response({'error': 'content required'}, status=status.HTTP_400_BAD_REQUEST)

        message = models.Message.objects.create(
            conversation=conversation, sender=request.user, content=content
        )
        conversation.updated_at = message.created_at
        conversation.save(update_fields=['updated_at'])
        return Response(
            serializers.MessageSerializer(message).data, status=status.HTTP_201_CREATED
        )


# ---------------------------------------------------------------- trips, challenges, streak


class TripListCreateView(generics.ListCreateAPIView):
    serializer_class = serializers.TripSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return models.Trip.objects.filter(
            Q(owner=user) | Q(participants=user)
        ).distinct().prefetch_related('participants', 'places')


class TripDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.TripSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return models.Trip.objects.filter(Q(owner=user) | Q(participants=user)).distinct()


class ChallengeListView(generics.ListAPIView):
    serializer_class = serializers.ChallengeSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        return models.Challenge.objects.filter(is_active=True)


class MyStreakView(generics.RetrieveAPIView):
    serializer_class = serializers.StreakSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        streak, _ = models.Streak.objects.get_or_create(user=self.request.user)
        return streak


# ---------------------------------------------------------------- events & waitlist


class EventListView(generics.ListAPIView):
    serializer_class = serializers.EventSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = models.Event.objects.select_related('municipality')
        municipality = self.request.query_params.get('municipality')
        if municipality:
            queryset = queryset.filter(municipality__slug=municipality)
        return queryset


class WaitlistCreateView(generics.CreateAPIView):
    serializer_class = serializers.WaitlistSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email'].lower().strip()
        entry, created = models.WaitlistEntry.objects.get_or_create(
            email=email, defaults={'source': serializer.validated_data.get('source', '')}
        )
        return Response(
            serializers.WaitlistSerializer(entry).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


# ---------------------------------------------------------------- AI


class AskKosovoView(generics.GenericAPIView):
    """Answers only with places that exist in our database."""

    serializer_class = serializers.AskKosovoSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.validated_data['question'].lower()
        language = serializer.validated_data['language']

        places = models.Place.objects.filter(is_active=True).select_related('municipality')
        matches = places.filter(
            Q(name_sq__icontains=question) | Q(name_en__icontains=question)
        )
        if not matches.exists():
            matches = places.filter(
                Q(municipality__name_sq__icontains=question)
                | Q(municipality__name_en__icontains=question)
            )
        results = list((matches if matches.exists() else places)[:8])

        answer = (
            'Këto vende reale nga databaza jonë të mund t\'i vizitosh në Kosovë.'
            if language == 'sq'
            else 'These are real places from our database you can visit in Kosovo.'
        )
        return Response({
            'answer': answer,
            'places': serializers.PlaceListSerializer(results, many=True).data,
        })


class PlanMyDayView(generics.GenericAPIView):
    """Builds a day plan from real places only."""

    serializer_class = serializers.PlanMyDaySerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hours = serializer.validated_data['hours']
        interest = serializer.validated_data.get('interests') or []

        queryset = models.Place.objects.filter(is_active=True).select_related('municipality')
        municipality = serializer.validated_data.get('municipality')
        if municipality:
            queryset = queryset.filter(municipality__slug=municipality)
        if interest:
            queryset = queryset.filter(category__in=interest)

        stops = list(queryset.order_by('-score')[:hours])
        return Response({
            'hours': hours,
            'stops': serializers.PlaceListSerializer(stops, many=True).data,
        })
