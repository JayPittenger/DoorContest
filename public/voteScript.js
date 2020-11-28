// Jay Pittenger


// add event listener to start new entry submission
document.addEventListener('DOMContentLoaded', submitVote);

/* Function performs submission of vote to database if proper input was entered by user */
function submitVote(){
    errortxt = document.getElementById("error-txt");
    errortxt.textContent = "";
    document.getElementById('entry-submit').addEventListener('click', function(event){
        var req = new XMLHttpRequest();
        // variables for submitted values
        roomnum = document.getElementById("room-num").value;
        photovote = getRadioVal(document.getElementById("submit-form"), "photoVote")
        
        // input validation
        if (roomnum != "") {
            roomnum = parseInt(roomnum)
        }
        if (photovote == "" || photovote == undefined){
            photovote = null;
            errortxt.textContent = "Please click on a photo to vote.";
        }
        else if (photovote != null) {
            photovote = parseInt(photovote);
        }
        console.log(roomnum);
        console.log(photovote);
        if (roomnum > 509 || roomnum < 0 || roomnum == "") {

            errortxt.textContent = "Please enter a valid apartment number.";
        }
        else if ( (photovote == roomnum) && roomnum != ""){
         
            errortxt.textContent = "You cannot vote for your own apartment door. Please make a different photo selection.";
        }

        // only submit if proper input recieved 
        else if (roomnum != "" && photovote != null){
            var reqContent = "?roomnum=" + roomnum + "&photovote=" + photovote;
            console.log("valid submittal");
            document.getElementById("entry-submit").disabled = true;

            // perform asynchronous GET request to Node server to select for input validation
            req.open("GET", "/select" + reqContent, true);
            req.addEventListener("load", function(){
                if( req.status >= 200 && req.status < 400){
                    var response = JSON.parse(req.responseText);
                    var roomnumexists = false;
                    //NOT USED
                    // input validation to ensure that no one votes more than once 
                    /*
                    for (var i = 0; i < response.results.length; i++){
                        if (parseInt(response.results[i].roomnum) == roomnum){
                            roomnumexists = true;
                            errortxt.textContent = "You have already voted. If you believe this is an error, contact the Resident Services Coordinator.";
                            break
                        }
                    }
                    */
                    if(roomnumexists == false){
                        var req2 = new XMLHttpRequest();
                        // perform asynchronous GET request to Node server for table insert
                        req2.open("GET", "/insert" + reqContent, true);
                        req2.addEventListener("load", function(){
                            if( req2.status >= 200 && req2.status < 400){
                            // Update page to tell user that vote was submitted properly
                            document.getElementById("submit-form").style.display = "none";
                            document.getElementById("instructions").style.display = "none";
                            document.getElementById("page-header").textContent = "Thanks for voting!";
                            document.getElementById("winner").textContent = "Winner will be announced on November 2nd in the weekly email and on the bulletin board.";
                            } else {
                            console.log("vote submission failed");
                            document.getElementById("entry-submit").disabled = false;
                            }
                        })
                        req2.send(null);
                    }
                } else {
                    console.log("selection failed");
                    document.getElementById("entry-submit").disabled = false;
                }
            })
        req.send(null);
        }
        event.preventDefault();
    });
}


// radio form search function from the following website:
// https://www.dyn-web.com/tutorials/forms/radio/get-selected.php
function getRadioVal(form, name) {
    var val;
    // get list of radio buttons with specified name
    var radios = form.elements[name];
    
    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}