from django.contrib import admin
from . import models


@admin.register(models.Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_sq', 'slug')
    prepopulated_fields = {'slug': ('name_en',)}


@admin.register(models.Municipality)
class MunicipalityAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_sq', 'region')
    list_filter = ('region',)
    search_fields = ('name_en', 'name_sq')
    prepopulated_fields = {'slug': ('name_en',)}


@admin.register(models.Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'municipality', 'category', 'is_active', 'unlock_radius_m')
    list_filter = ('category', 'is_active', 'municipality')
    search_fields = ('name_en', 'name_sq')
    prepopulated_fields = {'slug': ('name_en',)}


@admin.register(models.Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'display_name', 'language')


@admin.register(models.Unlock)
class UnlockAdmin(admin.ModelAdmin):
    list_display = ('user', 'place', 'unlocked_at')
    list_filter = ('unlocked_at',)


@admin.register(models.Stamp)
class StampAdmin(admin.ModelAdmin):
    list_display = ('user', 'place', 'created_at')


@admin.register(models.Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'status')


@admin.register(models.Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'place', 'created_at')


@admin.register(models.Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'municipality', 'start_date')
    list_filter = ('start_date',)
