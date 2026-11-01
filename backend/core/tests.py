from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from . import models


class HealthTests(TestCase):
    def test_health(self):
        res = self.client.get('/api/health/')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()['ok'])


class AuthTests(TestCase):
    def test_register_and_login(self):
        client = APIClient()
        res = client.post('/api/auth/register/', {
            'username': 'newuser',
            'password': 'Str0ngPass!23',
            'password2': 'Str0ngPass!23',
        }, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertIn('access', res.json())
        self.assertTrue(models.Profile.objects.filter(user__username='newuser').exists())

        res = client.post('/api/auth/login/', {'username': 'newuser', 'password': 'Str0ngPass!23'}, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertIn('access', res.json())

    def test_register_password_mismatch(self):
        client = APIClient()
        res = client.post('/api/auth/register/', {
            'username': 'baduser',
            'password': 'Str0ngPass!23',
            'password2': 'Different!23',
        }, format='json')
        self.assertEqual(res.status_code, 400)


class PlaceTests(TestCase):
    def setUp(self):
        self.region = models.Region.objects.create(name_sq='Prishtine', name_en='Prishtina', slug='prishtine')
        self.muni = models.Municipality.objects.create(
            region=self.region, name_sq='Prishtine', name_en='Prishtina', slug='prishtine-muni'
        )
        self.place = models.Place.objects.create(
            municipality=self.muni, name_sq='Ura', name_en='Bridge', slug='bridge',
            lat=42.6629, lng=21.1655, unlock_radius_m=100,
        )

    def test_list_places(self):
        res = self.client.get('/api/places/')
        self.assertEqual(res.status_code, 200)
        results = res.json().get('results', res.json())
        self.assertTrue(any(p['slug'] == 'bridge' for p in results))

    def test_list_municipalities(self):
        res = self.client.get('/api/municipalities/')
        self.assertEqual(res.status_code, 200)
        results = res.json()
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['slug'], 'prishtine-muni')

    def test_place_detail(self):
        res = self.client.get('/api/places/bridge/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['name_en'], 'Bridge')


class UnlockTests(TestCase):
    def setUp(self):
        self.region = models.Region.objects.create(name_sq='X', name_en='X', slug='x')
        self.muni = models.Municipality.objects.create(region=self.region, name_sq='X', name_en='X', slug='x-muni')
        self.place = models.Place.objects.create(
            municipality=self.muni, name_sq='V', name_en='Place', slug='place',
            lat=42.6629, lng=21.1655, unlock_radius_m=100,
        )
        self.user = User.objects.create_user(username='u1', password='Str0ngPass!23')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_unlock_in_range(self):
        res = self.client.post('/api/unlocks/', {
            'place_slug': 'place', 'lat': 42.6629, 'lng': 21.1655, 'accuracy_m': 10,
        }, format='json')
        self.assertEqual(res.status_code, 201)
        self.assertTrue(models.Unlock.objects.filter(user=self.user, place=self.place).exists())
        self.assertTrue(models.Stamp.objects.filter(user=self.user, place=self.place).exists())
        self.assertTrue(models.Activity.objects.filter(user=self.user, type='unlock').exists())

    def test_unlock_out_of_range(self):
        res = self.client.post('/api/unlocks/', {
            'place_slug': 'place', 'lat': 42.7, 'lng': 21.2, 'accuracy_m': 10,
        }, format='json')
        self.assertEqual(res.status_code, 400)
        self.assertFalse(models.Unlock.objects.exists())

    def test_unlock_bad_accuracy(self):
        res = self.client.post('/api/unlocks/', {
            'place_slug': 'place', 'lat': 42.6629, 'lng': 21.1655, 'accuracy_m': 200,
        }, format='json')
        self.assertEqual(res.status_code, 400)

    def test_unlock_twice(self):
        data = {'place_slug': 'place', 'lat': 42.6629, 'lng': 21.1655, 'accuracy_m': 10}
        self.client.post('/api/unlocks/', data, format='json')
        res = self.client.post('/api/unlocks/', data, format='json')
        self.assertEqual(res.status_code, 400)

    def test_unlock_requires_auth(self):
        self.client.force_authenticate(user=None)
        res = self.client.post('/api/unlocks/', {'place_slug': 'place', 'lat': 1, 'lng': 1}, format='json')
        self.assertEqual(res.status_code, 401)


class FriendsTests(TestCase):
    def setUp(self):
        self.a = User.objects.create_user(username='a', password='Str0ngPass!23')
        self.b = User.objects.create_user(username='b', password='Str0ngPass!23')
        self.client = APIClient()

    def test_friend_request_and_accept(self):
        self.client.force_authenticate(user=self.a)
        res = self.client.post('/api/friends/', {'to_username': 'b'}, format='json')
        self.assertEqual(res.status_code, 201)
        fid = res.json()['id']

        self.client.force_authenticate(user=self.b)
        res = self.client.post('/api/friends/{0}/'.format(fid), {'action': 'accept'}, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['status'], 'accepted')

    def test_cannot_friend_yourself(self):
        self.client.force_authenticate(user=self.a)
        res = self.client.post('/api/friends/', {'to_username': 'a'}, format='json')
        self.assertEqual(res.status_code, 400)


class ChatTests(TestCase):
    def setUp(self):
        self.a = User.objects.create_user(username='chat_a', password='Str0ngPass!23')
        self.b = User.objects.create_user(username='chat_b', password='Str0ngPass!23')
        self.client = APIClient()

    def test_create_conversation_and_send_message(self):
        self.client.force_authenticate(user=self.a)
        res = self.client.post('/api/conversations/', {'username': 'chat_b'}, format='json')
        self.assertEqual(res.status_code, 201)
        cid = res.json()['id']

        res = self.client.post('/api/conversations/{0}/messages/'.format(cid), {'content': 'Tung'}, format='json')
        self.assertEqual(res.status_code, 201)

        self.client.force_authenticate(user=self.b)
        res = self.client.get('/api/conversations/{0}/messages/'.format(cid))
        self.assertEqual(res.status_code, 200)
        results = res.json().get('results', res.json())
        self.assertEqual(len(results), 1)

    def test_cannot_read_someone_elses_conversation(self):
        self.client.force_authenticate(user=self.a)
        cid = self.client.post('/api/conversations/', {'username': 'chat_b'}, format='json').json()['id']
        outsider = User.objects.create_user(username='outsider', password='Str0ngPass!23')
        self.client.force_authenticate(user=outsider)
        res = self.client.get('/api/conversations/{0}/messages/'.format(cid))
        self.assertEqual(res.status_code, 404)


class AIRouteTests(TestCase):
    def test_ask_returns_db_places_only(self):
        region = models.Region.objects.create(name_sq='R', name_en='R', slug='r')
        muni = models.Municipality.objects.create(region=region, name_sq='M', name_en='M', slug='m')
        models.Place.objects.create(
            municipality=muni, name_sq='P', name_en='Prizren Fortress', slug='fortress',
            lat=42.2, lng=20.7,
        )
        res = APIClient().post('/api/ai/ask/', {'question': 'Prizren'}, format='json')
        self.assertEqual(res.status_code, 200)
        slugs = [p['slug'] for p in res.json()['places']]
        self.assertIn('fortress', slugs)

    def test_plan_returns_db_places_only(self):
        region = models.Region.objects.create(name_sq='R2', name_en='R2', slug='r2')
        muni = models.Municipality.objects.create(region=region, name_sq='M2', name_en='M2', slug='m2')
        models.Place.objects.create(municipality=muni, name_sq='P2', name_en='P2', slug='p2', lat=1, lng=1)
        res = APIClient().post('/api/ai/plan/', {'hours': 4}, format='json')
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(len(res.json()['stops']), 1)


class TripTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='trip_u', password='Str0ngPass!23')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_and_list_trip(self):
        res = self.client.post('/api/trips/', {'name': 'Weekend'}, format='json')
        self.assertEqual(res.status_code, 201)
        res = self.client.get('/api/trips/')
        self.assertEqual(res.status_code, 200)
        results = res.json().get('results', res.json())
        self.assertEqual(len(results), 1)

    def test_streak_default(self):
        res = self.client.get('/api/streak/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['current'], 0)


class WaitlistTests(TestCase):
    def test_waitlist_create(self):
        client = APIClient()
        res = client.post('/api/waitlist/', {'email': 'test@example.com'}, format='json')
        self.assertIn(res.status_code, [200, 201])
        self.assertTrue(models.WaitlistEntry.objects.filter(email='test@example.com').exists())


class ImportPlacesTests(TestCase):
    """The real import of backend/data/*.json (fails on PostgreSQL if a field is too short for the data)."""

    def test_import_all_places(self):
        from django.core.management import call_command

        call_command('import_places', verbosity=0)
        self.assertEqual(models.Municipality.objects.count(), 38)
        self.assertEqual(models.Place.objects.count(), 318)
        # categories come through as they are in the data, not all collapsed into "other"
        self.assertGreater(models.Place.objects.filter(category='peak').count(), 50)
        self.assertLess(models.Place.objects.filter(category='other').count(), 20)
        # the photo keeps its credit and licence
        bridge = models.Place.objects.get(slug='ura-e-gurit')
        self.assertTrue(bridge.image.get('url', '').startswith('https://'))
        self.assertTrue(bridge.image.get('credit'))

    def test_import_twice_is_safe(self):
        from django.core.management import call_command

        call_command('import_places', verbosity=0)
        call_command('import_places', verbosity=0)
        self.assertEqual(models.Place.objects.count(), 318)


class ProfilePrivacyTests(TestCase):
    def setUp(self):
        self.region = models.Region.objects.create(name_sq='R', name_en='R', slug='privacy-r')
        self.municipality = models.Municipality.objects.create(
            region=self.region,
            name_sq='M',
            name_en='M',
            slug='privacy-m',
            lat=42.2,
            lng=21.1,
        )
        self.place = models.Place.objects.create(
            municipality=self.municipality,
            name_sq='P',
            name_en='P',
            slug='privacy-p',
            lat=42.2,
            lng=21.1,
        )
        self.user = User.objects.create_user(username='privacy_user', password='Str0ngPass!23')
        self.profile = models.Profile.objects.create(user=self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_profile_defaults_and_real_stats(self):
        self.assertEqual(len(self.profile.friend_code), 7)
        other = User.objects.create_user(username='privacy_other', password='Str0ngPass!23')
        models.Stamp.objects.create(user=self.user, place=self.place)
        models.SavedPlace.objects.create(user=self.user, place=self.place)
        models.Trip.objects.create(owner=self.user, name='Trip')
        models.Postcard.objects.create(sender=self.user, recipient=other, place=self.place)
        models.Streak.objects.create(user=self.user, current=3, longest=5)

        response = self.client.get('/api/profile/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['friend_code'], self.profile.friend_code)
        self.assertFalse(response.json()['location_sharing'])
        self.assertEqual(response.json()['sharing_precision'], 'city')
        self.assertEqual(response.json()['stop_sharing_after_minutes'], 60)
        self.assertEqual(response.json()['stats'], {
            'stamps': 1,
            'municipalities': {'visited': 1, 'total': 1},
            'streak': {'current': 3, 'longest': 5},
            'saved_places': 1,
            'trips': 1,
            'postcards': 1,
        })

    def test_notification_preferences_patch_merges_defaults(self):
        response = self.client.patch(
            '/api/profile/',
            {'notification_preferences': {'messages': False}},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()['notification_preferences']['messages'])
        self.assertTrue(response.json()['notification_preferences']['friend_requests'])

    def test_private_photos_are_owner_only(self):
        photo = models.PrivatePhoto.objects.create(
            user=self.user, image_url='https://example.com/private.jpg', caption='Private'
        )
        other = User.objects.create_user(username='photo_other', password='Str0ngPass!23')
        other_client = APIClient()
        other_client.force_authenticate(user=other)

        photos = self.client.get('/api/profile/photos/').json()
        other_photos = other_client.get('/api/profile/photos/').json()
        self.assertEqual(photos.get('results', photos)[0]['id'], photo.id)
        self.assertEqual(other_photos.get('results', other_photos), [])
        self.assertEqual(other_client.delete(f'/api/profile/photos/{photo.id}/').status_code, 404)

    def test_saved_places_are_owner_scoped_and_idempotent(self):
        first = self.client.post(
            '/api/saved-places/', {'place_slug': self.place.slug}, format='json'
        )
        second = self.client.post(
            '/api/saved-places/', {'place_slug': self.place.slug}, format='json'
        )
        other = User.objects.create_user(username='saved_other', password='Str0ngPass!23')
        other_client = APIClient()
        other_client.force_authenticate(user=other)

        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 200)
        saved_places = self.client.get('/api/saved-places/').json()
        other_saved_places = other_client.get('/api/saved-places/').json()
        self.assertEqual(len(saved_places.get('results', saved_places)), 1)
        self.assertEqual(other_saved_places.get('results', other_saved_places), [])

    def test_ghost_mode_revokes_location_and_hides_user(self):
        friend = User.objects.create_user(username='location_friend', password='Str0ngPass!23')
        friend_profile = models.Profile.objects.create(
            user=friend, location_sharing=True, sharing_precision='exact'
        )
        models.Friendship.objects.create(
            from_user=friend, to_user=self.user, status='accepted'
        )
        models.Activity.objects.create(
            user=friend,
            type='unlock',
            place=self.place,
            text_en='Unlocked P',
            text_sq='Zhbllokoi P',
        )
        models.LocationShare.objects.create(
            user=friend, lat=42.2, lng=21.1, precision='exact'
        )

        response = self.client.get('/api/location-shares/')
        self.assertEqual(response.status_code, 200)
        shares = response.json().get('results', response.json())
        self.assertEqual(shares[0]['lat'], 42.2)
        self.assertEqual(len(self.client.get('/api/activity/').json()['results']), 1)

        friend_client = APIClient()
        friend_client.force_authenticate(user=friend)
        response = friend_client.patch('/api/profile/', {'ghost_mode': True}, format='json')

        self.assertEqual(response.status_code, 200)
        friend_profile.refresh_from_db()
        self.assertTrue(friend_profile.ghost_mode)
        self.assertFalse(friend_profile.location_sharing)
        self.assertFalse(models.LocationShare.objects.filter(user=friend).exists())
        shares = self.client.get('/api/location-shares/').json()
        self.assertEqual(shares.get('results', shares), [])
        self.assertEqual(self.client.get('/api/activity/').json()['results'], [])

    def test_location_sharing_respects_preferences_and_expiration(self):
        self.assertEqual(
            self.client.post(
                '/api/location-shares/', {'lat': 42.1, 'lng': 21.1}, format='json'
            ).status_code,
            403,
        )
        self.profile.location_sharing = True
        self.profile.stop_sharing_after_minutes = 15
        self.profile.sharing_precision = 'km'
        self.profile.save()

        response = self.client.post(
            '/api/location-shares/', {'lat': 42.1234, 'lng': 21.1234}, format='json'
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['precision'], 'km')
        self.assertEqual(response.json()['lat'], 42.12)
        self.assertEqual(response.json()['lng'], 21.12)
        self.assertIsNotNone(response.json()['expires_at'])

    def test_blocked_people_can_be_listed_and_unblocked(self):
        other = User.objects.create_user(username='blocked_other', password='Str0ngPass!23')
        relation = models.Friendship.objects.create(
            from_user=other, to_user=self.user, status='pending'
        )
        response = self.client.post(
            '/api/blocked/', {'username': other.username}, format='json'
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['status'], 'blocked')
        self.assertFalse(models.Friendship.objects.filter(pk=relation.pk).exists())
        self.assertEqual(
            self.client.post(
                '/api/friends/', {'to_username': other.username}, format='json'
            ).status_code,
            403,
        )
        self.assertEqual(
            self.client.post(
                '/api/conversations/', {'username': other.username}, format='json'
            ).status_code,
            403,
        )
        blocked = self.client.get('/api/blocked/').json()
        self.assertEqual(len(blocked.get('results', blocked)), 1)
        response = self.client.delete(f"/api/blocked/{response.json()['id']}/")
        self.assertEqual(response.status_code, 204)
        blocked = self.client.get('/api/blocked/').json()
        self.assertEqual(blocked.get('results', blocked), [])

    def test_account_delete_requires_password_and_cascades(self):
        photo = models.PrivatePhoto.objects.create(
            user=self.user, image_url='https://example.com/private.jpg'
        )
        models.SavedPlace.objects.create(user=self.user, place=self.place)
        bad_password = self.client.delete(
            '/api/account/', {'password': 'wrong'}, format='json'
        )
        self.assertEqual(bad_password.status_code, 400)
        self.assertTrue(User.objects.filter(pk=self.user.pk).exists())

        response = self.client.delete(
            '/api/account/', {'password': 'Str0ngPass!23'}, format='json'
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())
        self.assertFalse(models.PrivatePhoto.objects.filter(pk=photo.pk).exists())
        self.assertFalse(models.SavedPlace.objects.exists())
