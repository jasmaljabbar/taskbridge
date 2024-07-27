"""
Django settings for taskbridge project.

Generated by 'django-admin startproject' using Django 5.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-3^q1eh+x_c0$7hsrw(@!y352hr_!9c-7ssmrgv1i%zxytaqh8&"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

SITE_ID = 1 

# Application definition
INSTALLED_APPS = [
    'daphne' , 
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "corsheaders",
    "account",
    'chat',
    'channels' , 
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'adminside',
    'task_workers',
    'profiles',
    'djoser',
    'booking', 
    'dashboard',
    'payments',

]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

SESSION_ENGINE = 'django.contrib.sessions.backends.db'

ASGI_APPLICATION = "chat.routing.application"

ROOT_URLCONF = "taskbridge.urls"



REDIS_HOST = os.environ.get('REDIS_HOST', '127.0.0.1')
REDIS_PORT = os.environ.get('REDIS_PORT', 6379)

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(REDIS_HOST, REDIS_PORT)],
        },
    },
}




TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "taskbridge.wsgi.application"

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'taskbridge', 
        'USER': 'postgres',
        'PASSWORD': '231343',
        'HOST': '127.0.0.1', 
        'PORT': '5432',
    }
}

STRIPE_SECRET_KEY = 'sk_test_51PgI85DMque14kFMh3FP6bVLGZwYE3RzJGE5CZNfuVwiSKyW6ETG7Kg2vLancv36QoweJeCQ1kwCKz2rYrUnXWBf00s6RVwxf6'
STRIPE_PUBLISHABLE_KEY = 'pk_test_51PgI85DMque14kFMK0soU7ITSRS6gmNTJXoHaaJwK3qscHFUuOubeUTVpfGxAZgMKjCn49XdpmCdIUcGT1LAh7Sj00C6qgA4eW'

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/
LANGUAGE_CODE = "en-us"
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/
STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Custom settings
AUTH_USER_MODEL = "account.UserData"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

ASGI_APPLICATION = "taskbridge.asgi.application"


SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('Bearer',),
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
}


CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]

DEBUG = True



MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

DJOSER = {
    "LOGIN_FIELD": "email",
    "USER_CREATE_PASSWORD_RETYPE": True,
    "USERNAME_CHANGED_EMAIL_CONFIRMATION": True,
    "PASSWORD_CHANGED_EMAIL_CONFIRMATION": True,
    "SEND_CONFIRMATION_EMAIL": True,
    "PASSWORD_RESET_CONFIRM_URL": "password/reset/confirm/{uid}/{token}",
    "SET_PASSWORD_RETYPE": True,
    "PASSWORD_RESET_CONFIRM_RETYPE": True,
    "USERNAME_RESET_CONFIRM_URL": "email/reset/confirm/{uid}/{token}",
    "ACTIVATION_URL": "activate/{uid}/{token}",
    "SEND_ACTIVATION_EMAIL": True,
    "SERIALIZERS": {
        "user_create": "account.serializers.CreateUserSerializer",
        "user": "account.serializers.UserSerializer",
        "current_user": "account.serializers.UserSerializer",
        "user_delete": "djoser.serializers.UserDeleteSerializer",
    },
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'jasmaljabbarghazali@gmail.com'
EMAIL_HOST_PASSWORD = 'qrso bjfb yeit mxjk'
DEFAULT_FROM_EMAIL = 'jasmaljabbarghazali@gmail.com'


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'django_debug.log',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'DEBUG',
    },
}
