from django.db import models
from account.models import UserData

class WorkCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Tasker(models.Model):
    user = models.OneToOneField(UserData, on_delete=models.CASCADE, related_name='tasker_profile')
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    aadhar_number = models.CharField(max_length=12)
    tasks = models.ManyToManyField(WorkCategory, related_name='taskers')
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    address = models.TextField()
    service_charge = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.full_name
