# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-06 00:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0012_confirm_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='confirm_email',
            name='UserId',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='webapp.Calendo_User'),
        ),
    ]