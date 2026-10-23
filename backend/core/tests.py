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
