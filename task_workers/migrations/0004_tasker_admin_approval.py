# Generated by Django 5.0.4 on 2024-07-27 18:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "task_workers",
            "0003_subscriptionprice_tasker_subscription_end_date_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="tasker",
            name="admin_approval",
            field=models.BooleanField(default=False),
        ),
    ]
