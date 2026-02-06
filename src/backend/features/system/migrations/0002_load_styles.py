import json
import os
from django.db import migrations
from django.conf import settings

def load_data(apps, schema_editor):
    # 1. Load Styles
    StyleAttribute = apps.get_model('system', 'StyleAttribute')
    styles_path = os.path.join(settings.BASE_DIR, 'features', 'system', 'fixtures', 'styles.json')
    
    if os.path.exists(styles_path):
        with open(styles_path, 'r', encoding='utf-8') as f:
            styles_data = json.load(f)
            for item in styles_data:
                fields = item['fields']
                StyleAttribute.objects.update_or_create(
                    css_class=fields['css_class'],
                    defaults={
                        'name': fields['name'],
                        'target_area': fields['target_area'],
                        'attr_type': fields['attr_type']
                    }
                )

    # 2. Load Tags
    TechTag = apps.get_model('system', 'TechTag')
    tags_path = os.path.join(settings.BASE_DIR, 'features', 'system', 'fixtures', 'tags.json')
    
    if os.path.exists(tags_path):
        with open(tags_path, 'r', encoding='utf-8') as f:
            tags_data = json.load(f)
            for item in tags_data:
                fields = item['fields']
                TechTag.objects.update_or_create(
                    slug=fields['slug'],
                    defaults={
                        'name': fields['name'],
                        'category': fields['category'],
                        'icon_class': fields.get('icon_class', ''),
                        'color_hex': fields.get('color_hex', ''),
                        'order': fields.get('order', 0),
                        'is_active': fields.get('is_active', True),
                    }
                )

class Migration(migrations.Migration):
    dependencies = [
        ('system', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_data, reverse_code=migrations.RunPython.noop),
    ]
