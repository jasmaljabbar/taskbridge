# Generated by Django 5.0.4 on 2024-07-26 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("booking", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="appointment",
            name="rejection_reason",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]