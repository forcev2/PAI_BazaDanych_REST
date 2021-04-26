function rent(startDate, endDate, car_id){
    var xhr = new XMLHttpRequest();
    var url = "/rent";

    console.log(startDate, endDate, car_id)

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function (ev) {
        if (xhr.readyState === 4 && xhr.status === 200) {

            console.log(xhr);
            window.location.assign(xhr.responseURL)
        }
    };

    var data = {
        "car_id": car_id,
        "start_date": new Date(startDate),
        "end_date": new Date(endDate)
    };

    //console.log("ELELELEL")
    var dataSend = JSON.stringify(data);
    xhr.send(dataSend);
}