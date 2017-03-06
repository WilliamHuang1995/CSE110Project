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
        // This allow non-Google Calendar events to be moved
        editable: true,
        
        // this allows things to be dropped onto the calendar
        droppable: true, 
        drop: function() {
            //remove event from list
            $(this).remove();
        },
        
        //when you click on the day.
        dayClick: function() {
            var audio = document.getElementById("audio");
            audio.play();
        },
        
        //By Daniel Keirouz. When you click on an event. 
        eventClick: function(calEvent, jsEvent, view) {

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

function saveChanges() {
    alertString = 'Now if only I knew how to access the Google APIs..I\'d enter:\n';
    alertString += 'Event Name: ' + $('#event-name-input').val() + '\n';
    alertString += 'Start Time: ' + $('#start-time-input').val() + '\n';
    alertString += 'End Time: ' + $('#end-time-input').val() + '\n';
    alertString += 'Location: ' + $('#location-input').val() + '\n';
    alertString += 'Description: ' + $('#description-input').val();
    alert(alertString);
}

//this is aids. please refactor for later
function createModal(placementId, calEvent, strSubmitFunc, btnText) {
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
    html += '<input class="form-control" type="datetime-local" value="' + calEvent.start.format('YYYY-MM-DD[T]hh:mm:ss.ms') + '"id="start-time-input">';
    html += '</div>';

    // End Info
    html += '<label for="example-text-input" class="col-2 col-form-label">End:</label>';
    html += '<div class="col-10">';
    html += '<input class="form-control" type="datetime-local" value="' + calEvent.end.format('YYYY-MM-DD[T]hh:mm:ss.ms') + '"id="end-time-input">';
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
