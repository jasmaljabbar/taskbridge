from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField

from common.models import TimeStampedUUIDModel

User = get_user_model()

class Gender(models.TextChoices):
    MALE = "Male",_("Male")
    FEMALE = "Female",_("Female")
    OTHER = "Other",_("Other")

class Profile(TimeStampedUUIDModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = PhoneNumberField(verbose_name=_("Phone Number"), max_length = 30, default = "+918156853900")
    profile_photo = models.ImageField(verbose_name=_("Profile Photo"), default="/profile_default.png")
    gender= models.CharField(verbose_name=_("Genter"),choices=Gender.choices,default=Gender.OTHER,max_length=20)
    city = models.CharField(verbose_name=_("City"), max_length=180, default="kozhikode",blank=False, null=False)
    is_tasker = models.BooleanField(verbose_name=_("Tasker"), default=False,help_text=_("Are you looking for a Tasker?"))

    def __str__(self):
        return f"{self.user.username}'s profile"