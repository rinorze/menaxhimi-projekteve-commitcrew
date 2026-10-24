from django.db import migrations, models


class Migration(migrations.Migration):
    """The photo is an object {file, url, credit, license, source_url}, not a short string, and some place slugs are longer than 50."""

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        # drop and add (not alter): a text column cannot be cast to JSON when it already holds rows, and the old column never held a usable value
        migrations.RemoveField(model_name='municipality', name='image'),
        migrations.AddField(model_name='municipality', name='image', field=models.JSONField(blank=True, default=dict)),
        migrations.RemoveField(model_name='place', name='image'),
        migrations.AddField(model_name='place', name='image', field=models.JSONField(blank=True, default=dict)),
        migrations.AlterField(model_name='place', name='slug', field=models.SlugField(max_length=255, unique=True)),
    ]
