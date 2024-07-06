from django.db import models
from account.models import UserData
from task_workers.models import Tasker
from profiles.models import Profile

class Appointment(models.Model):
    user = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='appointments', null=True)
    employee = models.ForeignKey(Tasker, on_delete=models.CASCADE, related_name='appointments')
    minimum_hours_to_work = models.IntegerField()
    address = models.TextField()
    phone_number = models.CharField(max_length=10)
    date = models.DateField()

    def __str__(self) -> str:
        return f"{self.employee.task.name} - {self.date}"

    def save(self, *args, **kwargs):
        if not self.pk:  # Check if this is a new instance
            profile = Profile.objects.filter(user=self.user).first()
            if profile:
                if not self.address:
                    self.address = profile.address
                if not self.phone_number:
                    self.phone_number = profile.phone_number
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"

class EmployeeAction(models.Model):
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'
    PENDING = 'pending'
    ACTION_CHOICES = [
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
        (PENDING, 'Pending'),
    ]

    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='actions')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES, default=PENDING)
    comment = models.TextField(blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.action} - {self.appointment}"

    class Meta:
        verbose_name = "Employee Action"
        verbose_name_plural = "Employee Actions"
