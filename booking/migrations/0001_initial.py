# Generated by Django 5.0.4 on 2024-07-06 13:12

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("task_workers", "0004_workcategory_blocked"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Appointment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("minimum_hours_to_work", models.IntegerField()),
                ("address", models.TextField()),
                ("phone_number", models.CharField(max_length=10)),
                ("date", models.DateField()),
                (
                    "employee",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="appointments",
                        to="task_workers.tasker",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="appointments",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Appointment",
                "verbose_name_plural": "Appointments",
            },
        ),
        migrations.CreateModel(
            name="EmployeeAction",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "action",
                    models.CharField(
                        choices=[
                            ("accepted", "Accepted"),
                            ("rejected", "Rejected"),
                            ("pending", "Pending"),
                        ],
                        default="pending",
                        max_length=50,
                    ),
                ),
                ("comment", models.TextField(blank=True, null=True)),
                (
                    "appointment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="actions",
                        to="booking.appointment",
                    ),
                ),
            ],
            options={
                "verbose_name": "Employee Action",
                "verbose_name_plural": "Employee Actions",
            },
        ),
    ]
