from django.shortcuts import render
from django.http import HttpResponse

from .models import Todo

def index(request):
	#testPlzSave = Todo(title=request.GET['title'])
	#testPlzSave.save()
	return render(request, 'webapp/home.html')

def login(request):
	if request.user.is_authenticated:
		return render(request, 'webapp/home.html')
	return render(request, 'webapp/login.html')

def test(request):
	alex = 'omgfg'
	db_result = Todo.objects.raw('SELECT * FROM todo_test WHERE id=%s', [request.GET['id']])[0]
	return render(request, 'webapp/test.html', {'alex':alex, 'dbResult':db_result})
