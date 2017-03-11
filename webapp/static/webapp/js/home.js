// Client ID and API key from the Developer Console. From William
var CLIENT_ID = '617019221248-anpai3721kguigchcufa4emvq19o7bmn.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

//used for saveChanges()
var id;
var changedEvent;

//used for generateEvent()
var clickedDate;
var endDate;

//constant variable string format
const ACCEPTED_DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm';




$("#event-name-input").keyup(function(event){
    if(event.keyCode == 13){
        $(".confirmation-button").click();
    }
});
$("#location-input").keyup(function(event){
    if(event.keyCode == 13){
        $(".confirmation-button").click();
    }
});
$("#description-input").keyup(function(event){
    if(event.keyCode == 13){
        $(".confirmation-button").click();
    }
});
$(document).ready(function() {
    //By Eric Sen. Draggable Events
    $('#external-events .fc-event').each(function() {

        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true, // maintain when user navigates (see docs on the renderEvent method)
            id: 'external-event'
        });

        // make the event draggable using jQuery UI
        // revert, if let go, will go back to its position
        $(this).draggable({
            zIndex: 999,
            revert: false,        //  original position after the drag

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
        dragRevertDuration: 0,
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar
        slotLabelFormat:"HH:mm",

        //When event is resized not on Month view
        eventResize: function(event, delta, revertFunc) {

            try{
                //initialize client
                gapi.client.init({
                    discoveryDocs: DISCOVERY_DOCS,
                    clientId: CLIENT_ID,
                    scope: SCOPES
                });
                //If event is a GCal Event.
                if(event.id!==undefined){
                    var toPushEvent = {
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
                //display success message
                $("#event-resize-success").slideDown();
            }catch(e){
                console.log(e);
                $("#event-failure").slideDown();
            }


        },
        //when you drag'n'drop within calendar, also update GCal 
        eventDrop: function(event, delta, revertFunc) {
            //initialize client
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPES
            });
            if(event.id!==undefined){
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
            //display success message
            $("#event-move-success").slideDown();
            setTimeout(function(){ hide();}, 5000);

        },
        //if you drop an external event, it removes the original
        drop: function(date, allDay) {


            clickedDate = date.format(ACCEPTED_DATE_FORMAT);
            var defaultDuration = moment.duration($('#calendar').fullCalendar('option', 'defaultTimedEventDuration'));
            endDate = date.clone().add(defaultDuration).format(ACCEPTED_DATE_FORMAT); // on drop we only have date given to us
            changedEvent = $(this).data('event');
            changedEvent.start = date.format(ACCEPTED_DATE_FORMAT);
            changedEvent.end = date.clone().add(defaultDuration).format(ACCEPTED_DATE_FORMAT);
            
            //console.log('start is '+ date.format());
            //console.log('end is ' + end.format());
            //console.log(originalEventObject.title);
            createModal(changedEvent, "addToCalendar()", "Add To Calendar");
            //$("#calendar").fullCalendar('removeEvents', 'external-event');
            //remove after
            $(this).remove();
        },
        //when you click on the day.
        dayClick: function(date, jsEvent, view) {              //easter egg
            if(date.format("MM:DD")==="04:20"){

                var win = window.open("https://www.youtube.com/watch?v=XtECttp9WUk", '_blank');
                win.focus();
            } 
            var strSubmitFunc = "generateEvent()";
            clickedDate = date.format(ACCEPTED_DATE_FORMAT);
            createModal(undefined, strSubmitFunc, "Create Event")

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
        },

        //API key created by William
        googleCalendarApiKey: 'AIzaSyD0XdpABM5YzCNI0QFP_Gm7mgqDuNzqy7M'
        //http://stackoverflow.com/questions/34297915/fullcalendar-how-to-remove-event

    });
});


/**
 * By William
 * Trigger: User wants to create an event and clicks on Day
 * Precondition: No events exist, no field is filled
 * Postcondition: fields are filled, event pushed to GCal (optional?)
 */

function generateEvent(){
    //alert("generateEvent");
    try{
        //Since no event exist prior, no need to update event. But need to create event to add to calendar

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

        //initialize client
        gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        });

        gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': gCalEvent
        }).execute(function(resp){


            var calendoEvent = {
                id: resp.id,
                url: resp.htmlLink,
                title: $('#event-name-input').val(), 
                start: $('#start-time-input').val(),
                end: $('#end-time-input').val(),
                location: $('#location-input').val(),
                description: $('#description-input').val()
            }
            //render event
            $('#calendar').fullCalendar('renderEvent', calendoEvent,stick=true);
            $('#calendar').fullCalendar('addEventSource', calendoEvent);
        })



        //close the modal window after completion
        $("#modalWindow").modal('hide');

        //succuess notification
        $("#event-add-success").slideDown();
        setTimeout(function(){ hide();}, 5000);
    }catch(e){

        $("#modalWindow").modal('hide');
        $("#event-failure").slideDown();
        console.log(e);
        setTimeout(function(){ hide();}, 5000);
    }
}

/**
 * By William
 * Trigger: An event reside on the To Do list.
 * Precondition: event already exist but not on calendar
 * Postcondition: event is displayed on calendar and also pushed to GCal (optional?)
 */
