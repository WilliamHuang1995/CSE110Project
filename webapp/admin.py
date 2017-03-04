from django.contrib import admin
from webapp.models import User
from webapp.models import Todo

# Register your models here.
admin.site.register(User)
admin.site.register(Todo)
