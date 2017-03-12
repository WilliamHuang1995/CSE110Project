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

from .models import Confirm_Email
from .models import Session


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

def prompt_login(request):
	t = loader.get_template('webapp/login.html')
	c = {}

	response = HttpResponse(t.render(c, request))
	response.delete_cookie('calendo_session_token')
	return response

def alex_test(request):
	if(not user_is_auth(request)):
		return prompt_login(request)

	return render(request, 'webapp/home.alex.html')

def get_request(request):
	#db_result = Todo.objects.raw('SELECT * FROM webapp_todo')
	#db_json = serializers.serialize('json', db_result, fields=('id', 'title'))
	#return JsonResponse(db_json, safe=False)
	queryset = Todo.objects.raw('SELECT * FROM webapp_todo')
	data = [{'title': item.title, 'id': item.id} for item in queryset]
	return HttpResponse(json.dumps(data),content_type='application/json')


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
	
	insertToDoResult = Todo(title=input_title,UserID=userAuth,Description=input_description,EstimateTime=input_estimatedTime,DueDate=input_dueDate, Location=input_location)
	insertToDoResult.save()

	#queryset = Todo.objects.raw('SELECT id FROM webapp_todo WHERE UserID=%s',[calendo_session_token])
	#data = [{'id': item.id} for item in queryset]
	
	return HttpResponse(json.dumps(insertToDoResult.id),content_type='application/json')

def delete_request(request):
	if request.method != 'POST':
		return redirect('/todo')

	print("dropping")

	if( not (request.POST.get('title') )):
		
		#TODO error handling, give them error messages
		return redirect('/home')

	#this might need to be changed to id 
	delete_title = request.POST.get('title');

	#deleteQuery = Todo.objects.raw('DELETE FROM webapp_todo WHERE "title" = %s', [delete_title])
	Todo.objects.filter(title=delete_title).delete() 

	return render(request, 'webapp/todo.html')








def index(request):
	#insert into database
	if (request.GET.get('boop')):
		testPlzSave = Todo(title=request.GET['boop'])
		testPlzSave.save()
	return render(request, 'webapp/home.html')

def register(request):
	return render(request, 'webapp/register.html')

def register_auth(request):
	if request.method != 'POST':
		return redirect('/register')
	
	#see if all were provided
	if( not (request.POST.get('name') and request.POST.get('email') and request.POST.get('password') and request.POST.get('confirm'))):
		
		#TODO error handling, give them error messages
		return redirect('/register')

	
	input_email = request.POST['email']
	input_name = request.POST['name']
	input_password = request.POST['password']
	input_confirm = request.POST['confirm']
	
	#see if email is an email, password is right TODO
	regex_email = r'(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)'
	

		#use regex. See if paswords match. see is password is long enough, enough special chars, etc

	#see if email already exists
	
	preExistingUsers = Calendo_User.objects.raw('SELECT * FROM webapp_calendo_user WHERE "Email"=%s', [input_email])

	print( len(list(preExistingUsers )))
	
	if( len(list(preExistingUsers)) > 0):
		#TODO preexisting user error message
		print("omg kill me")
		return redirect('/register');
	

	
	#salt, hash password TODO
	signer = Signer()
	password_hashed = input_password 
	password_hashed = signer.sign(input_password)
	password_hashed= password_hashed[password_hashed.find(":")+1:]

	#insert into database 
	insertNewUserResult = Calendo_User(Name=input_name, Email=input_email, Password=password_hashed)
	insertNewUserResult.save()


	#genereate confirm email code
	
	codeGenerated = confirm_code_generator()
	insertNewEmailConfirmCodeResult = Confirm_Email(UserId=insertNewUserResult.id,Email=input_email, Code=codeGenerated, IsConfirmed=False);
	insertNewEmailConfirmCodeResult.save();



	#send email to given email TODO

	send_mail(
		'Verify your Calendo Account, ' + input_name,
		"""
		Hello """ + input_name  +  """! \n\n 
		
		To verify your Calendo account, please click on the link below:\n

		www.calendo.com/confirm_email?code=""" + codeGenerated + 
		
		"""\n\n

		Have a nice day!\n
		-Calendo Team
		""",
		'help@calendo.com',
		[input_email],
		fail_silently=False,
	)



	#render response
	return render(request, 'webapp/register-complete.html', {'email':input_email})
	
def login(request):
	
	print("X in login")
	
	if(not user_is_auth(request)):
		print("USER IS NOT AUTH MITHER FUCKER FCU KEM ")
		return prompt_login(request)
	auth_failed = False
	if(request.GET.get('auth_failed') and request.GET['auth_failed'] == 'true'):
		auth_failed = True
	return render(request, 'webapp/login.html', {'auth_failed':auth_failed})


