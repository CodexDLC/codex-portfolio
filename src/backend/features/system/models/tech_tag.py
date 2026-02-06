from django.db import models

class TechTag(models.Model):
    """
    Универсальный справочник тегов.
    Включает: Технологии, Статусы проектов, Типы проектов, Категории блога.
    """
    CATEGORY_CHOICES = [
        # Технологии
        ('backend', 'Backend (Python/Core)'),
        ('database', 'Database / Cache'),
        ('frontend', 'Frontend / UI'),
        ('devops', 'DevOps / Infrastructure'),
        ('tools', 'Tools / Quality'),
        
        # Мета-теги проектов
        ('project_status', 'Статус Проекта (Dev, Prod, Support)'),
        ('project_type', 'Тип Проекта (Open Source, Startup)'),
        
        ('other', 'Other'),
    ]

    name = models.CharField("Название", max_length=50, unique=True)
    slug = models.SlugField("Slug", max_length=50, unique=True, help_text="Для URL и фильтров")
    
    category = models.CharField("Категория", max_length=20, choices=CATEGORY_CHOICES, default='other')
    
    icon_class = models.CharField("CSS класс иконки", max_length=50, blank=True, help_text="Например: devicon-python-plain")
    
    # Опционально: цвет тега для UI
    color_hex = models.CharField("Цвет (HEX)", max_length=7, blank=True, help_text="#FFFFFF")

    is_active = models.BooleanField("Активен", default=True)
    order = models.PositiveIntegerField("Сортировка", default=0)

    class Meta:
        verbose_name = 'Тег / Технология'
        verbose_name_plural = 'Справочник тегов'
        ordering = ['category', 'order', 'name']

    def __str__(self):
        return f"[{self.get_category_display()}] {self.name}"
