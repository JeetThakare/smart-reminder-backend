# Generated by Django 2.1.7 on 2019-03-07 04:28

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Reminders',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reminder', models.CharField(max_length=50)),
                ('show_on', models.DateField()),
                ('user_id', models.IntegerField()),
            ],
        ),
    ]
