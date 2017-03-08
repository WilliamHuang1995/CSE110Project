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
            }
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPES
            });
            var gevent = {
                'start': {
                    'dateTime': event.start.format(),
                    'timeZone': 'America/Los_Angeles'
                },
                'end': {
                    'dateTime': event.end.format(),
                    'timeZone': 'America/Los_Angeles'
                }
            };
            $.ajax({
                url: "https://www.googleapis.com/calendar/v3/calendars/" + 'primary' + "/events/" + event.id,
                method: "PUT",
                data: gevent
            });
            /*gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': event.id,
                'resource': gevent
            }).execute();*/
        },



        // this allows things to be dropped onto the calendar
        droppable: true, 
        slotLabelFormat:"HH:mm",
        drop: function() {
            $(this).remove();
        },


        //when you click on the day.
        dayClick: function(date, jsEvent, view) {
            if (confirm("yee?")){
                var audio = document.getElementById("audio");
                audio.play();
            }
            if(date.format("MM:DD")==="04:20"){
                //easter egg
                var win = window.open("https://www.youtube.com/watch?v=XtECttp9WUk", '_blank');
                win.focus();
            }

        },

        //By Daniel Keirouz. When you click on an event. 
        eventClick: function(calEvent, jsEvent, view) {
            changedEvent = calEvent;
            var header = "Event: " + calEvent.title;
            var content = "Date: " + calEvent.start.toLocaleString();
            var strSubmitFunc = "saveChanges()";
            var btnText = "Save Changes";
            createModal('eventModal', calEvent, strSubmitFunc, btnText);
            return false;
        },

        //API key created by William
        googleCalendarApiKey: 'AIzaSyD0XdpABM5YzCNI0QFP_Gm7mgqDuNzqy7M'


    });
});

//this is aids. please refactor for later
var id;

function saveChanges() {
    //init THIS IS NEEDED TO MAKE API CALLS
    changedEvent.start=$('#start-time-input').val();
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

function createModal(placementId, calEvent, strSubmitFunc, btnText) {
    id=calEvent.id;
    console.log(calEvent.start.format('YYYY-MM-DD[T]HH:mm:ss.ms'));
    console.log(calEvent.end.format('YYYY-MM-DD[T]HH:mm:ss.ms'));
    
    html =  '<div id="modalWindow" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirm-modal" aria-hidden="true">';
    html += '<div class="modal-dialog">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html += '<a class="close" data-dismiss="modal">×</a>';
    html += '<h4>Edit Event</h4>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<form class="form-inline">';
    html += '<div class="form-group">';
    // Event Name
    html += '<label for="example-text-input" class="col-2 col-form-label">Event Name:</label>';
    html += '<div class="col-10">';
    html += '<input class="form-control" type="text" value="' + calEvent.title + '"id="event-name-input">';
    html += '</div>';
    // Start Info
    html += '<label for="example-text-input" class="col-2 col-form-label">Start:</label>';
    html += '<div class="col-10">';
    html += '<input class="form-control" type="datetime-local" value="' + calEvent.start.format('YYYY-MM-DD[T]HH:mm') + '"id="start-time-input">';
    html += '</div>';
    // End Info
    html += '<label for="example-text-input" class="col-2 col-form-label">End:</label>';
    html += '<div class="col-10">';
    html += '<input class="form-control" type="datetime-local" value="' + calEvent.end.format('YYYY-MM-DD[T]HH:mm') + '"id="end-time-input">';
    html += '</div>';
    // Location
    html += '<label for="example-text-input" class="col-2 col-form-label">Location:</label>';
    html += '<div class="col-10">';
    html += '<input class="form-control" type="text" value="' + calEvent.location + '"id="location-input">';
    html += '</div>';
    // Description
    html += '<label for="example-text-input" class="col-2 col-form-label">Description:</label>';
    html += '<div class="col-10">';
    html += '<input class="form-control" type="text" value="' + calEvent.description + '"id="description-input">';
    html += '</div>';
    html += '</form>';
    html += '</div>';
    html += '<a href="' + calEvent.url + '">Click Here to Edit on Google</a>';
    html += '</div>';
    html += '<div class="modal-footer">';
    if (btnText!='') {
        html += '<span class="btn btn-success"';
        html += ' onClick="'+strSubmitFunc+'">'+btnText;
        html += '</span>';
    }
    html += '<span class="btn" data-dismiss="modal">';
    html += '</span>'; // close button
    html += '</div>';  // footer
    html += '</div>';  // content
    html += '</div>';  // dialog
    html += '</div>';  // modalWindow
    $("#"+placementId).html(html);
    $("#modalWindow").modal();
    $("#dynamicModal").modal('show');
}
