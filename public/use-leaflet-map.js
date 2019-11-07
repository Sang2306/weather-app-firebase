var mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibGV0YW5oc2FuZyIsImEiOiJjazF0M2VyemIwMTFiM2hrYjFsMTNobzNoIn0.tE1bw5NhRsPbkBAOyFtYjw';

var satellite = L.tileLayer(
    mapboxUrl,
    {
        maxZoom: 25,
        attribution: '&copy Le Tanh Sang',
        id: 'mapbox.satellite',
        zoom: 12
    }
)

var streets = L.tileLayer(
    mapboxUrl,
    {
        maxZoom: 25,
        attribution: '&copy Le Tanh Sang',
        id: 'mapbox.streets',
        zoom: 12
    }
)

var mymap = L.map('mapid', {
    center: [9.997240, 106.205276],
    zoom: 13,
    layers: [satellite, streets]
});
var baseLayers = {
    "Đường phố": streets,
    "Vệ tinh": satellite
}
L.control.layers(baseLayers).addTo(mymap)

var marker = null;
$(document).ready(() => {
    $('#gpsBtn').click();
})
$('#current-loc').on('click', () => {
    $('#gpsBtn').click();
})
$('#gpsBtn').on('click', () => {
    if (marker !== null) {
        marker.removeFrom(mymap);
    }
    //ask for current location
    navigator.geolocation.getCurrentPosition(function (location) {
        var latlong = new L.latLng(location.coords.latitude, location.coords.longitude);
        marker = new L.marker(latlong);
        marker.addTo(mymap);
        mymap.setView(latlong);
        //show current location on latitude and longtitude
        $('#lat').text('Lat\n' + latlong.lat.toFixed(6));
        $('#long').text('Long\n' + latlong.lng.toFixed(6));
        fillCityNameAndID(latlong.lat, latlong.lng);
        showWeatherOnCurrentLocation();
        fetchAQIbasedOnNearestLocation(latlong.lat, latlong.lng);
    });
})

//get click on map and set new marker position
mymap.on('click', function (mouseevent) {
    if (marker !== null) {
        marker.setLatLng(mouseevent.latlng);
    } else {
        marker = new L.marker(mouseevent.latlng);
        marker.addTo(mymap);
    }
    let lat = marker.getLatLng().lat;
    let lng = marker.getLatLng().lng;
    $('#lat').text('Lat\n' + lat.toFixed(6));
    $('#long').text('Long\n' + lng.toFixed(6));
    //try to get infor of current location on OpenWeatherAPI then fill id and name
    fillCityNameAndID(lat, lng);
    fetchAQIbasedOnNearestLocation(lat, lng);
});

function fillCityNameAndID(lat, lng) {
    let http_current_api = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=metric" + "&APPID=" + API_KEY;
    fetch(http_current_api).then((response) => {
        return response.json();
    }).then((json) => {
        //extract information of the location
        locate_name = json.name;
        locatte_id = json.id;
        $('#locationName').val(locate_name);
        $('#locationID').val(locatte_id);
    });
}

function fetchAQIbasedOnNearestLocation(lat, lng) {
    let airvisual_api_url = "https://api.airvisual.com/v2/nearest_city?lat=" + lat + "&lon=" + lng + "&key=cc18efce-0c03-4f4a-a82e-f9d86c841939";
    fetch(airvisual_api_url).then((response) => {
        return response.json();
    }).then((json) => {
        let raw = json;
        update_aqi_data(raw);
        get_aqi_data(raw.data.state); //raw.data.city
    });
}

//Fix not fit map on modal boostrap
$('#addLocation').on('show.bs.modal', function () {
    setInterval(function () {
        mymap.invalidateSize()
    }, 1);
})