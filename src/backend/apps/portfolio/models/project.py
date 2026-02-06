from django.db import models
from django.core.exceptions import ValidationError


def get_default_visuals():
    return {
        "theme_color": "default-blue",
        "animation": "fade-up",
        "extra_classes": ""
    }


def validate_visuals(value):
    if not isinstance(value, dict):
        raise ValidationError("Value must be a dictionary")
    required_keys = ['theme_color', 'animation']
    for key in required_keys:
        if key not in value:
            raise ValidationError(f"Key '{key}' is missing in visual_config")


class Project(models.Model):
    # Enum для layout_type
    class LayoutType(models.TextChoices):
        CASE = 'case', 'Case Study'
        PRODUCT = 'product', 'Product Page'
        REPO = 'repo', 'Repository'
        CONFIG = 'config', 'Configuration'

    # Core fields
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='portfolio/projects/', blank=True, null=True)

    # Logic fields
    category = models.ForeignKey(
        'Category',
        on_delete=models.CASCADE,
        related_name='projects'
    )
    layout_type = models.CharField(
        max_length=20,
        choices=LayoutType.choices,
        default=LayoutType.CASE
    )
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    # Flexibility fields
    visual_config = models.JSONField(
        default=get_default_visuals,
        validators=[validate_visuals],
        help_text="Настройки CSS и анимаций"
    )
    extra_data = models.JSONField(
        default=dict,
        blank=True,
        help_text="Специфические данные: {'client': 'Tesla'} или {'stars': 405}"
    )

    class Meta:
        ordering = ['order']
        verbose_name = "Projekt"
        verbose_name_plural = "Projekte"

    def __str__(self):
        # Используем f-строку и явное обращение к значению
        layout_label = self.get_layout_type_display()
        return f"{self.title} ({layout_label})"