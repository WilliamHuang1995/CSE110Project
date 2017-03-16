from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse
from django.http import JsonResponse
import django.apps
from django.core.signing import Signer
from django.core import serializers
from ...models import Todo
from ...models import Calendo_User


import json
import time
import math



from ...models import Confirm_Email
from ...models import Session


from django.http import HttpResponse
from django.template import loader


import string
import random


from django.core.mail import send_mail


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