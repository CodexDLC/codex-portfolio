
from .base import *  # noqa: F403
from .base import BASE_DIR



ALLOWED_HOSTS = ["*"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Чтобы письма не уходили, а печатались в консоль
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"