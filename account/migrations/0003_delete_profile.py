# Generated by Django 5.0.4 on 2024-06-03 04:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("account", "0002_profile_tasker"),
    ]

    operations = [
        migrations.DeleteModel(
            name="Profile",
        ),
    ]