/*****************************************************************
 *
 *  These three variables are what is needed for each API call
 *
 *****************************************************************/
var CLIENT_ID = '617019221248-anpai3721kguigchcufa4emvq19o7bmn.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar";

/*****************************************************************
 * Initialize Google API Client
 *****************************************************************/
function initializeClient(){
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    });
}


function settingSave(){
    //needs to check if calendar is hidden maybe
    freeday[0]=$("#sunday").is(":checked");
    freeday[1]=$("#monday").is(":checked");
    freeday[2]=$("#tuesday").is(":checked");
    freeday[3]=$("#wednesday").is(":checked");
    freeday[4]=$("#thursday").is(":checked");
    freeday[5]=$("#friday").is(":checked");
    freeday[6]=$("#saturday").is(":checked");
    minutesBreak = Number($("#break-time-input").val());
    FreeStart = $("#active-start-time-input").val().substring(0,2)
    FreeEnd = $("#active-end-time-input").val().substring(0,2);
    $("#settingsModal").modal('hide');
    $("#calendar").fullCalendar('removeEvents');
    listUpcomingEvents();

}
/*****************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************/
const ACCEPTED_DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm';
const waitTime = 3000;

/*****************************************************************
 * Global variables for saveChanges()
 * changedEvent is used loosely to store an event object
 *****************************************************************/
var id;
var changedEvent;

/*****************************************************************
 * Global variables for generateEvent()
 *****************************************************************/
var startDate;
var endDate;

/*****************************************************************
 * Dynamically changes the end time to match the start time
 *****************************************************************/

$("#start-time-input").change(function() {
    $("#end-time-input").val(moment($("#start-time-input").val()).add(1,'hours').format(ACCEPTED_DATE_FORMAT));
});


/*****************************************************************
 * global variables for addToCalender()
 *****************************************************************/
var todoEvent;



function addEvent(val) {

		inputTitle = val;

    var HttpClient = function() {
        this.post = function(aUrl, aCallback) {

            var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val(); 
            console.log("crsf token"+ csrftoken);
            var url = "/api/post";
            var form_data = new FormData();
                
            form_data.append("title", inputTitle);
            form_data.append("location", "");
            form_data.append("description", ""); 
						var today = new Date();
						var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
            form_data.append("dueDate", nextweek.toISOString().split('T')[0]);
            form_data.append("estimateTime", 0);
            form_data.append("priority", "");



            var anHttpRequest = new XMLHttpRequest();
            anHttpRequest.onreadystatechange = function() { 
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText);
            }
                

            anHttpRequest.open( "POST", aUrl, true );   
            anHttpRequest.setRequestHeader("X-CSRFToken", csrftoken);         
            anHttpRequest.send( form_data );
            console.log("sent params");
        }
    }
    var client = new HttpClient();
    client.post('/api/post', function(response) {
        // do something with response
        var temp = JSON.parse(response); 
        console.log(temp); 
            
        
    });
	


}

/*****************************************************************
 * Allows user to press enter to complete form.
 * issue currently, needs fix. uncomment once fixed.
 *****************************************************************/
/*
$("#modalWindow").keyup(function(event){
    if(event.keyCode == 13 && $('#modalWindow').hasClass('in')){   
        $(".confirmation-button").click();
    }
});*/

/*****************************************************************
 * Allows user to quick add a todo
 *****************************************************************/
$('#quick-add').keyup(function (e) {
    if (e.keyCode == 13) {
        if($(this).val()!==''){
            var val = $(this).val();
            var div = document.createElement('div');
            div.className = 'fc-event';
            div.textContent = val;
            $(div).data('event', {
                title: val,
                stick: true, 
                id: 'external-event',
            })
            $(div).draggable({
                //revert: 'invalid', 
                scroll: false,
                containment: '#tagFun_div_main',
                helper: 'clone',
                start : function() {
                    this.style.visibility="hidden";
                },
                stop: function() {

                    this.style.visibility="visible";
                },
                zIndex:999

            });
            $( "#external-events" ).append(div);
            $(this).val('');

        }
				
				addEvent(val);
        return false;    //<---- Add this line
    }
});

/*****************************************************************
 * Display Modal
 * Loads up a friendly form for users to edit.
 * Assigns different functions to the accept button 
 * This is done by setting the strSubmitFunc
 *****************************************************************/
