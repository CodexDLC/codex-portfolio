from django.db import models
from django.utils.translation import gettext_lazy as _
from features.system.models import StyleAttribute, TechTag
from .category import Category

class Project(models.Model):
    """
    Проект в портфолио.
    Отображается как Bento-карточка.
    """
    STATUS_CHOICES = [
        ('dev', 'В разработке'),
        ('prod', 'В продакшене'),
        ('support', 'В поддержке'),
        ('archived', 'Архив'),
        ('concept', 'Концепт / MVP'),
    ]

    TYPE_CHOICES = [
        ('commercial', 'Коммерческий'),
        ('startup', 'Стартап'),
        ('opensource', 'Open Source'),
        ('pet', 'Pet Project'),
        ('enterprise', 'Enterprise'),
    ]

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='projects',
        verbose_name=_("Категория"),
        null=True # Временно null=True, чтобы миграции не упали на существующих данных (если бы они были)
    )

    title = models.CharField(_("Название"), max_length=100)
    slug = models.SlugField(_("Slug"), unique=True)
    description = models.TextField(_("Краткое описание"), blank=True)
    
    # Внешний вид (Bento)
    style_visual = models.ForeignKey(
        StyleAttribute, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='projects_visual',
        limit_choices_to={'attr_type': 'visual'},
        verbose_name=_("Стиль (Визуал)")
    )
    
    style_layout = models.ForeignKey(
        StyleAttribute, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='projects_layout',
        limit_choices_to={'attr_type': 'layout'},
        verbose_name=_("Размер (Сетка)")
    )

    # Технологии и Теги
    tags = models.ManyToManyField(
        TechTag, 
        blank=True, 
        related_name='projects',
        verbose_name=_("Технологии")
    )

    # Метаданные
    status = models.CharField(_("Статус"), max_length=20, choices=STATUS_CHOICES, default='dev')
    project_type = models.CharField(_("Тип проекта"), max_length=20, choices=TYPE_CHOICES, default='pet')
    
    # Ссылки
    link_demo = models.URLField(_("Demo URL"), blank=True)
    link_github = models.URLField(_("GitHub URL"), blank=True)
    
    is_active = models.BooleanField(_("Активен"), default=True)
    order = models.PositiveIntegerField(_("Сортировка"), default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("Проект")
        verbose_name_plural = _("Проекты")
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title
