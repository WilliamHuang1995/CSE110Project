from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse
import django.apps
from .models import Todo
from .models import Calendo_User

def index(request):
	
	#insert into database
	if (request.GET.get('boop')):
		testPlzSave = Todo(title=request.GET['boop'])
		testPlzSave.save()
	return render(request, 'webapp/home.html')

def login_auth(request):
	for x in django.apps.apps.get_models():
		print (x)
	if (request.method != 'POST'):
		print("oh nos")
		return HttpResponseNotFound("<h1>oh noooosss</h1>")
	print(request.POST['email'])	
	userResult = Calendo_User.objects.raw('SELECT * FROM webapp_calendo_user  WHERE Email=%s', [request.POST['email']])
	
	if( len(list(userResult)) != 1):
		print("oh shits")
		return redirect('/login?auth_failed=true&noUser=true') 
	
	print(userResult)
	print(userResult.Email)
	print(userResult.Password)
	return render(request, 'webapp/login.html', {'userResult':userResult[0]})

def register(request):
	return render(request, 'webapp/register.html')

def login(request):
	auth_failed = False
	if(request.GET.get('auth_failed') and request.GET['auth_failed'] == 'true'):
		auth_failed = True
	return render(request, 'webapp/login.html', {'auth_failed':auth_failed})

def todos(request):
	return render(request, 'webapp/login.html');
def calendar(request):
	return render(request, 'webapp/login.html');
def todos(request):
	return render(request, 'webapp/login.html');
def test(request):
	alex = 'omgfg'

	#get from database
	db_result = Todo.objects.raw('SELECT * FROM webapp_todo WHERE id=%s', [request.GET['id']])[0]
	return render(request, 'webapp/test.html', {'alex':alex, 'dbResult':db_result})