function displayModal(calEvent, strSubmitFunc, eventType) {

    // Get rid of errors whenever a new modal is made
    clearModalErrors();

    //Creating a Calendo Event
    if (eventType==="Create Event"){
        $('h3.eventType').text('Create Event');
        $('.confirmation-button').text('Create');

        //Create Empty Body
        //TO DO
        $('#event-name-input').val('');
        $('#start-time-input').val(startDate);
        var endDate = moment(startDate).add(1,'hours').format();
        $('#end-time-input').val(moment(endDate).format(ACCEPTED_DATE_FORMAT));
        $('#location-input').val('');
        $('#description-input').val('');
        $(".confirmation-button").attr("onclick",strSubmitFunc);
        $("#url").hide();
        $('.delete-button').hide();
    } else{
        //Calendo Event
        if(calEvent.id=="external-event"){

            $('h3.eventType').text('Add to Calendar');
            $('.confirmation-button').text('Add');

            //Body
            $('#event-name-input').val(calEvent.title);
            //TODO: check if start time is indicated
            $('#start-time-input').val(calEvent.start);
            $('#end-time-input').val(calEvent.end);
            $('#location-input').val(calEvent.location);
            $('#description-input').val(calEvent.description);
            $(".confirmation-button").attr("onclick",strSubmitFunc);
            $("#url").hide();
            $('.delete-button').hide();
        }
        //Calendo Event created via Smart Scheduling
        else if(calEvent.id.includes("smart-schedule")&& calEvent.url==undefined){
            $('h3.eventType').text('Schedule To-Do');
            $('.confirmation-button').text('Accept Schedule');
            //Body
            $('#event-name-input').val(calEvent.title);
            $('#start-time-input').val(calEvent.start.format(ACCEPTED_DATE_FORMAT));
            $('#end-time-input').val(calEvent.end.format(ACCEPTED_DATE_FORMAT));
            $('#location-input').val(calEvent.location);
            $('#description-input').val(calEvent.description);
            $(".confirmation-button").attr("onclick","addToCalendar()");
            $("#url").hide();
            $('.delete-button').hide();
        }
        //Google Calendar Event
        else{
            //set global var to remember the GCal ID
            id=calEvent.id;
            console.log("ID: "+id);
            //Case where it already exists on Google Calendar
            $('h3.eventType').text('Edit Event');
            $('.confirmation-button').text('Save Changes');

            //Body
            $('#event-name-input').val(calEvent.title);
            $('#start-time-input').val(calEvent.start.format(ACCEPTED_DATE_FORMAT));
            $('#end-time-input').val(calEvent.end.format(ACCEPTED_DATE_FORMAT));
            $('#location-input').val(calEvent.location);
            $('#description-input').val(calEvent.description);
            $(".confirmation-button").attr("onclick",strSubmitFunc);
            console.log("URL: "+calEvent.url);
            $("#url").attr("href",""+calEvent.url);
            $("#url").show();
            $('.delete-button').show();
        }
    }

    $("#modalWindow").modal();
    $("#dynamicModal").modal('show');
}

/*****************************************************************
 * Display Modal asking User to confirm delete
 *****************************************************************/
function confirmDelete(){
    $(".bs-example-modal-sm").modal('show');
}

/*****************************************************************
 * Delete Event
 * Occurs only when user confirms delete from confirmDelete()
 * confirmDelete() is only triggered when user clicks delete
 * from an Edit Event modal or if user drag event outside to
 * the trash can
 *****************************************************************/
function deleteEvent(){
    $("#bs-example-modal-sm").modal('hide');
    try{
        //executing google remove first
        initializeClient();
        gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': changedEvent.id,
        }).execute();
        //removes from local calendar as well
        $('#calendar').fullCalendar('removeEvents', changedEvent.id);
        $("#modalWindow").modal('hide');
        //display success message
        $("#event-remove-success").slideDown();
        setTimeout(function(){ $("#event-remove-success").slideUp(); }, waitTime);
    }
    catch(e){
        console.log(e);
        displayError();
    }
}

/*****************************************************************
 * Hide
 * Hides the Alert
 * Reason I hide all alerts in the same function is because
 * they auto hide after 3 seconds anyways.
 *****************************************************************/
function hide(){
    $("#event-add-success").slideUp();
    $("#event-create-success").slideUp();
    $("#event-change-success").slideUp();
    $("#event-failure").slideUp();
    $("#event-remove-success").slideUp();
    $("#event-move-success").slideUp();
    $("#event-resize-success").slideUp();
}

/*****************************************************************
 * Display Error if try catch fails.
 *****************************************************************/
function displayError(){
    $("#modalWindow").modal('hide');
    $("#event-failure").slideDown();
    setTimeout(function(){ hide();}, waitTime);
}

/*****************************************************************
 * Initialize External To-Do List and Full Calendar View
 *****************************************************************/
