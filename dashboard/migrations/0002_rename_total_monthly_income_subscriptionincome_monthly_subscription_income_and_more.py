# Generated by Django 5.0.4 on 2024-07-30 13:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("dashboard", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="subscriptionincome",
            old_name="total_monthly_income",
            new_name="monthly_subscription_income",
        ),
        migrations.RenameField(
            model_name="subscriptionincome",
            old_name="total_yearly_income",
            new_name="yearly_subscription_income",
        ),
    ]
