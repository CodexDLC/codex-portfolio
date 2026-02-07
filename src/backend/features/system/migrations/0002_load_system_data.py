from django.db import migrations
from django.core.management import call_command
import os

def load_fixtures(apps, schema_editor):
    # Используем относительные пути от manage.py (корня проекта)
    # Или абсолютные, чтобы наверняка
    
    # Вариант 1: По имени (если Django настроен искать в fixtures/)
    # call_command('loaddata', 'styles.json') 
    
    # Вариант 2: Явный путь
    call_command('loaddata', 'features/system/fixtures/styles.json')
    call_command('loaddata', 'features/system/fixtures/tags.json')

def reverse_func(apps, schema_editor):
    StyleAttribute = apps.get_model("system", "StyleAttribute")
    TechTag = apps.get_model("system", "TechTag")
    StyleAttribute.objects.all().delete()
    TechTag.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('system', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_fixtures, reverse_func),
    ]
