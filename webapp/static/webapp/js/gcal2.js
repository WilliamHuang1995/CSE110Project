// Client ID and API key from the Developer Console. From William
var CLIENT_ID = '617019221248-anpai3721kguigchcufa4emvq19o7bmn.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";


//Needs to be changed for later
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');


/**On load, called to load the auth2 library and API client library.*/
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**Initializes the API client library and sets up sign-in state listeners. */
function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        //Assign the onclick functionality
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

/**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        listUpcomingEvents();
    } else {
        //Remove All Events.
        $("#calendar").fullCalendar('removeEvents')
    }
}

/**
       *  Sign in the user upon button click.
       */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}


/**
       *  Sign out the user upon button click.
       */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
function listUpcomingEvents() {
    alert("HEY THAT'S PRETTY GAY");
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
    }).then(function(response) {
        var eventsList = [];
        var successArgs;
        var successRes;
        var events = response.result.items;
        $.each(response.result.items, function(i, entry)
               {
            var url = entry.htmlLink;
            //SOLOMON LOOK HERE! str is the recurrence rule without the RRULE: from the beginning
            if(entry.recurrence!== undefined){
                var str= entry.recurrence+""
                console.log(str.replace("RRULE:",""));}
            console.log(entry.summary);
            eventsList.push({
                id:entry.id,
                title: entry.summary, 
                start: entry.start.dateTime || entry.start.date,
                end: entry.end.dateTime || entry.end.date,
                url: url,
                location: entry.location,
                description: entry.description
            });
        });

        successArgs = [ eventsList].concat(Array.prototype.slice.call(arguments, 1));
        successRes = $.fullCalendar.applyAll(true, this, successArgs);
        if(events.length > 0){
            $('#calendar').fullCalendar('addEventSource', eventsList, true);
        }
        /* Debug purpose
        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPre(event.summary + ' (' + when + ')')
            }
        } else {
            appendPre('No upcoming events found.');
        }*/
    });
}
