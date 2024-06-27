from django.db import models
from account.models import UserData
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator


class WorkCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    work_image = models.ImageField(verbose_name=_("Work Image"), upload_to='work_image/', default="")

    def __str__(self):
        return self.name

class Tasker(models.Model):
    user = models.OneToOneField(UserData, on_delete=models.CASCADE, related_name='tasker_profile')
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^\d{10}$', message="Phone number must be 10 digits")]
    )
    aadhar_number = models.CharField(
        max_length=12,
        validators=[RegexValidator(r'^\d{12}$', message="Aadhar number must be 12 digits")]
    )
    address = models.TextField()    
    work_photo = models.ImageField(verbose_name=_("Work Photo"), upload_to='work_photos/', default="")
    tasks = models.ManyToManyField(WorkCategory, related_name='taskers')
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    service_charge = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.full_name
