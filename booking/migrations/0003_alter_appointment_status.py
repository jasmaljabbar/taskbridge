# Generated by Django 5.0.4 on 2024-08-02 04:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("booking", "0002_appointment_rejection_reason"),
    ]

    operations = [
        migrations.AlterField(
            model_name="appointment",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("accepted", "Accepted"),
                    ("rejected", "Rejected"),
                    ("complete", "Complete"),
                ],
                default="pending",
                max_length=50,
            ),
        ),
    ]
