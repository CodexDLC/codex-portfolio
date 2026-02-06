from django.db import models


class StyleAttribute(models.Model):
    TARGET_CHOICES = [
        ('all', 'Общий (Для всех)'),
        ('portfolio', 'Только Портфолио'),
        ('experience', 'Только Опыт'),
    ]

    TYPE_CHOICES = [
        ('layout', 'Размер / Сетка'),
        ('state', 'Состояние / Статус'),
        ('visual', 'Визуал / Тема'),
        ('typography', 'Текст'),
    ]

    name = models.CharField("Имя в админке", max_length=50)
    # unique=True обязательно, чтобы миграция могла обновлять записи
    css_class = models.CharField("CSS Класс", max_length=100, unique=True)

    target_area = models.CharField(choices=TARGET_CHOICES, default='all', max_length=20)
    attr_type = models.CharField(choices=TYPE_CHOICES, default='visual', max_length=20)

    class Meta:
        verbose_name = 'Атрибут стиля'
        verbose_name_plural = 'Библиотека стилей'

    def __str__(self):
        return f"[{self.get_attr_type_display()}] {self.name}"