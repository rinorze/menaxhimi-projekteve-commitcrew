from django.contrib.auth.models import User
from django.db import models


class Region(models.Model):
    name_sq = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name_en


class Municipality(models.Model):
    region = models.ForeignKey(Region, on_delete=models.PROTECT, related_name='municipalities')
    name_sq = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description_sq = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name_en


class Place(models.Model):
    CATEGORY_CHOICES = [
        ('nature', 'Nature'), ('history', 'History'), ('culture', 'Culture'),
        ('food', 'Food'), ('viewpoint', 'Viewpoint'), ('religious', 'Religious'),
        ('festival', 'Festival'), ('other', 'Other'),
    ]
    municipality = models.ForeignKey(Municipality, on_delete=models.PROTECT, related_name='places')
    name_sq = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    description_sq = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    story_sq = models.TextField(blank=True)
    story_en = models.TextField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    unlock_radius_m = models.IntegerField(default=100)
    address_sq = models.CharField(max_length=255, blank=True)
    address_en = models.CharField(max_length=255, blank=True)
    is_religious_respect = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    image = models.ImageField(upload_to='places/', blank=True, null=True)

    def __str__(self):
        return self.name_en


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    home_town = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    language = models.CharField(max_length=5, default='sq')
    ghost_mode = models.BooleanField(default=False)
    location_sharing = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


class Unlock(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='unlocks')
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='unlocks')
    unlocked_at = models.DateTimeField(auto_now_add=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    accuracy_m = models.FloatField(null=True, blank=True)
    photo = models.ImageField(upload_to='unlocks/', blank=True, null=True)

    class Meta:
        unique_together = ('user', 'place')

    def __str__(self):
        return f"{self.user.username} - {self.place.name_en}"


class Stamp(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stamps')
    place = models.ForeignKey(Place, on_delete=models.CASCADE)
    unlock = models.OneToOneField(Unlock, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'place')


class Friendship(models.Model):
    STATUS_CHOICES = [('pending', 'Pending'), ('accepted', 'Accepted'), ('blocked', 'Blocked')]
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_requests_sent')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_requests_received')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('from_user', 'to_user')


class Activity(models.Model):
    TYPE_CHOICES = [('unlock', 'Unlock'), ('friend', 'Friend'), ('quest', 'Quest'), ('event', 'Event')]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    place = models.ForeignKey(Place, on_delete=models.SET_NULL, null=True, blank=True)
    text_sq = models.CharField(max_length=255, blank=True)
    text_en = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Postcard(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='postcards_sent')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='postcards_received')
    place = models.ForeignKey(Place, on_delete=models.SET_NULL, null=True, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)


class Event(models.Model):
    municipality = models.ForeignKey(Municipality, on_delete=models.SET_NULL, null=True, blank=True)
    name_sq = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200)
    description_sq = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='events/', blank=True, null=True)

    def __str__(self):
        return self.name_en


class Report(models.Model):
    REASON_CHOICES = [('spam', 'Spam'), ('inappropriate', 'Inappropriate'), ('fake', 'Fake'), ('other', 'Other')]
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_made')
    reported_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_received', null=True, blank=True)
    place = models.ForeignKey(Place, on_delete=models.CASCADE, null=True, blank=True)
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)
