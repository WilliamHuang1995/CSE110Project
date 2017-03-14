from django.db import models

# Create your models here.


class Session(models.Model):
	
	SessionId = models.CharField(max_length=50)
	UserId = models.IntegerField(default=0)
	UserEmail = models.CharField(max_length=30)
	DeathDate = models.IntegerField(default=0)

	def __str__(self):
		return self.SessionId


class Calendo_User(models.Model):
	VIEW_CHOICES = (
		('A', 'Agenda'),
		('T', 'Three-Day'),
		('M', 'Month')
	)
	Name = models.CharField(max_length=20, default="")
	Email = models.CharField(max_length=30)
	Password = models.CharField(max_length=100)
	#NotificationsFreq = models.BooleanField(default=False)
	#ColorScheme = models.IntegerField(default=3)
	isConfirmed = models.BooleanField(default=False)
	#CalenderView = models.CharField(max_length=1, choices=VIEW_CHOICES)

	def __str__(self):
			return self.Email

class Confirm_Email(models.Model):
	Email = models.CharField(max_length=30, default="")
	UserId = models.IntegerField(default=0)
	Code = models.CharField(max_length=30, default="")
	IsConfirmed = models.BooleanField(default=False)
	def __str__(self):
			return self.Code

class Todo(models.Model):

	id = models.AutoField(primary_key=True)
	title = models.TextField(null=True)
	UserID = models.IntegerField(default=-1)
	Description = models.CharField(max_length=160, default="")
	EstimateTime = models.IntegerField(default=1)
	DueDate = models.DateField(null=True)
	Location = models.TextField(null=True)
	#need int field for isscheduled 
	#need int field for smart schedule 
	#SmartSchedule = models.IntegerField(default=0)
	#IsScheduled = models.IntegerField(default=0)
	

	def __str__(self):
			return self.title

