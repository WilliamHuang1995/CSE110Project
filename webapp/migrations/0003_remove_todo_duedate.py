# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-04 01:58
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0002_remove_todo_estimatetime'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='todo',
            name='DueDate',
        ),
    ]