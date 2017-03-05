from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse
import django.apps
from django.core.signing import Signer
from .models import Todo
from .models import Calendo_User

from django.core.mail import send_mail

def alex_test(request):
	return render(request, 'webapp/home.alex.html')

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
	
	preExistingUsers = Calendo_User.objects.raw('SELECT * FROM webapp_calendo_user WHERE Email=%s', [input_email])
	
	if( len(list(preExistingUsers)) > 0):
		#TODO preexisting user error message
		return redirect('/register');
	
	#salt, hash password TODO

	#insert into database TODO
	
	password_hashed = input_password #TODO

	#insertResult = Calendo_User.objects.raw('INSERT INTO webapp_calendo_user(name, email, password) VALUES(%s, %s. %s)', [input_name, input_email, password_hashed])
	insertNewUserResult = Calendo_User(Name=input_name, Email=input_email, Password=password_hashed)
	insertNewUserResult.save()


	#send email to given email TODO

	send_mail(
		'Verify your Calendo Account, ' + input_name,
		"""
		Hello + input_name + ! \n\n 
		
		To verify your Calendo account, please click on the link below:\n

		linkhere.com\n\n

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
	auth_failed = False
	if(request.GET.get('auth_failed') and request.GET['auth_failed'] == 'true'):
		auth_failed = True
	return render(request, 'webapp/login.html', {'auth_failed':auth_failed})


def login_auth(request):
	if (request.method != 'POST'):
		return redirect('/login') 

	#see if provided credentials are legal


	#query database for given email


	#if not exactly 1 row, error


	#Hash given password. Check with database. error back if not right

	#If still hasnt confrmed password, error it

	#create token in memcache set to expire in x hours

	#set cookie, key as calendo_auth_token, value as memcache token

	#send result

	userResult = Calendo_User.objects.raw('SELECT * FROM webapp_calendo_user  WHERE Email=%s', [request.POST['email']])
	
	signer = Signer()
	
	print("password:%s, signed:%s", request.POST['password'], signer.sign(request.POST['password']))
	
	if( len(list(userResult)) != 1):
		print("oh shits")
		return redirect('/login?auth_failed=true&noUser=true') 
	
	userOfInterest = userResult[0]

	print(userResult)
	print(userResult.Email)
	print(userResult.Password)
	return render(request, 'webapp/login.html', {'userResult':userResult[0]})



def confirm_email(request):
	
	if not request.GET.get('confirmId'):
		return render(request, 'webapp/confirmEmail_fail.html')
	
	confirmID = request.GET['confirmId']
	
	#use database to check and update confirmID
	return render(request, 'webapp/confirmEmail_succ.html', {'email':email})

def calendar(request):
	return render(request, 'webapp/login.html');


def todos(request):
	return render(request, 'webapp/todo.html');


def confirmEmail(request):
	return render(request, 'webapp/login.html');

def confirmEmail_success(request):
	return render(request, 'webapp/login.html');

def confirmEmail_failure(request):
	return render(request, 'webapp/login.html');


def test(request):
	alex = 'omgfg'

	#get from database
	db_result = Todo.objects.raw('SELECT * FROM webapp_todo WHERE id=%s', [request.GET['id']])[0]
	return render(request, 'webapp/test.html', {'alex':alex, 'dbResult':db_result})