def login_auth(request):
	print("X IN LOGIN AUTH")
	if (request.method != 'POST'):
		return redirect('/login') 

	if( not (request.POST.get('email') and request.POST.get('password') )):
		#TODO error handling, give them error messages
		return redirect('/login')

	
	print("X IN LOGIN AUTH2")
	input_email = request.POST['email']
	input_password = request.POST['password']

	#see if provided credentials are legal TODO, length pass, is an eail, etc


	#query database for given email
	userResult = Calendo_User.objects.raw('SELECT * FROM webapp_calendo_user  WHERE "Email"=%s', [request.POST['email']])
	
	print("X IN LOGIN AUTH3")
	#if not exactly 1 row, error
	if( len(list(userResult)) != 1):
		print("oh shits")
		return redirect('/login?auth_failed=true&noUser=true') 
	
	userOfInterest = userResult[0]


	print("X IN LOGIN AUTH4")
	#Hash given password. Check with database. error back if not right
	signer = Signer()

	input_password_enc = signer.sign(input_password)
	input_password_enc = input_password_enc[input_password_enc.find(":")+1:]

	print("X IN LOGIN AUTH41")
	if(input_password_enc  == userOfInterest.Password): 
		
		print("X IN LOGIN AUTH42")
		#If still hasnt confrmed password, error it
		if (not (userOfInterest.isConfirmed)):
			#TODO let user know they have to confirm their email
			return render(request, 'webapp/home.html', {'userResult':userResult[0]})
		
		#create token in database TODO
		
		print("X IN LOGIN AUTH5")
		session_token = login_token_generator()
		token_death_date = int(time.time()) + 60*2

		insertSessionTokenResult = Session(SessionId=session_token, UserId=userOfInterest.id, UserEmail=userOfInterest.Email, DeathDate=token_death_date)
		insertSessionTokenResult.save()

		print("X IN LOGIN AUTH6")
		t = loader.get_template('webapp/home.html')
		c = {'userResult':userResult[0]}

		response = HttpResponse(t.render(c, request))
		response.set_cookie('calendo_session_token', session_token)
		
		print("Cook that was set:")
		print("Cook that was set:")
		print("Cook that was set:")
		print("Cook that was set:")
		print("Cook that was set:")
		print("Cook that was set:")
		print(session_token)
		print("OH YES BABY")
		return response

	else:
		print("OH NOOOOOOOOO")
		return redirect('./home.html')

def confirm_email(request):
	
	if not request.GET.get('confirmId'):
		return render(request, 'webapp/confirmEmail_fail.html')
	
	confirmID = request.GET['confirmId']
	
	#use database to check and update confirmID
	return render(request, 'webapp/confirmEmail_succ.html', {'email':email})

def calendar(request):
	if(not user_is_auth(request)):
		return prompt_login(request)
	return render(request, 'webapp/login.html');


def todos(request):
	#if(not user_is_auth(request)):
		#return prompt_login(request)
	return render(request, 'webapp/todo.html');


def confirmEmail(request):
	
	if( not request.GET.get('code')):
		return render(request, 'webapp/confirm_email.html', {'confirm_status':'fail'})
	
	givenCode = request.GET['code']
	
	codeQueryResult = Confirm_Email.objects.raw('SELECT * FROM webapp_Confirm_Email WHERE "Code"=%s AND "IsConfirmed" = False',[givenCode])
	
	if( len(list(codeQueryResult)) != 1):
		print("SQL QUERY FAILED FIRST")
		return render(request, 'webapp/confirm_email.html', {'confirm_status':'fail'})
	
	emailToConfirm = codeQueryResult[0].Email
	
	userIdToUse = codeQueryResult[0].UserId

	codeUpdateResult = Confirm_Email(Code=givenCode, id=codeQueryResult[0].id, IsConfirmed=True)
	codeUpdateResult.save(update_fields=['IsConfirmed'])

	userUpdateResult = Calendo_User(id=userIdToUse, isConfirmed=True)
	userUpdateResult.save(update_fields=['isConfirmed'])

	return render(request, 'webapp/confirm_email.html', {'confirm_status':'success', 'email':emailToConfirm});

def test(request):
	if(not user_is_auth(request)):
		return prompt_login(request)
	alex = 'omgfg'

	#get from database
	db_result = Todo.objects.raw('SELECT * FROM webapp_todo WHERE "id"=%s', [request.GET['id']])[0]
	return render(request, 'webapp/test.html', {'alex':alex, 'dbResult':db_result})

def confirm_code_generator(size=30, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(size))
def login_token_generator(size=25, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(size))


def user_is_auth(request):
	calendo_session_token = request.COOKIES.get('calendo_session_token')

	if(not calendo_session_token):
		return False
	
	sessionQueryResult = Session.objects.raw('SELECT * FROM webapp_session WHERE "SessionId"=%s', [calendo_session_token])

	if( len(list(sessionQueryResult)) != 1):
		return False
	
	session_record = sessionQueryResult[0]
	
	#if token is expired, passed deathdate

	if (session_record.DeathDate <  int(time.time())):
		return False
	
	#update token for another 10 mins
	
	new_death_date = int(time.time()) + 10*60
	updateDeathDateResult = Session(id=session_record.id, DeathDate=new_death_date)
	updateDeathDateResult.save(update_fields=['DeathDate'])
	
	return session_record.UserId