function addToCalendar(){
    console.log(changedEvent.title);
    console.log(moment(changedEvent.start).format());
    console.log(moment(changedEvent.end).format());

    try{

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
        //initialize client
        gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        });

        gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        }).execute(function(resp){
            //save local title, start, end time.
            changedEvent.start=$('#start-time-input').val();
            changedEvent.end=$('#end-time-input').val();
            console.log(changedEvent.start);
            console.log(changedEvent.end);
            var newTitle = $('#event-name-input').val();
            changedEvent.title = newTitle==""?"(No Title)":newTitle;
            //save local description
            changedEvent.description = $('#description-input').val()
            //save local location
            changedEvent.location = $('#location-input').val()
            //add event
            changedEvent.url=resp.htmlLink;
            changedEvent.id=resp.id;
            //$('#calendar').fullCalendar('addEventSource', changedEvent);
            //render event not sure if I need both
            $('#calendar').fullCalendar('renderEvent', changedEvent,stick=true);
        });
        //close the modal window after completion
        $("#modalWindow").modal('hide');

        //success notification
        $("#event-add-success").slideDown();
        setTimeout(function(){ hide();}, 5000);
    }catch(e){
        console.log(e);
        $("#modalWindow").modal('hide');
        $("#event-failure").slideDown();
        setTimeout(function(){ hide();}, 5000);
    }
}
/** 
* Function is only called when event exists on Calendar
* The event can either be a Calendo Event or a Google Calendar Event.
* The only difference would be that we refrain from assigning an id to Calendo Events as the ID is how we actually push Calendo Events to Google Calendar.
*/
function saveChanges() {
    try{
        //save local title, start, end time.
        changedEvent.start=$('#start-time-input').val();
        changedEvent.end=$('#end-time-input').val();
        var newTitle = $('#event-name-input').val();
        changedEvent.title = newTitle==""?"(No Title)":newTitle;
        //save local description
        changedEvent.description = $('#description-input').val()
        //save local location
        changedEvent.location = $('#location-input').val()

        //update event
        $('#calendar').fullCalendar('updateEvent', changedEvent);

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
        //initialize client
        gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        });

        gapi.client.calendar.events.update({
            'calendarId': 'primary',
            'eventId':id,
            'resource': event
        }).execute();
        //close the modal window after completion
        $("#modalWindow").modal('hide');
        //display success message
        $("#event-add-success").slideDown();
        setTimeout(function(){ hide();}, 5000);
    }catch(e){
        console.log(e);
        $("#modalWindow").modal('hide');
        $("#event-failure").slideDown();
        setTimeout(function(){ hide(); }, 5000);
    }
}

//show the confirmation
function confirmDelete(){
    $(".bs-example-modal-sm").modal('show');
}
/*
 * Deletes the Event from Calendo and GCal
 * It does both since most people wouldn't migrate here if it is not synchronized
 * You can only delete GCal registered events since calendo does not have an id.
 */
function deleteEvent(){
    $("#bs-example-modal-sm").modal('hide');
    console.log("delete");
    try{

        //executing google remove first
        gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        });
        gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': changedEvent.id,
        }).execute();
        //removes from local calendar
        $('#calendar').fullCalendar('removeEvents', changedEvent.id);




        $("#modalWindow").modal('hide');
        //display success message
        $("#event-remove-success").slideDown();
        setTimeout(function(){ $("#event-remove-success").slideUp(); }, 5000);
    }
    catch(e){
        console.log(e);
        $("event-failure").slideDown();
        setTimeout(function(){ $("#event-failure").slideUp(); }, 5000);
    }
}

/*
 * Hides the alert(s)
 */
function hide(){
    $("#event-add-success").slideUp();
    $("#event-failure").slideUp();
    $("#event-remove-success").slideUp();
    $("#event-move-success").slideUp();
    $("#event-resize-success").slideUp();
}

/*
 * Created by Daniel Keirouz
 * Enhanced by William Huang
 * Description: This should technically no longer be
 * called createModal as the function assigns value to
 * different field and displays it
 */
function createModal(calEvent, strSubmitFunc, eventType) {
    //might wanna autofill the clickedDate for ease of access
    //console.log(clickedDate.format());

    //Creating a Calendo Event
    if (eventType==="Create Event"){
        $('h4.eventType').text('Create Event');
        $('.confirmation-button').text('Create');

        //Create Empty Body
        $('#event-name-input').val('');
        //TODO: check if start time is indicated
        $('#start-time-input').val(clickedDate);
        var endDate = moment(clickedDate).add(1,'hours').format();
        console.log(endDate);
        $('#end-time-input').val(moment(endDate).format(ACCEPTED_DATE_FORMAT));
        $('#location-input').val('');
        $('#description-input').val('');
        $(".confirmation-button").attr("onclick",strSubmitFunc);
        $("#url").hide();
        $('.delete-button').hide();
    } else{
        //Calendo Event
        if(calEvent.id=="external-event"){

            $('h4.eventType').text('Add to Calendar');
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
        //Google Calendar Event
        else{
            //set global var to remember the GCal ID
            id=calEvent.id;
            console.log(id);
            //Case where it already exists on Google Calendar
            $('h4.eventType').text('Edit Event');
            $('.confirmation-button').text('Save Changes');

            //Body
            $('#event-name-input').val(calEvent.title);
            $('#start-time-input').val(calEvent.start.format(ACCEPTED_DATE_FORMAT));
            $('#end-time-input').val(calEvent.end.format(ACCEPTED_DATE_FORMAT));
            $('#location-input').val(calEvent.location);
            $('#description-input').val(calEvent.description);
            $(".confirmation-button").attr("onclick",strSubmitFunc);
            console.log(calEvent.url);
            $("#url").attr("href",""+calEvent.url);
            $("#url").show();
            $('.delete-button').show();
        }
    }

    $("#modalWindow").modal();
    $("#dynamicModal").modal('show');
}
