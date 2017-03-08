// Client ID and API key from the Developer Console. From William
var CLIENT_ID = '617019221248-anpai3721kguigchcufa4emvq19o7bmn.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";
var changedEvent;
$(document).ready(function() {
    //By Eric Sen. Draggable Events
    $('#external-events .fc-event').each(function() {

        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true // maintain when user navigates (see docs on the renderEvent method)
        });

        // make the event draggable using jQuery UI
        // revert, if let go, will go back to its position
        $(this).draggable({
            zIndex: 999,
            revert: true,      
            revertDuration: 0  //  original position after the drag
        });

    });

    //By William Huang. Initialize Calendar
    $('#calendar').fullCalendar({
        //Set the header
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'

        },
        defaultView: 'month',        
        editable: true,
        eventResize: function(event, delta, revertFunc) {

            alert(event.title + " end is now " + event.end.format());

            if (!confirm("is this okay?")) {
                revertFunc();
                return;
            }
            console.log(event.start.format('YYYY-MM-DD[T] HH:mm:ss.SSS'));
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPES
            });
            var gevent = {
                'start': {
                    'dateTime': event.start.format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                    'timeZone': 'America/Los_Angeles'
                },
                'end': {
                    'dateTime': event.end.format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                    'timeZone': 'America/Los_Angeles'
                }
            };

            gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': event.id,
                'resource': gevent
            }).execute();
        },



        // this allows things to be dropped onto the calendar
        droppable: true, 
        slotLabelFormat:"HH:mm",
        //if you drop an external event, it removes the original
        drop: function(event) {
            $(this).remove();
            var strSubmitFunc = "saveChanges()";
            createModal(event, strSubmitFunc, "Save Changes");    
        },


        //when you click on the day.
        dayClick: function(date, jsEvent, view) {            
            if(date.format("MM:DD")==="04:20"){
                //easter egg
                var win = window.open("https://www.youtube.com/watch?v=XtECttp9WUk", '_blank');
                win.focus();
            } 
            createModal(undefined, "createEvent", "Create Event")



        },

        //By Daniel Keirouz. When you click on an event. 
        eventClick: function(calEvent, jsEvent, view) {
            changedEvent = calEvent;
            id=calEvent.id;
            var header = "Event: " + calEvent.title;
            var content = "Date: " + calEvent.start.toLocaleString();
            var strSubmitFunc = "saveChanges()";
            var btnText = "Save Changes";
            createModal(calEvent, strSubmitFunc, btnText);
            return false;
        },

        //API key created by William
        googleCalendarApiKey: 'AIzaSyD0XdpABM5YzCNI0QFP_Gm7mgqDuNzqy7M'
        //http://stackoverflow.com/questions/34297915/fullcalendar-how-to-remove-event

    });
});

//this is aids. please refactor for later
var id;

function saveChanges() {
    //init THIS IS NEEDED TO MAKE API CALLS
    changedEvent.start=$('#start-time-input').val();
    changedEvent.end=$('#end-time-input').val();
    var newTitle = $('#event-name-input').val()
    
    
    changedEvent.title = newTitle==""?"(No Title)":newTitle;
    
    $('#calendar').fullCalendar('updateEvent', changedEvent);
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    });

    console.log($('#end-time-input').val());
    console.log($('#event-name-input').val());
    var event = {
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
    gapi.client.calendar.events.update({
        'calendarId': 'primary',
        'eventId':id,
        'resource': event
    }).execute();
}

function createModal(calEvent, strSubmitFunc, eventType) {
    //If event is generated from Our domain instead of GCal
    if (eventType=="Create Event"){
        $('h4.eventType').text('Create Event');
        $('.confirmation-button').text('Create');
    } else{
        if(calEvent.id==undefined){
            //means that you don't assign id if you're creating event locally
            $('h4.eventType').text('Add to Google');
        }
        else{
            //set global var to remember the GCal ID
            id=calEvent.id;
            console.log(id);
            //Case where it already exists on Google Calendar
            $('h4.eventType').text('Edit Event');
        }
    }





    try{
        $('#event-name-input').val(calEvent.title);
        $('#start-time-input').val(calEvent.start.format('YYYY-MM-DD[T]HH:mm'));
        $('#end-time-input').val(calEvent.end.format('YYYY-MM-DD[T]HH:mm'));
        $('#location-input').val(calEvent.location);
        $('#description-input').val(calEvent.description);
    }catch(e){

    }

    $("#modalWindow").modal();
    $("#dynamicModal").modal('show');
}
