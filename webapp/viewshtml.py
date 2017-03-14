from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse
from django.http import JsonResponse
import django.apps
from django.core.signing import Signer
from django.core import serializers
from .models import Todo
from .models import Calendo_User


import json
import time
import math
import viewstest
import viewsapi
import viewslogin


from .models import Confirm_Email
from .models import Session


from django.http import HttpResponse
from django.template import loader


import string
import random


from django.core.mail import send_mail


def index(request):
	#insert into database
	userAuth = user_is_auth(request)

	if not userAuth:
		return redirect('/login.html')
	
	userTodosQuery = Todo.objects.raw('SELECT * FROM webapp_todo WHERE "UserID"=%s', [userAuth])
	userTodos = [{'title': todo.title, 'id': todo.id,'location':todo.Location,'description':todo.Description} for todo in userTodosQuery]
	print(len(userTodos))
	for x in userTodos:
		print(x)
	return render(request, 'webapp/home.html',{'todoList': userTodos})

def register(request):
	return render(request, 'webapp/register.html')


def login(request):
	
	print("X in login")
	
	if(not user_is_auth(request)):
		print("USER IS NOT AUTH MITHER FUCKER FCU KEM ")
		return prompt_login(request)
	auth_failed = False
	if(request.GET.get('auth_failed') and request.GET['auth_failed'] == 'true'):
		auth_failed = True
	return render(request, 'webapp/login.html', {'auth_failed':auth_failed})




def calendar(request):
	if(not user_is_auth(request)):
		return prompt_login(request)
	return render(request, 'webapp/login.html');

def todos(request):
	userAuth = user_is_auth(request)

	if not userAuth:
		print("TODOS USER IS NOT AUTH")
		return redirect('/login.html')
	
	userTodosQuery = Todo.objects.raw('SELECT * FROM webapp_todo WHERE "UserID"=%s', [userAuth])
	userTodos = [{'title': todo.title, 'id': todo.id} for todo in userTodosQuery]
	return render(request, 'webapp/todo-test.html', {'todoList': userTodos})




