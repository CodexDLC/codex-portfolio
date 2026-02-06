from django.db import models


class Category(models.Model):
    title = models.CharField("Заголовок", max_length=100)
    slug = models.SlugField("Слаг", max_length=100, unique=True)
    order = models.PositiveIntegerField("Порядок", default=0)

    # Визуальные настройки для таба/секции
    theme_color = models.CharField(
        "CSS Класс темы",
        max_length=50,
        help_text="Например: bg-blue-500 или text-emerald-400"
    )
    animation_preset = models.CharField(
        "Эффект анимации",
        max_length=50,
        help_text="Например: fade-in или slide-up"
    )

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ['order']

    def __str__(self):
        return self.title