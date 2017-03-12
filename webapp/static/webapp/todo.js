$(document).ready(function() {

  $('input').blur(function() {
    if ($(this).val())
      $("label[for='"+$(this).attr('id')+"']").addClass('used');
    else
      $("label[for='"+$(this).attr('id')+"']").removeClass('used');
  });
  
});


// Create a new list item when clicking on the "Add" button
function newTodo() {
    postRequest();
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

function postRequest(){
    var inputTitle = document.getElementById("task").value;
    var inputLoc = document.getElementById("loc").value;
    var inputDescrip = document.getElementById("desc").value;
    var inputDate = document.getElementById('example-date-input').value;
    var inputHours = document.getElementById("numHours").value;
    var inputMins = document.getElementById("numMins").value;
    var inputPriority = document.getElementById("priorityOpt").value;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val(); 
    var url = "/api/post";
    
    var params = inputValue;
    var form_data = new FormData();
    form_data.append("title", params); 
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
                
            //Send the proper header information along with the request
            //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    xhr.send(form_data);
    console.log("sent params");
}

function deleteRequest(someValue){
    var inputValue = someValue;
    var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val(); 
    var url = "/api/delete";
    
    var params = inputValue;
    var form_data = new FormData();
    form_data.append("title", params); 
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
                
            //Send the proper header information along with the request
            //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);

    xhr.send(form_data);
    console.log("sent params");    
}
    
