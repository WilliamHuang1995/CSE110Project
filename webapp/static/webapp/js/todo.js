//gets todo items from list from database (can consider cache)

function getRequest(){
    $(document).ready(function(){
            var client = new HttpClient();
            client.get('/api/get', function(response) {
        // do something with response

                var temp = JSON.parse(response); 

                console.log(temp[0].title);
                console.log(temp.length);    
                for(var i = 0; i < temp.length; i++){

                    var node = document.createElement("LI");
                    console.log("entered loop");
                    console.log(i);
                    var textnode = document.createTextNode(temp[i].title);
                    node.appendChild(textnode);
                    document.getElementById("myUL").appendChild(node);

                    
                    
                }
                appendClose(); 
            })
        }); 
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
}

$(document).ready(getRequest());
// Create a "close" button and append it to each list item

function appendClose(){
    var myNodelist = document.getElementsByTagName("LI");
    var i;
    for (i = 0; i < myNodelist.length; i++) {
      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.appendChild(txt);
      myNodelist[i].appendChild(span);
    }

    // Click on a close button to hide the current list item
    var close = document.getElementsByClassName("close");
    var i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function() {
        var div = this.parentElement;
        console.log(div);
        //var text = div["innerText" in div ? "innerText" : "textContent"]; 
        var text = div.innerText; 
        console.log(text);
        text = text.substring(0, text.length -1); 
        console.log(text);
        deleteRequest(text);   
        div.style.display = "none";
      }
    }      
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);



// Create a new list item when clicking on the "Add" button
function newElement() {
    postRequest();
    //This may be bad practice
    var node = document.createElement("LI");
    var newValue = document.getElementById("myInput").value;
    var textnode = document.createTextNode(newValue);
    node.appendChild(textnode);
    document.getElementById("myUL").appendChild(node);
    appendClose();
    //window.location.reload(true);

};  

function postRequest(){
    var inputValue = document.getElementById("myInput").value;
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

