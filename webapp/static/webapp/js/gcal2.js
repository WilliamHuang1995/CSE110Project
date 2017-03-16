/*****************************************************************
 * Display Modal asking User to confirm delete
 *****************************************************************/
var CLIENT_ID = '617019221248-anpai3721kguigchcufa4emvq19o7bmn.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar";


/*****************************************************************
 * Buttons
 *****************************************************************/
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/*****************************************************************
 * Global Vars
 *****************************************************************/
const MONTHS = 12;
//const START_DAY = 6;
//const END_DAY = 21;
const DAYS_TWO_WEEK = 14;
const HOUR_IN_MINUTES = 60;
const DAY_IN_HOURS = 24;
/*****************************************************************
 * Settings - to be expanded if given more time
 * Includes: Days to not schedule stuff
 *           The time range
 *****************************************************************/
const minutesBreak = 0; // 10 minutes of break betwee events
const weekend = 0; //change this to make a specific date unscheduled
var FreeStart = 8;  // Default start of free time 8:00
var FreeEnd = 18;   // Default end of free time 17:00


const COLOR_COUNT = 6;

function timeBlock(start1,end1,duration1,priority,title){
    this.start = start1;
    this.end = end1;
    this.duration = duration1;
    this.priority = priority;
    this.title = title;
}

