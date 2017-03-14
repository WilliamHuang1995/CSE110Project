from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse
from django.http import JsonResponse
import django.apps
from django.core.signing import Signer
from django.core import serializers
from ..models import Todo
from ..models import Calendo_User


import json
import time
import math
from .viewslogin import * 
from .viewsapi import *
from .viewshtml import *


from ..models import Confirm_Email
from ..models import Session


from django.http import HttpResponse
from django.template import loader


import string
import random


from django.core.mail import send_mail
def todos_test(request):

	userAuth = user_is_auth(request)

	if not userAuth:
		return redirect('/login.html')
	
	userTodosQuery = Todo.objects.raw('SELECT * FROM webapp_todo WHERE "UserID"=%s', [userAuth])
	userTodos = [{'title': todo.title, 'id': todo.id} for todo in userTodosQuery]
	return render(request, 'webapp/todo-test.html', {'todoList': userTodos})

def alex_test(request):
	if(not user_is_auth(request)):
		return prompt_login(request)

	return render(request, 'webapp/home.alex.html')

def test(request):
	if(not user_is_auth(request)):
		return prompt_login(request)
	alex = 'omgfg'

	#get from database
	db_result = Todo.objects.raw('SELECT * FROM webapp_todo WHERE "id"=%s', [request.GET['id']])[0]
	return render(request, 'webapp/test.html', {'alex':alex, 'dbResult':db_result})