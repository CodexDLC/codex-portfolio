from .base import *  # noqa: F403
from environ import Env

env = Env()

DEBUG = False  # Самое главное!
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")

# Настройки безопасности
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# База данных из .env через django-environ
DATABASES = {"default": env.db("DATABASE_URL")}