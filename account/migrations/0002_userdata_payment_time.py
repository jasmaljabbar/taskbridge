# Generated by Django 5.0.4 on 2024-07-27 18:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("account", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="userdata",
            name="payment_time",
            field=models.BooleanField(default=False),
        ),
    ]
