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
from .viewshtml import *
from .viewstest import *
from .userAuth import *

from ..models import Confirm_Email
from ..models import Session


from django.http import HttpResponse
from django.template import loader


import string
import random


from django.core.mail import send_mail

def get_request(request):
	#db_result = Todo.objects.raw('SELECT * FROM webapp_todo')
	#db_json = serializers.serialize('json', db_result, fields=('id', 'title'))
	#return JsonResponse(db_json, safe=False)
	queryset = Todo.objects.raw('SELECT * FROM webapp_todo WHERE id = %s', [request.GET.get('id')])

	data = []

	for item in queryset:
		x = str(item.DueDate)
		year = x[0:4]
		month = x[5:7]
		day = x[8:10]
		todoTuple = {'title': 	item.title, 'description': item.Description, 'estimateTime': item.EstimateTime, 'year': year, 'month': month, 'day': day, 'location': item.Location, 'isChecked': item.IsChecked}
		data.append(todoTuple)

	return HttpResponse(json.dumps(data),content_type='application/json')

def update_request(request):
	if request.method != 'POST':
		return redirect('/')

	userAuth = user_is_auth(request)
	if not userAuth:
		return prompt_login(request)




	edit_id = request.POST.get('id')
	print(edit_id)
	insertToDoResult = Todo(id=edit_id, IsScheduled = 1)

	insertToDoResult.save(update_fields=['IsScheduled'])

	return render(request, 'webapp/todo-test.html')

def edit_todo_request(request):
	if request.method != 'POST':
		return redirect('/')

	userAuth = user_is_auth(request)
	if not userAuth:
		return prompt_login(request)

	edit_id = request.POST.get('id')
	edit_title = request.POST.get('title')
	edit_description = request.POST.get('description')
	edit_estimatedTime = request.POST.get('estimateTime')
	# TODO ADD PRIORITY
	#edit_priority = request.POST.get('priority')
	edit_dueDate = request.POST.get('dueDate')
	edit_location = request.POST.get('location')

	print(edit_id)
	print(edit_location)


	insertToDoResult = Todo(id=edit_id, title=edit_title, Description=edit_description, EstimateTime=edit_estimatedTime, DueDate=edit_dueDate, Location=edit_location)

	insertToDoResult.save(update_fields=['title', 'Description', 'EstimateTime', 'DueDate', 'Location'])

	response_data = {}
	response_data['success'] = 'True'

	return HttpResponse(json.dumps(response_data),content_type='application/json')


def check_request(request):
	if request.method != 'POST':
		return redirect('/')

	userAuth = user_is_auth(request)
	if not userAuth:
		return prompt_login(request)


	edit_id = request.POST.get('id')
	print(edit_id)

	queryset = Todo.objects.raw('SELECT * FROM webapp_todo WHERE id = %s', [edit_id])
	if queryset[0].IsChecked == 0:
		insertToDoResult = Todo(id=edit_id, IsChecked = 1)
	else:
		insertToDoResult = Todo(id=edit_id, IsChecked = 0)

	insertToDoResult.save(update_fields=['IsChecked'])


	return render(request, 'webapp/todo-test.html')


def post_request(request):
	if request.method != 'POST':
			return redirect('/todo')

	userAuth = user_is_auth(request)
	if not userAuth:
		return prompt_login(request)

	#see if all were provided
	if( not (request.POST.get('title') )):

		#TODO error handling, give them error messages
		return redirect('/home')


	input_title = request.POST.get('title')
	input_description = request.POST.get('description')
	input_estimatedTime = request.POST.get('estimateTime')
	input_priority = request.POST.get('priority')
	input_dueDate = request.POST.get('dueDate')
	input_location = request.POST.get('location')

	print(type(input_estimatedTime))
	#if type(input_estimatedTime) == str or math.isnan(input_estimatedTime):
#		print("asdfasdf")
#		input_estimatedTime = 0

	insertToDoResult = Todo(title=input_title,UserID=userAuth,Description=input_description,EstimateTime=input_estimatedTime,DueDate=input_dueDate, Location=input_location)
	insertToDoResult.save()

	#queryset = Todo.objects.raw('SELECT id FROM webapp_todo WHERE UserID=%s',[calendo_session_token])
	#data = [{'id': item.id} for item in queryset]
	#print("some value")
	return HttpResponse(json.dumps(insertToDoResult.id),content_type='application/json')

def edit_request(request):
	if request.method != 'POST':
			return redirect('/todo')

	userAuth = user_is_auth(request)
	if not userAuth:
		return prompt_login(request)

	#see if all were provided
	if( not (request.POST.get('title') )):

		#TODO error handling, give them error messages
		return redirect('/home')


	input_title = request.POST.get('title')
	input_description = request.POST.get('description')
	input_estimatedTime = request.POST.get('estimateTime')
	input_priority = request.POST.get('priority')
	input_dueDate = request.POST.get('dueDate')
	input_location = request.POST.get('location')

	edit_id = request.POST.get('id')
	#insertToDoResult = Todo(title=input_title,UserID=userAuth,Description=input_description,EstimateTime=input_estimatedTime,DueDate=input_dueDate, Location=input_location)
	insertToDoResult = Todo.objects.filter(id=edit_id)
	insertToDoResult.title = input_title
	insertToDoResult.Description = input_description
	insertToDoResult.EstimateTime = input_estimatedTime
	insertToDoResult.DueDate = input_dueDate
	insertToDoResult.Location = input_location
	insertToDoResult.save()

	#queryset = Todo.objects.raw('SELECT id FROM webapp_todo WHERE UserID=%s',[calendo_session_token])
	#data = [{'id': item.id} for item in queryset]
	#print("some value")
	return render(request, 'webapp/todo-test.html')

def delete_request(request):
	if request.method != 'POST':
		return redirect('/todo')

	print("dropping")

	if( not (request.POST.get('id') )):

		#TODO error handling, give them error messages
		return redirect('/home')

	#this might need to be changed to id
	delete_id = request.POST.get('id')

	#deleteQuery = Todo.objects.raw('DELETE FROM webapp_todo WHERE "title" = %s', [delete_title])
	Todo.objects.filter(id=delete_id).delete()

	return render(request, 'webapp/todo.html')
