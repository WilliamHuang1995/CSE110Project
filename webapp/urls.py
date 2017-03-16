from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^test*', views.test, name='test'),
    url(r'^todo-test*', views.todos_test, name='todo-test'),
    url(r'^todo*', views.todos, name='todos'),

    url(r'^calendar*', views.calendar, name='calendar'),

    url(r'^login/auth*', views.login_auth, name='login-auth'),
    url(r'^login*', views.login, name='login'),

    url(r'^register/auth*', views.register_auth, name='register_auth'),
    url(r'^register*', views.register, name='register'),

	url(r'^confirm_email*', views.confirmEmail, name='confirmEmail'),
	#????????????????????????????????????????
	#why does settings take us to calendar
    url(r'^setting*', views.calendar, name='calendar'),
    url(r'^api/get$', views.get_request, name='get_request'),
    url(r'^api/post$', views.post_request, name='posting'),
    url(r'^api/delete$', views.delete_request, name='deleting'),
    url(r'^api/schedule$', views.update_request, name='updating'),
    url(r'^api/click$', views.check_request, name='change'),
    url(r'^api/edit$', views.edit_todo_request, name="editing"),
    url(r'^$', views.index, name='index'),



]
