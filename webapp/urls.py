from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^test', views.test, name='test'),
    url(r'^todo$', views.todos, name='todos'),
    url(r'^login/auth$', views.login_auth, name='login-auth'),
    url(r'^calender$', views.calendar, name='calendar'),
    url(r'^login$', views.login, name='login'),
    url(r'^register$', views.register, name='register'),
    url(r'^setting$', views.calendar, name='calendar'),
    url(r'^alex$', views.alex_test, name='alex_test'),
    url(r'^$', views.index, name='index')
]
