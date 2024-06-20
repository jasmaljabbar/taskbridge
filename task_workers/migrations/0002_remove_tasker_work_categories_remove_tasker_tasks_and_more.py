# Generated by Django 5.0.4 on 2024-06-07 08:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("task_workers", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="tasker",
            name="work_categories",
        ),
        migrations.RemoveField(
            model_name="tasker",
            name="tasks",
        ),
        migrations.AddField(
            model_name="tasker",
            name="tasks",
            field=models.ManyToManyField(
                related_name="taskers", to="task_workers.workcategory"
            ),
        ),
    ]