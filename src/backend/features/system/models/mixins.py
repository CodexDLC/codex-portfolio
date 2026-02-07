from django.db import models
from django.utils.translation import gettext_lazy as _

class TimeStampedMixin(models.Model):
    """
    Абстрактный миксин для добавления полей времени создания и обновления.
    """
    created_at = models.DateTimeField(_("Создано"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Обновлено"), auto_now=True)

    class Meta:
        abstract = True
