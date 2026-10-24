from django.contrib.auth.models import User
from django.db import models


class Timestamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# ---------------------------------------------------------------- places


class Region(models.Model):
    slug = models.SlugField(unique=True)
    name_sq = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    name_de = models.CharField(max_length=100, blank=True)
    name_fr = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['name_en']

    def __str__(self):
        return self.name_en


class Municipality(models.Model):
    slug = models.SlugField(unique=True)
    region = models.ForeignKey(Region, on_delete=models.PROTECT, related_name='municipalities')
    name_sq = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    name_de = models.CharField(max_length=100, blank=True)
    name_fr = models.CharField(max_length=100, blank=True)
    name_sr = models.CharField(max_length=100, blank=True)
    blurb_sq = models.TextField(blank=True)
    blurb_en = models.TextField(blank=True)
    blurb_de = models.TextField(blank=True)
    blurb_fr = models.TextField(blank=True)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    population = models.IntegerField(null=True, blank=True)
    population_year = models.IntegerField(null=True, blank=True)
    area_km2 = models.FloatField(null=True, blank=True)
    website = models.URLField(blank=True)
    wikidata = models.CharField(max_length=40, blank=True)
    # {file, url, credit, license, source_url} of the Wikimedia Commons photo; keep the credit with the picture
    image = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name_plural = 'municipalities'
        ordering = ['name_en']

    def __str__(self):
        return self.name_en


class Place(models.Model):
    # the same keys as backend/data/places.json; the app collections use them (peak, waterfall, fortress, cave)
    CATEGORY_CHOICES = [
        ('bridge', 'Bridge'),
        ('religious', 'Place of worship'),
        ('monument', 'Monument'),
        ('memorial', 'Memorial'),
        ('square', 'Square'),
        ('old_bazaar', 'Old bazaar'),
        ('kulla', 'Kulla (stone tower house)'),
        ('fortress', 'Fortress'),
        ('museum', 'Museum'),
        ('archaeology', 'Archaeology'),
        ('peak', 'Peak'),
        ('lake', 'Lake'),
        ('waterfall', 'Waterfall'),
        ('canyon', 'Canyon'),
        ('cave', 'Cave'),
        ('spring', 'Spring'),
        ('nature_park', 'Nature park'),
        ('viewpoint', 'Viewpoint'),
        ('ski', 'Ski'),
        ('winery', 'Winery'),
        ('spa', 'Spa'),
        ('other', 'Other'),
    ]

    slug = models.SlugField(max_length=255, unique=True)
    municipality = models.ForeignKey(Municipality, on_delete=models.PROTECT, related_name='places')
    name_sq = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200)
    name_de = models.CharField(max_length=200, blank=True)
    name_fr = models.CharField(max_length=200, blank=True)
    name_sr = models.CharField(max_length=200, blank=True)

    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES, default='other')
    tags = models.JSONField(default=list, blank=True)
    lat = models.FloatField()
    lng = models.FloatField()
    unlock_radius_m = models.PositiveIntegerField(default=100)
    elevation_m = models.IntegerField(null=True, blank=True)

    summary_sq = models.TextField(blank=True)
    summary_en = models.TextField(blank=True)
    summary_de = models.TextField(blank=True)
    summary_fr = models.TextField(blank=True)
    summary_source = models.CharField(max_length=255, blank=True)
    summary_url = models.URLField(blank=True)

    best_time = models.CharField(max_length=100, blank=True)
    duration_min = models.IntegerField(null=True, blank=True)
    difficulty = models.CharField(max_length=40, blank=True)
    sensitive = models.BooleanField(default=False)
    opening_hours = models.CharField(max_length=255, blank=True)
    website = models.URLField(blank=True)
    phone = models.CharField(max_length=60, blank=True)
    wheelchair = models.CharField(max_length=60, blank=True)
    fee = models.CharField(max_length=100, blank=True)
    access = models.CharField(max_length=255, blank=True)

    osm_id = models.CharField(max_length=40, blank=True)
    osm_url = models.URLField(blank=True)
    wikidata = models.CharField(max_length=40, blank=True)
    checked_at = models.DateField(null=True, blank=True)

    photos = models.JSONField(default=list, blank=True)
    # {file, url, credit, license, source_url} of the Wikimedia Commons photo; keep the credit with the picture
    image = models.JSONField(default=dict, blank=True)
    xp = models.IntegerField(default=0)
    score = models.FloatField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name_en']
        indexes = [
            models.Index(fields=['lat', 'lng']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return self.name_en


# ---------------------------------------------------------------- accounts


class Profile(Timestamped):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=100, blank=True)
    home_municipality = models.ForeignKey(
        Municipality, on_delete=models.SET_NULL, null=True, blank=True, related_name='residents'
    )
    language = models.CharField(max_length=5, default='sq')
    avatar = models.JSONField(default=dict, blank=True)
    bio = models.TextField(blank=True)
    ghost_mode = models.BooleanField(default=False)
    location_sharing = models.BooleanField(default=False)

    def __str__(self):
        return self.display_name or self.user.username


# ---------------------------------------------------------------- passport


class Stamp(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stamps')
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='stamps')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'place')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} · {self.place.name_en}'


