# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-03 07:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Todo',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.TextField()),
            ],
            options={
                'db_table': 'todo_test',
            },
        ),
    ]
