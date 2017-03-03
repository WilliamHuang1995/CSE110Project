from django.db import models

# Create your models here.

class User(models.Model):
	VIEW_CHOICES = (
		('A', 'Agenda'),
		('T', 'Three-Day'),
		('M', 'Month')
	)
	UserName = models.CharField(max_length=20)
	Email = models.CharField(max_length=30)
	Password = models.CharField(max_length=20)
	NotificationsFreq = models.BooleanField(default=False)
	ColorScheme = models.IntegerField()
	CalenderView = models.CharField(max_length=1, choices=VIEW_CHOICES)

	def __str__(self):
			return self.UserName

class Todo(models.Model):
	UserID = models.ForeignKey(User) #may need on_delete models.CASCADE
	Title = models.CharField(max_length=40)
	Description = models.CharField(max_length=160)
	EstimateTime = models.IntegerField()
	DueDate = models.DateField()

	def __str__(self):
			return self.Title

