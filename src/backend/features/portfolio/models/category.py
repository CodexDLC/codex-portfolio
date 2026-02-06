from django.db import models
from django.utils.translation import gettext_lazy as _

class Category(models.Model):
    """
    Категория портфолио (Вкладка/Секция).
    Управляет внешним видом таба и заголовка секции.
    """
    name = models.CharField(_("Название"), max_length=50)
    slug = models.SlugField(_("Slug"), unique=True)
    
    # Настройки Таба
    tab_filename = models.CharField(_("Имя файла (Tab)"), max_length=50, help_text="Например: clients.py")
    tab_icon_text = models.CharField(_("Иконка (Текст)"), max_length=10, default="PY")
    tab_icon_class = models.CharField(_("CSS класс иконки"), max_length=50, help_text="gold, blue, green...")
    
    # Настройки Секции
    section_number = models.CharField(_("Номер секции"), max_length=5, default="01")
    section_title = models.CharField(_("Заголовок секции"), max_length=100, help_text="CLIENT SOLUTIONS")
    
    # Визуал
    theme_class = models.CharField(_("CSS класс темы"), max_length=50, help_text="theme-gold, theme-blue...")
    
    order = models.PositiveIntegerField(_("Сортировка"), default=0)
    is_active = models.BooleanField(_("Активна"), default=True)

    class Meta:
        verbose_name = _("Категория")
        verbose_name_plural = _("Категории")
        ordering = ['order']

    def __str__(self):
        return self.name