$(document).ready(function() {
    //External Events
    $('.fc-event').each(function() {
        //Initializing external event.
        $(this).data('event', {
 /******************************************************************
  * fads;falksfjasfa
  */            
            location: $(this).attr('data-todoloc'),
            description: $(this).attr('data-tododesc'),
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true, // maintain when user navigates (see docs on the renderEvent method)
            id: 'external-event', //give the event id so that it gets removed 
        });

        //This is what happens when you click the external event
        $(this).click(function(){
            //Add your functionality here
        });

        // make the event draggable using jQuery UI revert, if let go, will go back to its position
        $(this).draggable({
            //revert: 'invalid', 
            scroll: false,
            containment: '#tagFun_div_main',
            helper: 'clone',
            start : function() {
                this.style.visibility="hidden";
            },
            stop: function() {

                this.style.visibility="visible";
            },
            zIndex:999
        });

    });

    //Initialize the Calendar
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'

        },
        defaultView: 'month', //can use any of the following 'month,agendaWeek,agendaDay,listWeek'
        //dragRevertDuration: 0, //uncomment this one to make it not revert to original position
        editable: true,
        droppable: true, //this allows things to be dropped onto the calendar.
        slotLabelFormat:"HH:mm", //Format display of hours

        //API key created by William
        googleCalendarApiKey: 'AIzaSyD0XdpABM5YzCNI0QFP_Gm7mgqDuNzqy7M',
        eventColor: '#4990e2',
        height: 'parent',

        /*****************************************************************
         * Event Resize
         * WHEN EVENT IS RESIZED NOT IN MONTH VIEW
         * No need to use Modals.
         *****************************************************************/
        eventResize: function(event, delta, revertFunc) {
            try{
                initializeClient();
                //If event is a GCal Event. This is determined by event having both id+url
                if(event.id!==undefined && event.url!==undefined){
                    var toPushEvent = {
                        'summary': event.title,
                        'description': event.description,
                        'location': event.location,
                        'start': {
                            'dateTime': event.start.format(),
                            'timeZone': 'America/Los_Angeles'
                        },
                        'end': {
                            'dateTime': event.end.format(),
                            'timeZone': 'America/Los_Angeles'
                        }
                    };  
                    gapi.client.calendar.events.update({
                        'calendarId': 'primary',
                        'eventId': event.id,
                        'resource': toPushEvent
                    }).execute();
                }
                $("#event-resize-success").slideDown();
            }catch(e){
                console.log(e);
                $("#event-failure").slideDown();
            }
        },
        /*****************************************************************
         * Event Drop
         * WHEN EVENT IS DRAGGED AND DROPPED WITHIN CALENDAR
         * No need to use Modals.
         *****************************************************************/
        eventDrop: function(event, delta, revertFunc) {
            initializeClient();
            if(event.id!==undefined && event.url!==undefined){
                var toPushEvent = {
                    summary: event.title,
                    'start': {
                        'dateTime': event.start.format(),
                        'timeZone': 'America/Los_Angeles'
                    },
                    'end': {
                        'dateTime': event.end.format(),
                        'timeZone': 'America/Los_Angeles'
                    }
                };  
                gapi.client.calendar.events.update({
                    'calendarId': 'primary',
                    'eventId': event.id,
                    'resource': toPushEvent
                }).execute();
            }
            $("#event-move-success").slideDown();
            setTimeout(function(){ hide();}, waitTime);

        },
        /*****************************************************************
         * Drop
         * WHEN AN EXTERNAL EVENT IS DROPPED ONTO THE CALENDAR
         * Uses Modal
         *****************************************************************/
        drop: function(date, allDay) {

            todoEvent = $(this);
            startDate = date.format(ACCEPTED_DATE_FORMAT);
            var defaultDuration = moment.duration($('#calendar').fullCalendar('option', 'defaultTimedEventDuration'));
            endDate = date.clone().add(1,'h').format(ACCEPTED_DATE_FORMAT);
            changedEvent = $(this).data('event');
            changedEvent.start = date.format(ACCEPTED_DATE_FORMAT);
            changedEvent.end =endDate;
            $("#calendar").fullCalendar('removeEvents', 'external-event');
            displayModal(changedEvent, "addToCalendar()", "Add To Calendar");

        },
        /*****************************************************************
         * Day Click
         * WHEN A DAY IS CLICKED: CREATE NEW EVENT
         * Uses Modal
         *****************************************************************/
        dayClick: function(date, jsEvent, view) {              
            //easter egg
            if(date.format("MM:DD")==="04:20"){

                var win = window.open("https://www.youtube.com/watch?v=KlujizeNNQM", '_blank');
                win.focus();
            } 
            startDate = date.format(ACCEPTED_DATE_FORMAT);
            displayModal(undefined, "generateEvent()", "Create Event");

        },

        /*****************************************************************
         * Event Click
         * WHEN A CREATED EVENT IS CLICKED: CREATE NEW EVENT
         * Precondition: Event is already a Google Calendar Event
         * Uses Modal
         *****************************************************************/
        eventClick: function(calEvent, jsEvent, view) {
            changedEvent = calEvent;
            id=calEvent.id;
            console.log(calEvent);
            displayModal(calEvent, "saveChanges()", "Save Changes");
            return false;
        },
        /*****************************************************************
         * Event Drag Stop 
         * USED FOR DELETING EVENT VIA DRAGGING!
         * Uses Confirmation Modal
         *****************************************************************/
        eventDragStop: function(event,jsEvent) {
            var trashEl = jQuery('#calendarTrash');
            var ofs = trashEl.offset();

            var x1 = ofs.left;
            var x2 = ofs.left + trashEl.outerWidth(true);
            var y1 = ofs.top;
            var y2 = ofs.top + trashEl.outerHeight(true);

            if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                changedEvent=event;
                confirmDelete(); 
            }
        }

    });

});


