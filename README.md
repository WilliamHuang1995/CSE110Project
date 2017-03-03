# Django-Calendo

Instructions:

1). Use "pip3 install Django" to download Django on your laptop 

  - we are using Python 3.4 or above so we must use pip3 and python3 at all times!!! 
  - make sure you have python installed (and 3.x version is okay) 
  - http://stackoverflow.com/questions/34573159/how-do-install-pip3-on-my-mac (if you don't have pip3)
  - ask me if you need help on this and I can help

2). Pull code from this github repo and put in any new folder/directory

3). python3 manage.py runserver (or just python if you're running on Windows)

  - this runs the server on your local machine
  - go to http://127.0.0.1:8000/ on any browser to see how the website looks like
  - should display a message on the screen
  
4). Find file in this path: webapp/templates/webapp/home.html
  - this is the basic html file that is displayed on the website
  - might be a little confusing, but ask me if you want to understand more
  - you can play around with this to create the website
  
5). Experiment around with some html stuff like buttons, text fields and stuff



##Alex Notes
###Database
Once you push, you may have to run these commands:
	python manage.py makemigrations webapp
	python manage.py migrate

To see database:

	sqlite3 db.sqlite3

	>>.tables
		//shows all tables


	>>select * from todo_test


To add to database:

1. Go to http://127.0.0.1:8000/?title=INSERTTITLEHERE
2. In views.py, the index function will save the title to the database.

To view record in database:

1. Go to http://127.0.0.1:8000/test?id=INSERTIDHERE with any valid id #
2. In views.py, the test function will get the given id and fetch from database.
3. test.html renders it wherever we want
