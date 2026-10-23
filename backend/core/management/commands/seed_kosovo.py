from django.core.management.base import BaseCommand
from core import models


class Command(BaseCommand):
    help = 'Seed Kosovo regions and municipalities'

    def handle(self, *args, **options):
        # Regions
        regions_data = [
            ('Prishtinë', 'Prishtina', 'prishtine'),
            ('Mitrovicë', 'Mitrovica', 'mitrovica'),
            ('Pejë', 'Peja', 'peja'),
            ('Prizren', 'Prizren', 'prizren'),
            ('Ferizaj', 'Ferizaj', 'ferizaj'),
            ('Gjilan', 'Gjilan', 'gjilan'),
            ('Gjakovë', 'Gjakova', 'gjakova'),
        ]
        for name_sq, name_en, slug in regions_data:
            models.Region.objects.get_or_create(slug=slug, defaults={'name_sq': name_sq, 'name_en': name_en})

        # Municipalities
        municipalities = [
            ('prishtine', 'Prishtinë', 'Prishtina', 'prishtine'),
            ('prishtine', 'Fushë Kosovë', 'Fushe Kosove', 'fushe-kosove'),
            ('prishtine', 'Obiliq', 'Obiliq', 'obiliq'),
            ('prishtine', 'Lipjan', 'Lipjan', 'lipjan'),
            ('prishtine', 'Podujevë', 'Podujeva', 'podujeve'),
            ('prishtine', 'Drenas', 'Drenas', 'drenas'),
            ('prishtine', 'Graçanicë', 'Gracanica', 'gracanice'),
            ('prishtine', 'Novobërdë', 'Novo Brdo', 'novoberde'),
            ('mitrovica', 'Mitrovicë', 'Mitrovica', 'mitrovice'),
            ('mitrovica', 'Mitrovicë e Veriut', 'North Mitrovica', 'mitrovice-e-veriut'),
            ('mitrovica', 'Vushtrri', 'Vushtrri', 'vushtrri'),
            ('mitrovica', 'Skënderaj', 'Skenderaj', 'skenderaj'),
            ('mitrovica', 'Zveçan', 'Zvecan', 'zvecan'),
            ('mitrovica', 'Zubin Potok', 'Zubin Potok', 'zubin-potok'),
            ('mitrovica', 'Leposaviq', 'Leposavic', 'leposaviq'),
            ('peja', 'Pejë', 'Peja', 'peje'),
            ('peja', 'Istog', 'Istog', 'istog'),
            ('peja', 'Klinë', 'Klina', 'kline'),
            ('prizren', 'Prizren', 'Prizren', 'prizren-muni'),
            ('prizren', 'Suharekë', 'Suhareka', 'suhareke'),
            ('prizren', 'Malishevë', 'Malisheva', 'malisheve'),
            ('prizren', 'Dragash', 'Dragash', 'dragash'),
            ('prizren', 'Mamushë', 'Mamusha', 'mamushe'),
            ('ferizaj', 'Ferizaj', 'Ferizaj', 'ferizaj-muni'),
            ('ferizaj', 'Kaçanik', 'Kacanik', 'kacanik'),
            ('ferizaj', 'Shtime', 'Shtime', 'shtime'),
            ('ferizaj', 'Shtërpcë', 'Strpce', 'shterpce'),
            ('ferizaj', 'Hani i Elezit', 'Hani i Elezit', 'hani-i-elezit'),
            ('gjilan', 'Gjilan', 'Gjilan', 'gjilan-muni'),
            ('gjilan', 'Kamenicë', 'Kamenica', 'kamenice'),
            ('gjilan', 'Viti', 'Viti', 'viti'),
            ('gjilan', 'Kllokot', 'Kllokot', 'kllokot'),
            ('gjilan', 'Ranillug', 'Ranillug', 'ranillug'),
            ('gjilan', 'Partesh', 'Partesh', 'partesh'),
            ('gjakova', 'Gjakovë', 'Gjakova', 'gjakove'),
            ('gjakova', 'Rahovec', 'Rahovec', 'rahovec'),
            ('gjakova', 'Deçan', 'Decan', 'decan'),
            ('gjakova', 'Junik', 'Junik', 'junik'),
        ]
        for region_slug, name_sq, name_en, slug in municipalities:
            region = models.Region.objects.get(slug=region_slug)
            models.Municipality.objects.get_or_create(slug=slug, defaults={'region': region, 'name_sq': name_sq, 'name_en': name_en})

        self.stdout.write(self.style.SUCCESS('Seeded regions and municipalities'))