/*****************************************************************
 * GENERATE EVENT
 * Called by DayClick
 * Trigger: User wants to create an event and clicks on Day
 * Precondition: No events exist, no field is filled
 * Postcondition: Event Created on both Calendars
 * Uses Google Calendar API
 *****************************************************************/
function generateEvent(){
    try{
        initializeClient();
        if (!validateEvent($('#start-time-input').val(), $('#end-time-input').val())) {
            return false;
        }
        var gCalEvent = {
            'summary': $('#event-name-input').val(),
            'location': $('#location-input').val(),
            'description': $('#description-input').val(),
            'start': {
                'dateTime': $('#start-time-input').val()+':00.00',
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime': $('#end-time-input').val()+':00.00'            ,
                'timeZone': 'America/Los_Angeles'
            },
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 10}
                ]
            }
        };  
        gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': gCalEvent
        }).execute(function(resp){
            var newTitle = $('#event-name-input').val()
            var calendoEvent = {
                id: resp.id,
                url: resp.htmlLink,
                title: newTitle==""?"(No Title)":newTitle, 
                start: $('#start-time-input').val(),
                end: $('#end-time-input').val(),
                location: $('#location-input').val(),
                description: $('#description-input').val()
            }
            $('#calendar').fullCalendar('renderEvent', calendoEvent,stick=true);
            $('#calendar').fullCalendar('addEventSource', calendoEvent);
        })



        //close the modal window after completion
        $("#modalWindow").modal('hide');

        //succuess notification
        $("#event-create-success").slideDown();
        setTimeout(function(){ hide();}, waitTime);
    }catch(e){
        console.log(e);
        displayError();
    }
}

/*****************************************************************
 * ADD TO CALENDAR
 * Called by Drop
 * Trigger: User wants to add TO DO to Calendar
 * Precondition: No events exist, user already created TODO event
 *    OR 
 *               Smart-Scheduled
 * Postcondition: Event Created on both Calendars
 * Uses Google Calendar API
 *****************************************************************/
function addToCalendar(){
    try{
        //store id of pre
        var External = true;
        id=changedEvent.id;
        if(changedEvent.id.includes('smart-schedule')){
            External = false;
        }
        initializeClient();

        if (!validateEvent($('#start-time-input').val(), $('#end-time-input').val())) {
            return false;
        }

        var gCalEvent = {
            'summary': $('#event-name-input').val(),
            'location': $('#location-input').val(),
            'description': $('#description-input').val(),
            'start': {
                'dateTime': $('#start-time-input').val()+':00.00',
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime': $('#end-time-input').val()+':00.00'            ,
                'timeZone': 'America/Los_Angeles'
            },
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 10}
                ]
            }
        };  


        gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': gCalEvent
        }).execute(function(resp){
            changedEvent.start=$('#start-time-input').val();
            changedEvent.end=$('#end-time-input').val();
            var newTitle = $('#event-name-input').val();
            changedEvent.title = newTitle==""?"(No Title)":newTitle;
            changedEvent.description = $('#description-input').val()
            changedEvent.location = $('#location-input').val()
            changedEvent.url=resp.htmlLink;
            changedEvent.id=External?resp.id:id;
            changedEvent.color = '#4990e2';


            if(External){
                $('#calendar').fullCalendar('renderEvent', changedEvent,stick=true);
            }else{
                $('#calendar').fullCalendar('updateEvent',changedEvent);

            }

        });

        //Remove from todolist event
        //Will not trigger if user does not click button.

