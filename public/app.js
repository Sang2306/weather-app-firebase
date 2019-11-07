// Set up global var
var city_info_forecast, city_info_current;
var city_name, city_id;
var now = new Date(Date.now());
var date = now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();
// Firebase config and const are declared here

const firebaseConfig = {
    apiKey: "AIzaSyC3BM-0x5cHes126PzUV1hvtuCpgqwDv8c",
    authDomain: "weather4cast-45202.firebaseapp.com",
    databaseURL: "https://weather4cast-45202.firebaseio.com",
    projectId: "weather4cast-45202",
    storageBucket: "weather4cast-45202.appspot.com",
    messagingSenderId: "909159408530",
    appId: "1:909159408530:web:8e2176ae061f834225d74b",
    measurementId: "G-ZXK62L16JS"
};
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();


// Api key for openweather API call
const API_KEY = "257f1b36751ce1d3a3ec9eba954619d9";


// listen for changing city on firebase
class ObserverCitiesChanging {
    complete() { }
    error(error) { }
    next(snapshot) {
        $('#city').empty().trigger('change');
        snapshot.forEach(function (result) {                        //https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot.html?authuser=2#for-each
            var option = new Option(result.id, result.data().id, true, true);
            $('#city').append(option).trigger('change');
        });
        $('#city').select2('close');
    }
}


const observerCities = new ObserverCitiesChanging();
firestore.collection("Cities").onSnapshot(observerCities);      //https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference.html?authuser=2#onsnapshot

$('#city').on('select2:select', function (e) {
    document.getElementById("update").click();  //Emulate the update event
});

//Get the city's weather data based on date selected by users
function get_city_weather_forecast() {
    let citiesDocumentReference = firestore.collection("Cities").doc(city_name); //get reference to document "name" of collection cities
    let promiseDocumentSnapShot = citiesDocumentReference.collection(date).doc("forecast").get({ source: "server" });        //get up-to-date content of the document via server
    promiseDocumentSnapShot.then((content) => {
        city_info_forecast = content.data();
        // Show all entry data
        showDateToSelect(city_info_forecast);

        showAllTemperatures(city_info_forecast); //helper.js
        showTemperatureChart(city_info_forecast); //helper.js

        showAllHumidities(city_info_forecast);   //helper.js
        showHumidityChart(city_info_forecast);  //helper.js

        showAllWinds(city_info_forecast);    //helper.js
        showWindChart(city_info_forecast);  //helper.js
    });
}


function get_city_weather_current() {
    let citiesDocumentReference = firestore.collection("Cities").doc(city_name); //get reference to document "name" of collection cities
    let promiseDocumentSnapShot = citiesDocumentReference.collection(date).doc("current").get({ source: "server" });        //get up-to-date content of the document via server
    promiseDocumentSnapShot.then((content) => {
        city_info_current = content.data();
        // Show current weather data
        showTemperature(city_info_current);
        showHumidity(city_info_current);
        showWind(city_info_current);
        showRain(city_info_current);
    });
}

function get_aqi_data(city_or_state) {
    let aqi_promise = firestore.collection("AQI").doc(city_or_state).collection(date).doc("current").get({ source: "server" });
    aqi_promise.then((content) => {
        aqi_info = content.data();
        console.log(aqi_info)
    });
}

// Each time update button click it'll fetch api from openweather 
var updateBtn = document.getElementById("update");
updateBtn.addEventListener("click", () => {
    let data = $('#city').find(':selected');
    city_name = data[0].text;
    city_id = data[0].value;
    //Fetch data for forecasting
    let http_forecast_api = "https://api.openweathermap.org/data/2.5/forecast?id=" + city_id + "&units=metric" + "&APPID=" + API_KEY;
    fetch(http_forecast_api).then((response) => {
        return response.json();
    }).then((json) => {
        "use strict"
        let data = json;
        update_forecast_data(data, city_name); //Update data on firebase
        get_city_weather_forecast();
    });
    //Fetch data for current
    let http_current_api = "https://api.openweathermap.org/data/2.5/weather?id=" + city_id + "&units=metric" + "&APPID=" + API_KEY;
    fetch(http_current_api).then((response) => {
        return response.json();
    }).then((json) => {
        "use strict"
        let data = json;
        update_current_data(data, city_name); //Update data on firebase
        get_city_weather_current();
    });
})


// Click add location
var addLocationBtn = document.getElementById("addLocationBtn");
addLocationBtn.addEventListener("click", function () {
    const locationName = document.getElementById("locationName").value;
    const locationID = document.getElementById("locationID").value;
    addLocationToFirebase(locationName, locationID);
});


//  update data into city on firebase
function update_forecast_data(data, city_name) {
    firestore.collection("Cities").doc(city_name).collection(date).doc("forecast").set(data);
}


