from django.db import models

# Create your models here.

class Todo(models.Model):
	id = models.AutoField(primary_key=True)
	title = models.TextField()
	
	class Meta:
		db_table=u'todo_test'

	def __str__(self):
		return self.title
