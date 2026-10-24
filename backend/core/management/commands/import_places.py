import json
from datetime import date
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from core import models

DATA_DIR = Path(settings.BASE_DIR) / 'data'


def load_json(name):
    with open(DATA_DIR / name, encoding='utf-8') as handle:
        return json.load(handle)


def text(value):
    return '' if value is None else str(value)


def parse_date(value):
    if not value:
        return None
    try:
        return date.fromisoformat(str(value)[:10])
    except (ValueError, TypeError):
        return None


class Command(BaseCommand):
    help = 'Import regions, all 38 municipalities and every place from backend/data/*.json'

    def add_arguments(self, parser):
        parser.add_argument('--places-only', action='store_true', help='Skip regions and municipalities')

    @transaction.atomic
    def handle(self, *args, **options):
        if not options['places_only']:
            self.import_regions()
            self.import_municipalities()
        self.import_places()

        self.stdout.write(self.style.SUCCESS(
            f'Imported {models.Region.objects.count()} regions, '
            f'{models.Municipality.objects.count()} municipalities, '
            f'{models.Place.objects.count()} places.'
        ))

    def import_regions(self):
        for row in load_json('regions.json'):
            models.Region.objects.update_or_create(
                slug=row['slug'],
                defaults={
                    'name_sq': text(row.get('name_sq')),
                    'name_en': text(row.get('name_en')),
                    'name_de': text(row.get('name_de')),
                    'name_fr': text(row.get('name_fr')),
                },
            )
        self.stdout.write(f'  regions: {models.Region.objects.count()}')

    def import_municipalities(self):
        for row in load_json('municipalities.json'):
            region = models.Region.objects.filter(slug=row.get('region')).first()
            models.Municipality.objects.update_or_create(
                slug=row['slug'],
                defaults={
                    'region': region,
                    'name_sq': text(row.get('name_sq')),
                    'name_en': text(row.get('name_en')),
                    'name_de': text(row.get('name_de')),
                    'name_fr': text(row.get('name_fr')),
                    'name_sr': text(row.get('name_sr')),
                    'blurb_sq': text(row.get('blurb_sq')),
                    'blurb_en': text(row.get('blurb_en')),
                    'blurb_de': text(row.get('blurb_de')),
                    'blurb_fr': text(row.get('blurb_fr')),
                    'lat': row.get('lat'),
                    'lng': row.get('lng'),
                    'population': row.get('population'),
                    'population_year': row.get('population_year'),
                    'area_km2': row.get('area_km2'),
                    'website': text(row.get('website')),
                    'wikidata': text(row.get('wikidata')),
                    'image': row.get('image') or {},
                },
            )
        self.stdout.write(f'  municipalities: {models.Municipality.objects.count()}')

    def import_places(self):
        catalogue = {choice[0] for choice in models.Place.CATEGORY_CHOICES}
        for row in load_json('places.json'):
            municipality = models.Municipality.objects.filter(slug=row.get('municipality')).first()
            if municipality is None:
                self.stderr.write(f'  skipped {row.get("slug")}: unknown municipality {row.get("municipality")}')
                continue

            category = (row.get('category') or 'other').lower()
            if category not in catalogue:
                self.stderr.write(f'  {row.get("slug")}: unknown category {category!r}, stored as other')
                category = 'other'

            models.Place.objects.update_or_create(
                slug=row['slug'],
                defaults={
                    'municipality': municipality,
                    'name_sq': text(row.get('name_sq')),
                    'name_en': text(row.get('name_en')),
                    'name_de': text(row.get('name_de')),
                    'name_fr': text(row.get('name_fr')),
                    'name_sr': text(row.get('name_sr')),
                    'category': category,
                    'tags': row.get('tags') or [],
                    'lat': row['lat'],
                    'lng': row['lng'],
                    'unlock_radius_m': row.get('unlock_radius_m') or 100,
                    'elevation_m': row.get('elevation_m'),
                    'summary_sq': text(row.get('summary_sq')),
                    'summary_en': text(row.get('summary_en')),
                    'summary_de': text(row.get('summary_de')),
                    'summary_fr': text(row.get('summary_fr')),
                    'summary_source': text(row.get('summary_source')),
                    'summary_url': text(row.get('summary_url')),
                    'best_time': text(row.get('best_time')),
                    'duration_min': row.get('duration_min'),
                    'difficulty': text(row.get('difficulty')),
                    'sensitive': bool(row.get('sensitive')),
                    'opening_hours': text(row.get('opening_hours')),
                    'website': text(row.get('website')),
                    'phone': text(row.get('phone')),
                    'wheelchair': text(row.get('wheelchair')),
                    'fee': text(row.get('fee')),
                    'access': text(row.get('access')),
                    'osm_id': text(row.get('osm_id')),
                    'osm_url': text(row.get('osm_url')),
                    'wikidata': text(row.get('wikidata')),
                    'checked_at': parse_date(row.get('checked_at')),
                    'photos': row.get('photos') or [],
                    'image': row.get('image') or {},
                    'xp': row.get('xp') or 0,
                    'score': row.get('score') or 0,
                },
            )
        self.stdout.write(f'  places: {models.Place.objects.count()}')
