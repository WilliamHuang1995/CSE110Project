var clientId = '617019221248-is0488but4kvt0jbmkukeqaih66qqjna.apps.googleusercontent.com';
var apiKey = 'AIzaSyCuG7UIEUUkKOshDQspnYaBO4_6FVwME4w';
var scopes = 'https://www.googleapis.com/auth/calendar';

function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth,1);
}

function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
    var authorizeButton = document.getElementById('authorize-button');

    if (authResult && !authResult.error) {
        authorizeButton.style.visibility = 'hidden';          
        makeApiCall();
    } else {
        authorizeButton.style.visibility = '';
        authorizeButton.onclick = handleAuthClick;
        GeneratePublicCalendar();
    }
}

function handleAuthClick(event) {            
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
}


// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {

    // Step 4: Load the Google+ API
    gapi.client.load('calendar', 'v3').then(function() {
        // Step 5: Assemble the API request
        var request = gapi.client.calendar.events.list({
            'calendarId': '<your-calendar-id(The @gmail.com>'
        });

        // Step 6: Execute the API request
        request.then(function(resp) {

            var eventsList = [];
            var successArgs;
            var successRes;

            if (resp.result.error) {
                reportError('Google Calendar API: ' + data.error.message, data.error.errors);
            }
            else if (resp.result.items) {
                $.each(resp.result.items, function(i, entry) {
                    var url = entry.htmlLink;

                    // make the URLs for each event show times in the correct timezone
                    //if (timezoneArg) {
                    //    url = injectQsComponent(url, 'ctz=' + timezoneArg);
                    //}

                    eventsList.push({
                        id: entry.id,
                        title: entry.summary,
                        start: entry.start.dateTime || entry.start.date, // try timed. will fall back to all-day
                        end: entry.end.dateTime || entry.end.date, // same
                        url: url,
                        location: entry.location,
                        description: entry.description
                    });
                });

                // call the success handler(s) and allow it to return a new events array
                successArgs = [ eventsList ].concat(Array.prototype.slice.call(arguments, 1)); // forward other jq args
                successRes = $.fullCalendar.applyAll(true, this, successArgs);
                if ($.isArray(successRes)) {
                    return successRes;
                }
            }

            if(eventsList.length > 0)
            {
                // Here create your calendar but the events options is :
                //fullcalendar.events: eventsList (Still looking for a methode that remove current event and fill with those news event without recreating the calendar.

            }
            return eventsList;

        }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    });
}

function GeneratePublicCalendar(){  
    // You need a normal fullcalendar with googleApi when user isn't logged

    $('#calendar').fullCalendar({
        /*googleCalendarApiKey: 'AIzaSyCuG7UIEUUkKOshDQspnYaBO4_6FVwME4w',      
        eventSources: [{
            googleCalendarId: 'shsidforever@gmail.com',
            className: 'gcal-event' //an option!
        },                                   {
            googleCalendarId: 'slmnliu@gmail.com',
            className: 'nice-event'
        }
                      ]
    */});  
}

