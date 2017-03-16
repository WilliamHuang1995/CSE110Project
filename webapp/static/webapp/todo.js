$(document).ready(function() {

  $('input').blur(function() {
    if ($(this).val())
      $("label[for='"+$(this).attr('id')+"']").addClass('used');
    else
      $("label[for='"+$(this).attr('id')+"']").removeClass('used');
  });

});

function showExtraSettings() {
	$('#smart-schedule-form').slideToggle();
	$('#smart-schedule-priority').slideToggle();
}

function getRequest(id){
    var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
          if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
              aCallback(anHttpRequest.responseText);
          }

          anHttpRequest.open( "GET", aUrl, true );
          anHttpRequest.send( null );
        }
    }

    $(document).ready(function(){
        var client = new HttpClient();
        client.get('/api/get?id='+id, function(response) {
        // do something with response
            var temp = JSON.parse(response);
            temp = temp[0];
            document.getElementById("task").value = temp.title;
            $('#task').focus();
            document.getElementById("loc").value = temp.location;
            $('#loc').focus();
            document.getElementById("desc").value = temp.description;
            $('#desc').focus();
            document.getElementById('example-date-input').value = temp.year + "-" + temp.month + "-" + temp.day;

            //$('#smart-schedule-switch').trigger('click');
            //$.getScript("https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js")
            //$('#smart-schedule-switch').bootstrapToggle('toggle')
            //$('#smart-schedule-switch').trigger('click');
            //$('#smart-schedule-switch').bootstrapToggle('on')
            //test = document.getElementById("smart-schedule-switch");
            //test.bootstrapToggle('toggle');
            //$('#smart-schedule-switch').prop('checked', true).change()
            //toggleOnByInput()
            //demo.toggle('#smart-schedule-switch')

            $('#desc').blur();

            inputHours = Math.floor((Number.parseInt(temp.estimateTime)/60)).toString();
            inputMins = (Number.parseInt(temp.estimateTime)%60).toString();

            if (inputHours == 0){
              document.getElementById("numHours").value = "Hours";
              document.getElementById("numMins").value = "Minutes";
            }
            else if (inputHours == 1){
              document.getElementById("numHours").value = inputHours + " hour";
              document.getElementById("numMins").value = inputMins + " min";
            }
            else{
              document.getElementById("numHours").value = inputHours + " hours";
              document.getElementById("numMins").value = inputMins + " min";
            }


            document.getElementById("priorityOpt").value = "High"; //temp.priority





        });
    });

}
//trying a callback post request :)


function postRequest(){

    var HttpClient = function() {
        this.post = function(aUrl, aCallback) {
            var inputTitle = document.getElementById("task").value;
            var inputLoc = document.getElementById("loc").value;
            var inputDescrip = document.getElementById("desc").value;
            var inputDate = document.getElementById('example-date-input').value;
            var inputHours = document.getElementById("numHours").value;
            var inputMins = document.getElementById("numMins").value;

            inputHours = Number.parseInt(inputHours.split(' ')[0]);
            inputMins = Number.parseInt(inputMins.split(' ')[0]);

            var estimatedTime = inputHours * 60 + inputMins;

						if(Number.isNaN(estimatedTime))
							estimatedTime = 0;


            var inputPriority = document.getElementById("priorityOpt").value;
            var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
            console.log("crsf token"+ csrftoken);
            var url = "/api/post";
            var form_data = new FormData();

            form_data.append("title", inputTitle);
            form_data.append("location", inputLoc);
            form_data.append("description", inputDescrip);
            form_data.append("dueDate", inputDate);
            form_data.append("estimateTime", estimatedTime);
            form_data.append("priority", inputPriority);


            var anHttpRequest = new XMLHttpRequest();
            anHttpRequest.onreadystatechange = function() {
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText);
            }




            //Send the proper header information along with the request
            //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


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

        if(document.getElementById("priorityOpt").value != "Priority "){
        $("#unscheduledDiv").append('\
            <a href="#" class="list-group-item list-group-item-action list-group-item-unscheduled" onClick="getRequest(' + temp + ')">\
                <span class="glyphicon glyphicon-ok-circle glyphicon-ok-circle-u" onClick="checkTodo()"></span>\
                <span class="glyphicon glyphicon-trash glyphicon-trash-u" id= ' + temp + ' onclick="deleteTodo()"></span>\
                <div class="p-2">\
                    <p class="mb-1" id=' + temp + '> ' + document.getElementById("task").value +'\
                    </p>\
                </div>\
            </a>');
        }
        else {
            $("#unscheduledDiv").append('\
            <a href="#" class="list-group-item list-group-item-action list-group-item-unscheduled" onClick="getRequest(' + temp + ')">\
                <span class="glyphicon glyphicon-ok-circle glyphicon-ok-circle-u" onClick="checkTodo()"></span>\
                <span class="glyphicon glyphicon-trash glyphicon-trash-u" id= ' + temp + ' onclick="deleteTodo()"></span>\
                <div class="p-2">\
                    <p class="mb-1" id=' + temp + '> ' + document.getElementById("task").value +'\
                        <img style="margin-bottom:3px; margin-left:7px;" src="/static/webapp/img/Fill 71.png" />\
                    </p>\
                </div>\
            </a>');

        }

        document.getElementById("task").value = null;
        document.getElementById("loc").value = null;
        document.getElementById("desc").value = null;
        document.getElementById('example-date-input').value = "";
        document.getElementById("numHours").value = "Hours";
        document.getElementById("numMins").value = "Minutes";
        document.getElementById("priorityOpt").value = "Priority"

        $('#task').blur();
        $('#loc').blur();
        $('#desc').blur();


    });
}
// Create a new list item when clicking on the "Add" button
function newTodo() {
    //if statement checking if task has id unsure since it has an id as well
    //then either edit or post depending on if it has id
    postRequest();



        //adding to scheduled div
    //This may be bad practice
        /*
    var node = document.createElement("LI");
    var newValue = document.getElementById("myInput").value;
    var textnode = document.createTextNode(newValue);
    node.appendChild(textnode);
    document.getElementById("myUL").appendChild(node);
    appendClose();
    //window.location.reload(true);
        */

};