function update_current_data(data, city_name) {
    firestore.collection("Cities").doc(city_name).collection(date).doc("current").set(data);
}

// let vietnam = [
//     '/vietnam/an-giang', '/vietnam/da-nang', '/vietnam/dak-nong',
//     '/vietnam/gia-lai', '/vietnam/hanoi', '/vietnam/hau-giang',
//     '/vietnam/ho-chi-minh-city', '/vietnam/kon-tum', '/vietnam/long-an',
//     '/vietnam/thanh-pho-can-tho', '/vietnam/thanh-pho-gja-nang', '/vietnam/thanh-pho-hai-phong',
//     '/vietnam/tinh-ba-ria-vung-tau', '/vietnam/tinh-bac-giang', '/vietnam/tinh-bac-kan',
//     '/vietnam/tinh-bac-lieu', '/vietnam/tinh-bac-ninh', '/vietnam/tinh-ben-tre',
//     '/vietnam/tinh-binh-duong', '/vietnam/tinh-binh-gjinh', '/vietnam/tinh-binh-phuoc',
//     '/vietnam/tinh-binh-thuan', '/vietnam/tinh-ca-mau', '/vietnam/tinh-cao-bang',
//     '/vietnam/tinh-dien-bien', '/vietnam/tinh-gjak-lak', '/vietnam/tinh-gjong-nai',
//     '/vietnam/tinh-gjong-thap', '/vietnam/tinh-ha-giang', '/vietnam/tinh-ha-tay',
//     '/vietnam/tinh-ha-tinh', '/vietnam/tinh-hai-duong', '/vietnam/tinh-hoa-binh',
//     '/vietnam/tinh-hung-yen', '/vietnam/tinh-kien-giang', '/vietnam/tinh-lai-chau',
//     '/vietnam/tinh-lam-gjong', '/vietnam/tinh-lang-son', '/vietnam/tinh-lao-cai',
//     '/vietnam/tinh-nam-gjinh', '/vietnam/tinh-nghe-an', '/vietnam/tinh-ninh-binh',
//     '/vietnam/tinh-ninh-thuan', '/vietnam/tinh-phu-yen', '/vietnam/tinh-quang-binh',
//     '/vietnam/tinh-quang-nam', '/vietnam/tinh-quang-ngai', '/vietnam/tinh-quang-ninh',
//     '/vietnam/tinh-quang-tri', '/vietnam/tinh-soc-trang', '/vietnam/tinh-son-la',
//     '/vietnam/tinh-tay-ninh', '/vietnam/tinh-thai-binh', '/vietnam/tinh-thai-nguyen',
//     '/vietnam/tinh-thanh-hoa', '/vietnam/tinh-thua-thien-hue', '/vietnam/tinh-tien-giang',
//     '/vietnam/tinh-tra-vinh', '/vietnam/tinh-tuyen-quang', '/vietnam/tinh-vinh-long',
//     '/vietnam/tinh-vinh-phuc', '/vietnam/tinh-yen-bai'
// ];

function update_aqi_data(raw) {
    let cleaned_data = {
        'aqius': raw.data.current.pollution.aqius, //us standard
        'aqicn': raw.data.current.pollution.aqicn //china standard
    }
    let city_or_state = raw.data.state;//raw.data.state
    firestore.collection("AQI").doc(city_or_state).collection(date).doc("current").set(cleaned_data);
}

// Add location with ID
function addLocationToFirebase(locationName, locationID) {
    let test = "https://api.openweathermap.org/data/2.5/weather?id=" + locationID + "&units=metric" + "&APPID=" + API_KEY;
    fetch(test).then((response) => {
        return response.json();
    }).then((json) => {
        "use strict"
        if (json.cod == 404 || json.cod == 400) {
            alert("Xem lại ID thành phố");
            return;
        }
        let docData = {
            id: locationID
        };
        firestore.collection("Cities").doc(locationName).set(docData);
    });
}


//show current location weather
function showWeatherOnCurrentLocation() {
    const locationID = document.getElementById("locationID").value
    const data = $('#city').find('[value=' + locationID + ']')
    if (data.length === 0) {
        alert('Địa điểm hiện tại bạn chưa có sẵn!\nGợi ý click vào "Thêm địa điểm"\n')
    } else {
        $('#city').val(locationID)
        $('#city').trigger('change')
        document.getElementById("update").click();
    }
}

//handle delete button
$('#delete').click(() => {
    let data = $('#city').find(':selected');
    city_name = data[0].text;
    firestore.collection('Cities').doc(city_name).delete().then((ok) => {
        console.log("Xóa ok!")
        document.getElementById("update").click();
    }).catch((failed) => {
        console.log('Xoá failed!')
    })
})