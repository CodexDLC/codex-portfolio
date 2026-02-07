from django.db import models
from django.db.models import F, Case, When, Value, IntegerField
from django.utils.translation import gettext_lazy as _

from .category import Category
from ...system.models import StyleAttribute, TechTag
from ...system.models.mixins import TimeStampedMixin


class ProjectQuerySet(models.QuerySet):
    def with_weight(self, include_order=True):
        """
        Аннотирует выборку вычисляемым полем `weight`.
        Формула: Просмотры + (Статус) + (Демо) + (Избранное)
        """
        
        # 1. Очки за статус (Prod круче всех)
        status_score = Case(
            When(status='prod', then=Value(500)),
            When(status='support', then=Value(400)),
            When(status='dev', then=Value(200)),
            default=Value(0),
            output_field=IntegerField(),
        )

        # 2. Очки за наличие Демо-ссылки (не пустая строка)
        demo_score = Case(
            When(link_demo__gt='', then=Value(300)), 
            default=Value(0),
            output_field=IntegerField(),
        )

        # 3. Очки за Избранное
        featured_score = Case(
            When(is_featured=True, then=Value(1000)),
            default=Value(0),
            output_field=IntegerField(),
        )

        # Собираем всё вместе
        expression = F('views_count') + status_score + demo_score + featured_score

        if include_order:
            # Ручная сортировка всё равно главнее всех автоматических
            # Умножаем на 2000, чтобы перебить любые бонусы
            expression = expression + (F('order') * 2000)

        return self.annotate(weight=expression)

    def active(self):
        return self.filter(is_active=True)


class Project(TimeStampedMixin):
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
    content = models.TextField(_("Полное описание"), blank=True, help_text="Markdown или HTML для страницы проекта")
    
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
    
    # style_layout удален, так как размер вычисляется динамически LayoutService

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
    
    # Метрики для веса
    views_count = models.PositiveIntegerField(_("Просмотры"), default=0)
    likes_count = models.PositiveIntegerField(_("Лайки"), default=0)
    is_featured = models.BooleanField(_("Избранное"), default=False, help_text="Поднимает вес проекта")

    is_active = models.BooleanField(_("Активен"), default=True)
    order = models.PositiveIntegerField(_("Сортировка"), default=0)
    
    # created_at и updated_at наследуются от TimeStampedMixin

    objects = ProjectQuerySet.as_manager()

    class Meta:
        verbose_name = _("Проект")
        verbose_name_plural = _("Проекты")
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    @property
    def popularity_score(self):
        """
        Возвращает вычисляемый вес для сортировки в Python (без запросов к БД).
        Дублирует логику ProjectQuerySet.with_weight, но для одного объекта.
        """
        score = self.views_count
        
        # 1. Статус
        if self.status == 'prod':
            score += 500
        elif self.status == 'support':
            score += 400
        elif self.status == 'dev':
            score += 200
            
        # 2. Демо
        if self.link_demo:
            score += 300
            
        # 3. Избранное
        if self.is_featured:
            score += 1000
            
        return score
