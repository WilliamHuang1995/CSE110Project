from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'webapp/home.html')

def login(request):
	if request.user.is_authenticated:
		return render(request, 'webapp/home.html')
	return render(request, 'webapp/login.html')

def test(request):
	alex = 'omgfg'
	return render(request, 'webapp/test.html', {'alex':alex})
