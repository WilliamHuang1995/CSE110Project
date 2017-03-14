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
        $("#calendar").fullCalendar('removeEvents');
        $("#calendar").show();

        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
    } else {
        //Remove All Events.
        $("#calendar").fullCalendar('removeEvents');
        $("#calendar").hide();

        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
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
    // For todays date;
    Date.prototype.today = function () { 
        return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
    }

    // For the time now
    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
    }
    //You can then simply retrieve the date and time by doing the following:

    var newDate = new Date();
    var datetime = "LastSync: " + newDate.today() + " @ " + newDate.timeNow();
    // console.log(newDate, datetime);
    var d = new Date();
    var currentMonth = d.getMonth() + 1;
    var currentDate = d.getDate();
    var currentHour = d.getHours();
    var currentMinute = d.getMinutes();
    var currentYear = d.getFullYear();

    gapi.client.calendar.events.list({
        //Whether or not to expand recurring events as instance
        singleEvents: true,
        maxResults: 9999,
        'calendarId': 'primary',
    }).then(function(response) {
        var eventsList = [];
        var successArgs;
        var successRes;
        var events = response.result.items;
        var daysTwoWeeks = 14;
        var minutesOneHour = 60;
        var hoursOneDay = 24;
        var totalBlocks = daysTwoWeeks*hoursOneDay*minutesOneHour;
        // 14 days * 24 hours * 60 1-minute blocks

        var freeTime = new Array(totalBlocks);
        for (i = 0; i < totalBlocks; i++)
        {
            freeTime[i] = 0;
        }
        // initialize element to 0, free

        var FreeStart = 6;  // Default start of free time 8:00
        var FreeEnd = 21;   // Default end of free time 17:00

        var Offset = -(currentHour * minutesOneHour + currentMinute);

        for(k = 0; k <= daysTwoWeeks; k++)
        {
            for (i = 0; i < FreeStart * minutesOneHour; i++)
            {
                if(i+k*hoursOneDay*minutesOneHour+Offset >= 0)
                    freeTime[i+k*hoursOneDay*minutesOneHour+Offset] = 1;
            }
            for (j = FreeEnd * minutesOneHour; j < 24 * minutesOneHour; j++)
            {
                if(j+k*hoursOneDay*minutesOneHour+Offset >= 0)
                    freeTime[j+k*hoursOneDay*minutesOneHour+Offset] = 1;
            }
        }

        var rainbowEffect = true;
        var rainbowCounter = 0;
        var rainbowColor = 'cornflowerBlue';
        var colorCount = 6; // 8 different colors for different events
        var rainbowEvent = new Array(colorCount);
        var existingEvent = false;

        $.each(response.result.items, function(i, entry)
               {
            var date = new Date(entry.start.dateTime);
            var entryMonthStart = date.getMonth() + 1;
            var entryDateStart = date.getDate();
            var entryHourStart = date.getHours();
            var entryMinuteStart = date.getMinutes();
            var entryYearStart = date.getFullYear();

            var dateEnd = new Date(entry.end.dateTime);
            var entryMonthEnd = dateEnd.getMonth() + 1;
            var entryDateEnd = dateEnd.getDate();
            var entryHourEnd = dateEnd.getHours();
            var entryMinuteEnd = dateEnd.getMinutes();
            var entryYearEnd = dateEnd.getFullYear();

            var DurationMonth = entryMonthEnd - entryMonthStart;
            var DurationDate = entryDateEnd - entryDateStart;
            var DurationHour = entryHourEnd - entryHourStart;
            var DurationMinute = entryMinuteEnd - entryMinuteStart;
            var DurationYear = entryYearEnd - entryYearStart;

            var StartMonth = entryMonthStart - currentMonth;
            var StartDate = entryDateStart - currentDate;
            var StartHour = entryHourStart - currentHour;
            var StartMinute = entryMinuteStart - currentMinute;
            var StartYear = entryYearStart - currentYear;

            var DurationBlocks = DurationDate*24*60 + DurationHour*60 + DurationMinute; 

            // entry is within same year
            if (StartYear == 0)
            {
                // entry is within same month
                if (StartMonth == 0)
                {
                    // if entry is within two weeks from today
                    if (StartDate >= 0 && StartDate <= daysTwoWeeks)
                    {
                        for(i = (StartDate*24*60 + StartHour*60 + StartMinute); i < (StartDate*24*60 + StartHour*60 + StartMinute)+ DurationBlocks; i++)
                        {
                            freeTime[i] = 1;
                            // 1 is busy, 0 is free
                        }
                    }
                }
                // End of month
                else if (StartMonth == 1)
                {
                    var differenceInDays = entryDateStart + daysInMonth(currentMonth, currentYear) - currentDate;
                    if (differenceInDays <= daysTwoWeeks)
                    {
                        for(i = (differenceInDays*24*60 + StartHour*60 + StartMinute); i < (differenceInDays*24*60 + StartHour*60 + StartMinute)+ DurationBlocks; i++)
                        {
                            freeTime[i] = 1;
                            // 1 is busy, 0 is free
                        }
                    }
                }
            }
            // entry year is following year
            
            else if (StartYear == 1)
            {
                // If current month is December and entry month is January of folling year
                if(StartMonth == - 11)
                {
                    var differenceInDays = entryDateStart + daysInMonth(currentMonth, currentYear) - currentDate;
                    if (differenceInDays <= daysTwoWeeks)
                    {
                        for(i = (differenceInDays*24*60 + StartHour*60 + StartMinute); i < (differenceInDays*24*60 + StartHour*60 + StartMinute)+ DurationBlocks; i++)
                        {
                            freeTime[i] = 1;
                            // 1 is busy, 0 is free
                        }
                    }
                }

            }


            var url = entry.htmlLink;

            if(rainbowEffect)
            {
                // console.log(rainbowCounter);
                for(i = 0; i < eventsList.length; i++)
                {

                    if(entry.summary == eventsList[i].title)
                    {
                        // console.log(entry.summary);
                        // console.log(eventsList[i].title);
                        rainbowColor = eventsList[i].color;
                        existingEvent = true;
                        break;
                    }
                }
            }

            if (existingEvent == false)
            {
                switch(rainbowCounter%7)
                {
                    case 0:
                        rainbowColor = '#FF5722'
                        break;

                    case 1:
                        rainbowColor = '#4990E2'
                        break;

                    case 2:
                        rainbowColor = '#673ABC'
                        break;

                    case 3:
                        rainbowColor = '#3F51B5'
                        break;

                    case 4:
                        rainbowColor = '#FF9800'
                        break;

                    case 5:
                        rainbowColor = '#E91E63'
                        break;	

                }
                rainbowCounter++;
            }
            existingEvent = false;




            eventsList.push({
                id:entry.id,
                title: entry.summary, 
                start: entry.start.dateTime || entry.start.date,
                end: entry.end.dateTime || entry.end.date,
                url: url,
                location: entry.location,
                description: entry.description,
                color: rainbowColor

            });

        });
        var ConsecBlocks = 0;

        // find free blocks
        for(i = 0; i < totalBlocks; i++)
        {
            //console.log(freeTime[i]);
            if (freeTime[i] == 0 && i != totalBlocks - 1)
                // if free increment free consec minutes
            {
                ConsecBlocks++;
            }
            else if (ConsecBlocks > 0)
            {
                var currentBlocks = currentDate*60*24 + currentHour*60 + currentMinute;

                var startBlocks = currentBlocks + i - ConsecBlocks;
                var endBlocks = startBlocks + ConsecBlocks - 1;

                var FreeDateStart = Math.floor(startBlocks/(24*60));
                var FreeHourStart = (Math.floor(startBlocks/60))%(24);
                var FreeMinuteStart = startBlocks%60;

                var FreeDateEnd = Math.floor(endBlocks/(24*60));
                var FreeHourEnd = (Math.floor(endBlocks/60))%(24);
                var FreeMinuteEnd = endBlocks%60;

                console.log(FreeDateStart, FreeHourStart, FreeMinuteStart);
                console.log(FreeDateEnd, FreeHourEnd, FreeMinuteEnd);

                var FreeEventStart = new Date();
                var FreeEventEnd = new Date();

                FreeEventStart.setMonth(currentMonth - 1);
                // need to change current month
                FreeEventStart.setDate(FreeDateStart);
                FreeEventStart.setHours(FreeHourStart);
                FreeEventStart.setMinutes(FreeMinuteStart);

                FreeEventEnd.setMonth(currentMonth - 1);
                // need to change current month
                FreeEventEnd.setDate(FreeDateEnd);
                FreeEventEnd.setHours(FreeHourEnd);
                FreeEventEnd.setMinutes(FreeMinuteEnd);

                ConsecBlocks = 0;
                //console.log(FreeEventStart);
                //console.log(FreeEventEnd);

                
                eventsList.push({
                title: 'Free Time', 
                start: FreeEventStart,
                end: FreeEventEnd,
                color: 'blue',
                id: "external-event",
                url: undefined,


                });
                
            }
        }
        console.log("end123");



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

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}