/*function postRequest(){
    var inputTitle = document.getElementById("task").value;
    var inputLoc = document.getElementById("loc").value;
    var inputDescrip = document.getElementById("desc").value;
    var inputDate = document.getElementById('example-date-input').value;

    var inputHours = document.getElementById("numHours").value;
    var inputMins = document.getElementById("numMins").value;




		inputHours = Number.parseInt(inputHours.split(' ')[0]);
		inputMins = Number.parseInt(inputMins.split(' ')[0]);

		var estimatedTime = inputHours * 60 + inputMins;


    var inputPriority = document.getElementById("priorityOpt").value;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
		console.log("crsf token"+ csrftoken);
    var url = "/api/post";
		var form_data = new FormData();

		form_data.append("title", inputTitle);
		form_data.append("location", inputLoc);
		form_data.append("description", inputDescrip);
		form_data.append("dueDate", inputDate);
		form_data.append("estimateTime", estimatedTime);
		form_data.append("priority", inputPriority);


    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

            //Send the proper header information along with the request
            //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    xhr.send(form_data);
    console.log("sent params");

   /* var json_data = xhr.responseText;
    alert(json_data);
    console.log(typeof(json_data));
    console.log(json_data);
    var temp = JSON.parse(json_data);
    console.log(temp[0].id);
    return temp;
    */
/*
};
*/
function checkTodo(){
    var check = document.getElementsByClassName("glyphicon glyphicon-ok-circle glyphicon-ok-circle-u");
    var i;
    for (i = 0; i < check.length; i++){
        check[i].onclick = function(){
            var div = this;
            console.log(div);
            var text = div.getAttribute('id');
            console.log(text);

            checkRequest(text);

            div.classList.toggle('makeBlue');

        }
    }

}

function checkRequest(someValue){
    var inputValue = someValue;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    var url = "/api/click";

    var params = inputValue;
    var form_data = new FormData();
    form_data.append("id", params);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

            //Send the proper header information along with the request
            //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    xhr.send(form_data);
    console.log("sent params");

}



//should execute on delete call
function deleteTodo(){
    var close = document.getElementsByClassName("glyphicon glyphicon-trash glyphicon-trash-u");
    var i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function() {
        var div = this;
        console.log(div);
        //var text = div["innerText" in div ? "innerText" : "textContent"];
        var text = div.getAttribute('id');
        console.log(text);

        deleteRequest(text);
        div.parentElement.style.display = "none";
      }
    }
};


function deleteRequest(someValue){
    var inputValue = someValue;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    var url = "/api/delete";

    var params = inputValue;
    var form_data = new FormData();
    form_data.append("id", params);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

            //Send the proper header information along with the request
            //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    xhr.send(form_data);
    console.log("sent params");
}
