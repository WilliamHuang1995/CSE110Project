//THIS IS MEANT TO BE A TEMPLATE DOES NOT DO ANYTHING ATM

document.getElementById("submit").addEventListener("click", onTodoClick())

var toDoClick = function(){
    var url = "sample-url.php";
    var params = "lorem=ipsum&name=alpha";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

//Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.send(params);
      
};



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
var client = new HttpClient();
client.get('http://some/thing?with=arguments', function(response) {
    // do something with response
});