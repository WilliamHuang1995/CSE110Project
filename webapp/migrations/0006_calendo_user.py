# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-04 05:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0005_remove_user_username'),
    ]

    operations = [
        migrations.CreateModel(
            name='Calendo_User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Email', models.CharField(max_length=30)),
                ('Password', models.CharField(max_length=20)),
                ('NotificationsFreq', models.BooleanField(default=False)),
                ('ColorScheme', models.IntegerField()),
                ('CalenderView', models.CharField(choices=[(b'A', b'Agenda'), (b'T', b'Three-Day'), (b'M', b'Month')], max_length=1)),
            ],
        ),
    ]
