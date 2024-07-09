from django.db import models
from account.models import UserData
from task_workers.models import Tasker
from profiles.models import Profile
from django.contrib.auth import get_user_model

User = get_user_model()

class Appointment(models.Model):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_appointments')
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='employee_appointments')
    minimum_hours_to_work = models.IntegerField()
    address = models.TextField()
    phone_number = models.CharField(max_length=15)  # Increased to accommodate various formats
    date = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=PENDING)

    def __str__(self):
        return f"{self.employee.username} - {self.date}"

    class Meta:
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"

