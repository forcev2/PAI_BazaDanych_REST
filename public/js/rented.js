

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function openModal(start, end, index) {
    var modal = document.getElementById("myModal");
    var startDateInp = document.getElementById("start")
    var endDateInp = document.getElementById("end");
    var indexInp = document.getElementById("rental_id")

    startDateInp.valueAsDate = new Date(start);
    endDateInp.valueAsDate = new Date(end);
    indexInp.value = index;

    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function closeModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    var errorMsg = document.getElementById("error-msg");
    errorMsg.hidden = true;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function sendForm(){
    var xhr = new XMLHttpRequest();
    var url = "/changeRentalDates";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function (ev) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            ev.preventDefault();
            console.log(xhr);
            console.log("isCorrect " + json.correctChange);
            if(json.correctChange)
                closeModal();
        }
    };
    var startDateInp = document.getElementById("start")
    var endDateInp = document.getElementById("end");
    var indexInp = document.getElementById("rental_id")

    console.log("ELELELEL")
    var data = JSON.stringify({"rental_id":indexInp.value , "start": startDateInp.value, "end": endDateInp.value });
    xhr.send(data);
}

$(function() {
    $('#rental').submit(function(event) {
        event.preventDefault(); // Stops browser from navigating away from page
        var startDateInp = document.getElementById("start")
        var endDateInp = document.getElementById("end");
        var indexInp = document.getElementById("rental_id")

        console.log("new date ", new Date(startDateInp.valueAsDate).toISOString().split('T')[0])
        console.log("old ", startDateInp.valueAsDate)

        var data = {
            "rental_id":indexInp.value , 
            "start": new Date(startDateInp.valueAsDate).toISOString().split('T')[0], 
            "end": new Date(endDateInp.valueAsDate).toISOString().split('T')[0]
        };
        // build a json object or do something with the form, store in data
        $.post('/changeRentalDates', data, function(resp) {
            console.log("RESPONSE FROM SERVER ", resp);
            if(resp.correctChange)
                window.location.reload(true);
            else{
                var errorMsg = document.getElementById("error-msg");
                console.log("set error hidden false")
                errorMsg.hidden = false;
            }

            // do something when it was successful
        });
    });
});