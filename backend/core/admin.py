from django.contrib import admin

from . import models


class PlaceInline(admin.TabularInline):
    model = models.Place
    extra = 0
    fields = ('name_sq', 'name_en', 'slug', 'category', 'lat', 'lng')
    show_change_link = True


@admin.register(models.Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name_sq', 'name_en', 'slug', 'municipality_count')
    search_fields = ('name_sq', 'name_en', 'slug')
    prepopulated_fields = {'slug': ('name_en',)}

    @admin.display(description='Municipalities')
    def municipality_count(self, obj):
        return obj.municipalities.count()


@admin.register(models.Municipality)
class MunicipalityAdmin(admin.ModelAdmin):
    list_display = ('name_sq', 'name_en', 'slug', 'region', 'places_count')
    list_filter = ('region',)
    search_fields = ('name_sq', 'name_en', 'slug')
    prepopulated_fields = {'slug': ('name_en',)}
    list_select_related = ('region',)
    inlines = (PlaceInline,)

    @admin.display(description='Places')
    def places_count(self, obj):
        return obj.places.count()


@admin.register(models.Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('name_sq', 'name_en', 'municipality', 'category', 'unlock_radius_m', 'sensitive', 'is_active')
    list_filter = ('category', 'sensitive', 'is_active', 'municipality__region')
    search_fields = ('name_sq', 'name_en', 'slug', 'municipality__name_en')
    prepopulated_fields = {'slug': ('name_en',)}
    list_select_related = ('municipality',)
    autocomplete_fields = ('municipality',)
    fieldsets = (
        ('Identity', {
            'fields': ('slug', 'municipality', 'category', 'tags', 'is_active', 'sensitive')
        }),
        ('Names', {
            'fields': ('name_sq', 'name_en', 'name_de', 'name_fr', 'name_sr')
        }),
        ('Location & unlock', {
            'fields': ('lat', 'lng', 'unlock_radius_m', 'elevation_m')
        }),
        ('Story', {
            'fields': ('summary_sq', 'summary_en', 'summary_de', 'summary_fr',
                       'summary_source', 'summary_url', 'image', 'photos')
        }),
        ('Practical', {
            'fields': ('best_time', 'duration_min', 'difficulty', 'opening_hours',
                       'website', 'phone', 'wheelchair', 'fee', 'access')
        }),
        ('Sources', {
            'fields': ('osm_id', 'osm_url', 'wikidata', 'checked_at', 'xp', 'score')
        }),
    )


@admin.register(models.Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'friend_code', 'display_name', 'home_municipality', 'language', 'ghost_mode')
    list_filter = ('language', 'ghost_mode', 'location_sharing')
    search_fields = ('user__username', 'display_name')
    autocomplete_fields = ('home_municipality',)


@admin.register(models.SavedPlace)
class SavedPlaceAdmin(admin.ModelAdmin):
    list_display = ('user', 'place', 'created_at')
    search_fields = ('user__username', 'place__name_en')
    list_select_related = ('user', 'place')


@admin.register(models.PrivatePhoto)
class PrivatePhotoAdmin(admin.ModelAdmin):
    list_display = ('user', 'caption', 'created_at')
    search_fields = ('user__username', 'caption')
    list_select_related = ('user',)


@admin.register(models.Stamp)
class StampAdmin(admin.ModelAdmin):
    list_display = ('user', 'place', 'created_at')
    search_fields = ('user__username', 'place__name_en')
    list_select_related = ('user', 'place')


@admin.register(models.Unlock)
class UnlockAdmin(admin.ModelAdmin):
    list_display = ('user', 'place', 'unlocked_at', 'accuracy_m')
    list_filter = ('unlocked_at',)
    search_fields = ('user__username', 'place__name_en')


@admin.register(models.Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    list_display = ('from_user', 'to_user', 'status', 'created_at')
    list_filter = ('status',)


@admin.register(models.Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'place', 'created_at')
    list_filter = ('type',)


@admin.register(models.Postcard)
class PostcardAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'place', 'created_at')


@admin.register(models.Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name_sq', 'name_en', 'municipality', 'start_date')
    list_filter = ('start_date', 'municipality__region')
    search_fields = ('name_sq', 'name_en')


@admin.register(models.Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'municipality', 'start_date')
    filter_horizontal = ('participants', 'places')


@admin.register(models.Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('title_sq', 'title_en', 'points', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active',)


@admin.register(models.Streak)
class StreakAdmin(admin.ModelAdmin):
    list_display = ('user', 'current', 'longest', 'last_unlock_date')


@admin.register(models.LocationShare)
class LocationShareAdmin(admin.ModelAdmin):
    list_display = ('user', 'precision', 'updated_at')


@admin.register(models.Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('reporter', 'reported_user', 'place', 'reason', 'resolved', 'created_at')
    list_filter = ('reason', 'resolved')


@admin.register(models.WaitlistEntry)
class WaitlistEntryAdmin(admin.ModelAdmin):
    list_display = ('email', 'source', 'created_at')
    search_fields = ('email',)
