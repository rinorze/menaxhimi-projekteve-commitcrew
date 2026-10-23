from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    path('health/', views.health),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.MeView.as_view(), name='me'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('regions/', views.RegionListView.as_view(), name='regions'),
    path('municipalities/', views.MunicipalityListView.as_view(), name='municipalities'),
    path('places/', views.PlaceListView.as_view(), name='places'),
    path('places/<slug:slug>/', views.PlaceDetailView.as_view(), name='place-detail'),
    path('stamps/', views.MyStampsView.as_view(), name='my-stamps'),
    path('unlocks/', views.UnlockCreateView.as_view(), name='unlock-create'),
    path('friends/', views.FriendshipListCreateView.as_view(), name='friends'),
    path('friends/<int:pk>/', views.FriendshipActionView.as_view(), name='friend-action'),
    path('activity/', views.ActivityFeedView.as_view(), name='activity-feed'),
    path('postcards/', views.PostcardListCreateView.as_view(), name='postcards'),
]
