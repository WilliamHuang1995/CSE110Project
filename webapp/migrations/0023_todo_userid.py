# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-12 00:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0022_auto_20170310_0507'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='UserID',
            field=models.IntegerField(default=-1),
        ),
    ]