# ---------------------------------------------------------------- unlock


class Unlock(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='unlocks')
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='unlocks')
    unlocked_at = models.DateTimeField(auto_now_add=True)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    accuracy_m = models.FloatField(null=True, blank=True)
    photo = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ('user', 'place')
        ordering = ['-unlocked_at']

    def __str__(self):
        return f'{self.user.username} · {self.place.name_en}'


# ---------------------------------------------------------------- social


class Friendship(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('blocked', 'Blocked'),
    ]

    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendships_sent')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendships_received')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        return f'{self.from_user.username} → {self.to_user.username} ({self.status})'


class Activity(models.Model):
    TYPE_CHOICES = [
        ('unlock', 'Unlock'),
        ('friend', 'Friend'),
        ('quest', 'Quest'),
        ('event', 'Event'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    place = models.ForeignKey(Place, on_delete=models.SET_NULL, null=True, blank=True)
    text_sq = models.CharField(max_length=255, blank=True)
    text_en = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'activities'


class Postcard(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='postcards_sent')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='postcards_received')
    place = models.ForeignKey(Place, on_delete=models.SET_NULL, null=True, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------------------------------------------------------- chat


class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']


# ---------------------------------------------------------------- trips & progress


class Trip(models.Model):
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    participants = models.ManyToManyField(User, related_name='trips_joined', blank=True)
    municipality = models.ForeignKey(Municipality, on_delete=models.SET_NULL, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    places = models.ManyToManyField(Place, related_name='trips', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Challenge(models.Model):
    title_sq = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200)
    description_sq = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    points = models.IntegerField(default=10)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return self.title_en


class Streak(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='streak')
    current = models.IntegerField(default=0)
    longest = models.IntegerField(default=0)
    last_unlock_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f'{self.user.username}: {self.current}'


class LocationShare(models.Model):
    PRECISION_CHOICES = [('city', 'City'), ('km', '1 km'), ('exact', 'Exact')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='location_shares')
    lat = models.FloatField()
    lng = models.FloatField()
    precision = models.CharField(max_length=10, choices=PRECISION_CHOICES, default='city')
    expires_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)


# ---------------------------------------------------------------- events & moderation


class Event(models.Model):
    municipality = models.ForeignKey(Municipality, on_delete=models.SET_NULL, null=True, blank=True)
    name_sq = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200)
    description_sq = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    image = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['start_date']

    def __str__(self):
        return self.name_en


class Report(models.Model):
    REASON_CHOICES = [
        ('spam', 'Spam'),
        ('inappropriate', 'Inappropriate'),
        ('fake', 'Fake'),
        ('other', 'Other'),
    ]

    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_made')
    reported_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='reports_received', null=True, blank=True
    )
    place = models.ForeignKey(Place, on_delete=models.CASCADE, null=True, blank=True)
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)


class WaitlistEntry(models.Model):
    email = models.EmailField(unique=True)
    source = models.CharField(max_length=40, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'waitlist entries'

    def __str__(self):
        return self.email
