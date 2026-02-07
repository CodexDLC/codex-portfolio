from django.db import migrations
from django.core.management import call_command

def load_fixtures(apps, schema_editor):
    call_command('loaddata', 'features/portfolio/fixtures/categories.json')
    call_command('loaddata', 'features/portfolio/fixtures/projects.json')

def reverse_func(apps, schema_editor):
    Category = apps.get_model("portfolio", "Category")
    Project = apps.get_model("portfolio", "Project")
    Project.objects.all().delete()
    Category.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0001_initial'),
        ('system', '0002_load_system_data'),
    ]

    operations = [
        migrations.RunPython(load_fixtures, reverse_func),
    ]
