# Generated by Django 5.0.4 on 2024-07-02 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "task_workers",
            "0003_remove_tasker_tasks_tasker_task_tasker_task_fee_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="workcategory",
            name="blocked",
            field=models.BooleanField(default=False),
        ),
    ]