/**On load, called to load the auth2 library and API client library.*/
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function blocksToTime(block, startorend){
    var d = new Date();
    var currentMonth = d.getMonth() + 1;
    var currentDate = d.getDate();
    var currentHour = d.getHours();
    var currentMinute = d.getMinutes();
    var currentYear = d.getFullYear();
    var currentBlocks = currentDate*60*24 + currentHour*60 + currentMinute;

    var FreeDateStart = Math.floor(block/(24*60));
    var FreeHourStart = (Math.floor(block/60))%(24);
    var FreeMinuteStart = block%60;

    // console.log(FreeDateStart, FreeHourStart, FreeMinuteStart);
    // console.log(FreeDateEnd, FreeHourEnd, FreeMinuteEnd);

    var FreeEventStart = new Date();
    if (startorend == 'start')
    {
        FreeEventStart.setSeconds(59);
    }
    else
    {
        FreeEventStart.setSeconds(0);
        if (FreeMinuteStart%5 == 0)
        {
            //console.log('minutestart')
            FreeMinuteStart--;   
        }
    }

    FreeEventStart.setMonth(currentMonth - 1);
    FreeEventStart.setDate(FreeDateStart);
    FreeEventStart.setHours(FreeHourStart);
    FreeEventStart.setMinutes(FreeMinuteStart);

    return FreeEventStart;
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
    var currentDay = d.getDay();

    gapi.client.calendar.events.list({
        //Whether or not to expand recurring events as instance
        singleEvents: true,
        maxResults: 9999,
        'calendarId': 'primary',
    }).then(function(response) {
        var eventsList = [];
        var freeList = [];
        var successArgs;
        var successRes;
        var events = response.result.items;
        var DAYS_TWO_WEEK = 14;
        var HOUR_IN_MINUTES = 60;
        var DAY_IN_HOURS = 24;
        var totalBlocks = DAYS_TWO_WEEK*DAY_IN_HOURS*HOUR_IN_MINUTES;
        // 14 days * 24 hours * 60 1-minute blocks

        var freeTime = new Array(totalBlocks);
        for (i = 0; i < totalBlocks; i++)
        {
            freeTime[i] = 0;
        }
        // initialize element to 0, free




        var Offset = -(currentHour * HOUR_IN_MINUTES + currentMinute);

        for(k = 0; k <= DAYS_TWO_WEEK; k++)
        {
            for (i = 0; i < FreeStart * HOUR_IN_MINUTES; i++)
            {
                if(i+k*DAY_IN_HOURS*HOUR_IN_MINUTES+Offset >= 0)
                    freeTime[i+k*DAY_IN_HOURS*HOUR_IN_MINUTES+Offset] = 1;
            }
            for (j = FreeEnd * HOUR_IN_MINUTES; j < 24 * HOUR_IN_MINUTES; j++)
            {
                if(j+k*DAY_IN_HOURS*HOUR_IN_MINUTES+Offset >= 0)
                    freeTime[j+k*DAY_IN_HOURS*HOUR_IN_MINUTES+Offset] = 1;
            }
            if ((currentDay+k)%7 == weekend)
            {
                for(l = 0; l < DAY_IN_HOURS * HOUR_IN_MINUTES; l++)
                {
                    if(l+k*DAY_IN_HOURS*HOUR_IN_MINUTES+Offset >= 0)
                        freeTime[l+k*DAY_IN_HOURS*HOUR_IN_MINUTES+Offset] = 1;
                }
            }
        }

        var rainbowEffect = true;
        var rainbowCounter = 0;
        var rainbowColor = 'cornflowerBlue';
        var colorCount = 6; // 8 different colors for different events
        var rainbowEvent = new Array(colorCount);
        var existingEvent = false;

        /*****************************************************************
         * 
         *****************************************************************/
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
                    if (StartDate >= 0 && StartDate <= DAYS_TWO_WEEK)
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
                    if (differenceInDays <= DAYS_TWO_WEEK)
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
                    if (differenceInDays <= DAYS_TWO_WEEK)
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
            colorArray=['#FF5722','#4990E2','#673ABC','#3F51B5','#FF9800','#E91E63']
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
                color: '#FF9800' //change it back later if u want

            });

        });
        var ConsecBlocks = 0;

        /*****************************************************************
         * FINDING FREE BLOCKS
         *****************************************************************/
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

                var freeTimeMinutes = ConsecBlocks;

                //console.log(FreeDateStart, FreeHourStart, FreeMinuteStart);
                //console.log(FreeDateEnd, FreeHourEnd, FreeMinuteEnd);

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

                var freeObject = new timeBlock(startBlocks,endBlocks,freeTimeMinutes,0,'Free Time');
                freeList.push(freeObject);

                /* eventsList.push({
                title: 'Free Time', 
                start: FreeEventStart,
                end: FreeEventEnd,
                color: 'blue',
                id: "external-event",
                url: undefined,
                });*/

            }
        }
        var todoList = [];
        var todoListHigh = [];
        var todoListNormal = [];

        
        /*****************************************************************
         *
         *
         * YO ERIC LOOK HERE. PUT UR BACK END STUFF HERE~!@!@$!@#!@#
         * the line directly below is what you'll need
         *
         *****************************************************************/
        
        //todoList.push(new timeBlock(new Date(),undefined,//duration in minutes in INTEGER,//high or normal, //event name));
        
        // testing todos
        startObject = new Date();
        var freeObject = new timeBlock(startObject,undefined,45,'high','High priority');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',500,'normal','low priority1');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',45,'normal','low priority 2');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',180,'normal','low priority 3');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',90,'normal','low priority 4');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',45,'normal','low priority 5');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',45,'normal','low priority 6');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',90,'normal','low priority 7');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',45,'normal','low priority 8');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',45,'normal','low priority 9');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',300,'high','High priority test 2');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',180,'high','High priority test 3');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',45,'high','High priority test 4');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',180,'high','High priority test 5');
        todoList.push(freeObject);
        var freeObject = new timeBlock(startObject,'GG',45,'high','High priority test 6');
        todoList.push(freeObject);
        // end of testing todos

        
        /*****************************************************************
         * Sorts high priority and low priority
         * After sorting prioritizes high pri event over low pri
         *****************************************************************/
        for (j=0; j < todoList.length; j++)
        {
            if (todoList[j].priority == 'high')
                todoListHigh.push(todoList[j]);
            else
                todoListNormal.push(todoList[j]);
        }
        
        //used for making each smart scheduled event unique
        var index = 0;
        for (k=0; k < freeList.length; k++)
        {
            for ( i=0; i < todoListHigh.length; i++)
            {
                /*****************************************************************
                 * If you can fit to do
                 *****************************************************************/
                if(todoListHigh[i].duration + 2*minutesBreak < freeList[k].duration)
                {
                    eventsList.push({
                        title: todoListHigh[i].title, 
                        start: blocksToTime(freeList[k].start + minutesBreak, 'start'),
                        end: blocksToTime(freeList[k].start + todoListHigh[i].duration + minutesBreak, 'end'),
                        color: 'red',
                        id: 'smart-schedule'+index++,
                        description: 'High Priority Calen-Do event created by smart scheduling'

                    });
                    /*****************************************************************
                     * update after insertion
                     *****************************************************************/
                    freeList[k].start = freeList[k].start + (todoListHigh[i].duration + minutesBreak);
                    freeList[k].duration = freeList[k].duration - (todoListHigh[i].duration + minutesBreak);

                    todoListHigh.splice(i,1);
                    i--;
                }
            }
        }

        for (k=0; k < freeList.length; k++)
        {
            for ( i=0; i < todoListNormal.length; i++)
            {
                if(todoListNormal[i].duration + 2*minutesBreak <= freeList[k].duration)
                {
                    eventsList.push({
                        title: todoListNormal[i].title, 
                        start: blocksToTime(freeList[k].start + minutesBreak, 'start'),
                        end: blocksToTime(freeList[k].start + todoListNormal[i].duration + minutesBreak, 'end'),
                        color: 'pink',
                        id: 'smart-schedule'+index++,
                        description: 'Low Priority Calen-Do event created by smart scheduling'

                    });
                    freeList[k].start = freeList[k].start + (todoListNormal[i].duration + minutesBreak);
                    freeList[k].duration = freeList[k].duration - (todoListNormal[i].duration + minutesBreak);
                    todoListNormal.splice(i,1);
                    i--;
                }
            }
        }
        

        successArgs = [ eventsList].concat(Array.prototype.slice.call(arguments, 1));
        successRes = $.fullCalendar.applyAll(true, this, successArgs);
        if(events.length > 0){
            $('#calendar').fullCalendar('addEventSource', eventsList, true);
        }
    });
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}