/********************************************
 * dfa;dlfkajdfalkfj

 * 
*/  
        //$('id')
        console.log("MOO COWS");
        var ourId = todoEvent.attr('data-todoID');
        console.log(ourId); 
        console.log("what am I");
        updateRequest(ourId);


        if(External){
            todoEvent.remove();
        }


        //close the modal window after completion
        $("#modalWindow").modal('hide');

        //success notification
        $("#event-add-success").slideDown();
        setTimeout(function(){ hide();}, waitTime);
    }catch(e){
        console.log(e);
        displayError();
    }
}
/*************************************************************************
 ******
 ******
 ******/
function updateRequest(value){
     
    var inputId = value;
    





    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val(); 
    console.log("crsf token"+ csrftoken);
    var url = "/api/schedule";
    var form_data = new FormData();
    
    form_data.append("id", inputId);
    


    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
                
            //Send the proper header information along with the request
            //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    xhr.send(form_data);
    console.log("sent params");

}
/*****************************************************************
 * SAVE CHANGED
 * Called by Event Click
 * Trigger: User wants to edit event
 * Precondition: Event exists on both calendars
 * Postcondition: Event is changed/remain the same and changes 
 * show on both calendars
 * Uses Google Calendar API
 *****************************************************************/
function saveChanges() {
    try{
        initializeClient();

        if (!validateEvent($('#start-time-input').val(), $('#end-time-input').val())) {
            return false;
        }

        changedEvent.start=$('#start-time-input').val();
        changedEvent.end=$('#end-time-input').val();
        var newTitle = $('#event-name-input').val();
        changedEvent.title = newTitle==""?"(No Title)":newTitle;
        changedEvent.description = $('#description-input').val();
        changedEvent.location = $('#location-input').val();

        $('#calendar').fullCalendar('updateEvent', changedEvent);

        var gCalEvent = {
            'summary': $('#event-name-input').val(),
            'location': $('#location-input').val(),
            'description': $('#description-input').val(),
            'start': {
                'dateTime': $('#start-time-input').val()+':00.00',
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime': $('#end-time-input').val()+':00.00',
                'timeZone': 'America/Los_Angeles'
            },
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 10}
                ]
            }
        };


        gapi.client.calendar.events.update({
            'calendarId': 'primary',
            'eventId':id,
            'resource': gCalEvent
        }).execute();
        //close the modal window after completion
        $("#modalWindow").modal('hide');
        //display success message
        $("#event-change-success").slideDown();
        setTimeout(function(){ hide();}, waitTime);
    }catch(e){
        console.log(e);
        displayError();
    }
}


// Returns true if no errors, else false
// Expects strings for start and end times in format:
// YYYY-MM-DD[T]HH:mm
function validateEvent(startTime, endTime) {
    //console.log('In validateEvent()');
    //console.log(startTime);
    //console.log(endTime);
    var error = false;
    var start = moment(startTime, "YYYY-MM-DD[T]HH:mm");
    var end = moment(endTime, "YYYY-MM-DD[T]HH:mm");

    if (!start.isValid()) {
        $('#start-time-input-div').addClass('has-error');
        console.log('No start time');
        $('#start-time-input-help').text('Start time is a required field');
        $('#start-time-input-help').show();
        error = true;
    }
    else {
        $('#start-time-input-div').removeClass('has-error');
        $('#start-time-input-help').hide();
    }

    if (!end.isValid()) {
        console.log('No end time');
        $('#end-time-input-div').addClass('has-error');
        $('#end-time-input-help').text('End time is a required field');
        $('#end-time-input-help').show();
        error = true;
    }
    else {
        $('#end-time-input-div').removeClass('has-error');
        $('#end-time-input-help').hide();
    }

    if (error) {
        return false;
    }

    if (start >= end) {
        console.log('Ends before start')
        $('#start-time-input-div').addClass('has-error');
        $('#end-time-input-div').addClass('has-error');
        $('#end-time-input-help').text('End time must be after start time');
        $('#end-time-input-help').show();
        return false;
    }

    return true;
}


function clearModalErrors() {
    $('#start-time-input-div').removeClass('has-error');
    $('#end-time-input-div').removeClass('has-error');
    $('#start-time-input-help').hide();
    $('#end-time-input-help').hide();
}

$(".btn").mouseup(function() {
    $(this).blur();  
})