from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    path('health/', views.health),

    # accounts
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.MeView.as_view(), name='me'),
    path('profile/', views.ProfileView.as_view(), name='profile'),

    # places
    path('regions/', views.RegionListView.as_view(), name='regions'),
    path('municipalities/', views.MunicipalityListView.as_view(), name='municipalities'),
    path('municipalities/<slug:slug>/', views.MunicipalityDetailView.as_view(), name='municipality-detail'),
    path('places/', views.PlaceListView.as_view(), name='places'),
    path('places/<slug:slug>/', views.PlaceDetailView.as_view(), name='place-detail'),

    # passport & unlock
    path('stamps/', views.MyStampsView.as_view(), name='my-stamps'),
    path('unlocks/', views.UnlockCreateView.as_view(), name='unlock-create'),

    # social
    path('friends/', views.FriendshipListCreateView.as_view(), name='friends'),
    path('friends/<int:pk>/', views.FriendshipActionView.as_view(), name='friend-action'),
    path('activity/', views.ActivityFeedView.as_view(), name='activity-feed'),
    path('postcards/', views.PostcardListCreateView.as_view(), name='postcards'),

    # chat
    path('conversations/', views.ConversationListCreateView.as_view(), name='conversations'),
    path('conversations/<int:pk>/messages/', views.MessageListCreateView.as_view(), name='conversation-messages'),

    # trips, challenges, streak
    path('trips/', views.TripListCreateView.as_view(), name='trips'),
    path('trips/<int:pk>/', views.TripDetailView.as_view(), name='trip-detail'),
    path('challenges/', views.ChallengeListView.as_view(), name='challenges'),
    path('streak/', views.MyStreakView.as_view(), name='my-streak'),

    # events & waitlist
    path('events/', views.EventListView.as_view(), name='events'),
    path('waitlist/', views.WaitlistCreateView.as_view(), name='waitlist'),

    # AI
    path('ai/ask/', views.AskKosovoView.as_view(), name='ask-kosovo'),
    path('ai/plan/', views.PlanMyDayView.as_view(), name='plan-my-day'),
]
