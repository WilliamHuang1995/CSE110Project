# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-10 05:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0021_auto_20170307_0105'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='Email',
            new_name='email',
        ),
        migrations.AlterField(
            model_name='calendo_user',
            name='Password',
            field=models.CharField(max_length=100),
        ),
    ]