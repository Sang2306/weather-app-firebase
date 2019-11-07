// Handle scroll to top button
window.onscroll = function () {
    scroll();
}
let topBtn = document.getElementById("scrollTop");
topBtn.addEventListener("click", function () {
    jumpToPos(0);
})
function scroll() {
    if (document.body.scrollTop > 25 || document.documentElement.scrollTop > 25) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
}
function jumpToPos(length) {
    document.body.scrollTop = length;
    document.documentElement.scrollTop = length;
}
// Show date to select for getting specific data
var dateSelect = []
function showDateToSelect(city_info_forecast) {
    const selectDate = document.getElementById("selectDate");
    let options = "";
    try {
        dateSelect = [];
        for (let index = 0; index < city_info_forecast.cnt; index++) {
            options += "<option value=`" + city_info_forecast.list[index].dt_txt + "`>" + city_info_forecast.list[index].dt_txt + "</option>";
            dateSelect.push(city_info_forecast.list[index].dt_txt);
        }
        selectDate.innerHTML = "";
        selectDate.innerHTML = options;
    } catch (e) {
        selectDate.innerHTML = "<option value=" + null + ">" + "Chưa có dữ liệu" + "</option>";
    }
}
// Handle selected date
var updateAuto = this.setInterval(() => {
    document.getElementById("update").click();
}, 20000); //auto fect api after 20sec
let selectDate = document.getElementById("selectDate");

selectDate.addEventListener("change", () => {
    // Show all data again
    showAllTemperatures(city_info_forecast); //helper.js
    showAllHumidities(city_info_forecast);   //helper.js
    showAllWinds(city_info_forecast);    //helper.js
    const time = selectDate.options[selectDate.selectedIndex].text;
    let allTimes = document.querySelectorAll(".duration .col.time"); //get column which has time inside
    for (let timeit of allTimes) {    //loop over every single time in list if it different to sellect one then remove it
        if (timeit.innerText !== time) {
            timeit.parentElement.remove();
        }
    }
    //jump to bottom of screen to show date selected and chart
    jumpToPos(window.screen.height);
    //trigger tooltip at selected point of time
    triggerTooltip(dateSelect.indexOf(time));
    //reset 20sec
    this.clearInterval(updateAuto);
    updateAuto = this.setInterval(() => {
        document.getElementById("update").click();
    }, 20000); //auto fect api after 20sec
})
// Update time counter
let dateElement = document.getElementById("date");
function counter() {
    var date = new Date(Date.now());
    dateElement.innerText = date.toLocaleDateString() + "\t" + date.toLocaleTimeString();
    delete date;
}
this.setInterval(counter, 1000);

// Render temperatures of all dates
var descriptionDict = {
    'scattered clouds': 'Mây rải rác',
    'overcast clouds': 'Trời u ám',
    'light rain': 'Mưa nhẹ',
    'light snow': 'Tuyết nhẹ',
    'snow': 'Có tuyết',
    'broken clouds': 'Nhiều mây',
    'clear sky': 'Không có mây',
    'moderate rain': 'Mưa vừa',
    'moderate snow': 'Tuyết vừa',
    'few clouds': 'Ít mây',
};
function showAllTemperatures(city_info_forecast) {
    let allRow = "";
    for (let index = 0; index < city_info_forecast.cnt; index++) {
        allRow += `<div class="row m-2 align-items-center duration shadow-sm rounded">
                    <div class="col">
                        <div class="row align-items-center">
                            <div class="col-sm-12 col-md">
                                <img style="width: 50px; height: 50px;" src="` + "http://openweathermap.org/img/wn/" + city_info_forecast.list[index].weather[0].icon + ".png" + `" alt="">
                            </div>
                            <div class="col-sm-12 col-md">
                                <small>`+ descriptionDict[city_info_forecast.list[index].weather[0].description] + `</small>
                            </div>
                        </div>                        
                    </div>
                    <div class="col time text-center">`+ city_info_forecast.list[index].dt_txt + `</div>
                    <div class="col text-right"><h4 class="temperature" style="font-family: mywebdigitalfont; font-weight: bold;">`+ city_info_forecast.list[index].main.temp_min.toFixed(1) + ' - ' + city_info_forecast.list[index].main.temp_max.toFixed(1) + "&#176;C" + `</h4></div>
                </div>`;
    }
    document.querySelector(".allTemperatures").innerHTML = allRow;
    document.getElementById("message-temp").innerText = "DỰ BÁO NHIỆT ĐỘ: " + city_name.toUpperCase();
}
// Render humidity of all dates
function showAllHumidities(city_info_forecast) {
    let allRow = "";
    for (let index = 0; index < city_info_forecast.cnt; index++) {
        allRow += `<div class="row m-2 align-items-center duration shadow-sm rounded">
                    <div class="col"><img style="width: 50px; height: 50px;" src="./icon/humidity.svg" alt=""></div>
                    <div class="col time text-center">`+ city_info_forecast.list[index].dt_txt + `</div>
                    <div class="col text-right"><h4 class="humidity" style="font-family: mywebdigitalfont; font-weight: bold;">`+ city_info_forecast.list[index].main.humidity + "&#37;" + `</h4></div>
                </div>`;
    }
    document.querySelector(".allHumidities").innerHTML = allRow;
    document.getElementById("message-humidity").innerText = "DỰ BÁO ĐỘ ẨM: " + city_name.toUpperCase();
}
// Render winds of all dates
function toTextualDescription(degree) {
    if (degree > 337.5) return 'Bắc';
    if (degree > 292.5) return 'Tây Bắc';
    if (degree > 247.5) return 'Tây';
    if (degree > 202.5) return 'Tây Nam';
    if (degree > 157.5) return 'Nam';
    if (degree > 122.5) return 'Dông Nam';
    if (degree > 67.5) return 'Đông';
    if (degree > 22.5) { return 'Đông Bắc'; }
    return 'Bắc';
}
function showAllWinds(city_info_forecast) {
    let allRow = "";
    for (let index = 0; index < city_info_forecast.cnt; index++) {
        allRow += `<div class="row m-2 align-items-center duration shadow-sm rounded">
                    <div class="col">
                        <div class="col-sm-12 col-md">
                            <img style="width: 24px; height: 24px; transform: rotate(`+ city_info_forecast.list[index].wind.deg + `deg);" src="./icon/ic-wind-05-s-48-px.svg" alt="">
                        </div>
                        <div class="col-sm-12 col-md">
                            <small>`+ toTextualDescription(city_info_forecast.list[index].wind.deg) + `</small>
                        </div>
                    </div>
                    <div class="col time text-center">`+ city_info_forecast.list[index].dt_txt + `</div>
                    <div class="col text-right"><h4 class="wind" style="font-family: mywebdigitalfont; font-weight: bold;">`+ city_info_forecast.list[index].wind.speed + " m/s " + `</h4></div>
                </div>`;
    }
    document.querySelector(".allWinds").innerHTML = allRow;
    document.getElementById("message-wind").innerText = "DỰ BÁO TỐC ĐỘ GIÓ: " + city_name.toUpperCase();
}
// Render temperature
function showTemperature(city_info_current) {
    document.querySelector(".current-temp-number").innerHTML = city_info_current.main.temp + "&#176;C";
}
function showHumidity(city_info_current) {
    document.querySelector(".current-humidity-number").innerHTML = city_info_current.main.humidity + "&#37;";
}
function showWind(city_info_current) {
    document.querySelector(".current-wind-number").innerHTML = city_info_current.wind.speed + " m/s " + `<img style="width: 24px; height: 24px; transform: rotate(` + city_info_current.wind.deg + `deg);" src="./icon/ic-wind-05-s-48-px.svg" alt="">`;
    document.querySelector(".current-wind-description").innerHTML = '<small style="font-size: 15px;">' + toTextualDescription(city_info_current.wind.deg) + '</small>';
}
function showRain(city_info_current) {
    let icon = "http://openweathermap.org/img/wn/" + city_info_current.weather[0].icon + ".png";
    document.querySelector(".current-rain > img").setAttribute('src', icon);
    document.querySelector(".current-rain-status").innerHTML = descriptionDict[city_info_current.weather[0].description];
}
//show chart
var tempChart = document.getElementById("tempChart").getContext("2d");
let temperatureChart = new Chart(tempChart, {
    type: "line",
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    display: false
                }
            }]
        }
    }
})
function showTemperatureChart(city_info_forecast) {
    let dates = [];
    let temps = [];
    for (let index = 0; index < city_info_forecast.cnt; index++) {
        dates.push(city_info_forecast.list[index].dt_txt);
        temps.push(city_info_forecast.list[index].main.temp);
    }
    temperatureChart.data = {
        labels: dates,
        datasets: [{
            label: 'Nhiệt độ(Celcius)',
            borderColor: 'rgb(255, 156, 25)',
            backgroundColor: 'rgb(252, 229, 197)',
            data: temps
        }]
    }
    temperatureChart.update();
}



var humidityChart = document.getElementById("humidityChart").getContext("2d");
let humidChart = new Chart(humidityChart, {
    type: "bar",
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    display: false
                }
            }]
        }
    }
})
function showHumidityChart(city_info_forecast) {
    let dates = [];
    let humids = [];
    for (let index = 0; index < city_info_forecast.cnt; index++) {
        dates.push(city_info_forecast.list[index].dt_txt);
        humids.push(city_info_forecast.list[index].main.humidity);
    }
    humidChart.data = {
        labels: dates,
        datasets: [{
            label: 'Độ ẩm(%)',
            backgroundColor: 'rgb(32, 209, 245)',
            borderColor: 'rgb(32, 209, 245)',
            data: humids
        }]
    }
    humidChart.update();
}



var windChart = document.getElementById("windChart").getContext("2d");
let windVelocityChart = new Chart(windChart, {
    type: "line",
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    display: false
                }
            }]
        }
    }
})
function showWindChart(city_info_forecast) {
    let dates = [];
    let winds = [];
    for (let index = 0; index < city_info_forecast.cnt; index++) {
        dates.push(city_info_forecast.list[index].dt_txt);
        winds.push(city_info_forecast.list[index].wind.speed);
    }
    windVelocityChart.data = {
        labels: dates,
        datasets: [{
            label: 'Tốc độ gió(km/h)',
            fill: false,
            borderColor: 'rgb(94, 19, 156)',
            data: winds
        }]
    }
    windVelocityChart.update();
}

//trigger tooltips
function triggerTooltip(index) {
    var meta_temperature = temperatureChart.getDatasetMeta(0),
        meta_humid = humidChart.getDatasetMeta(0),
        meta_wind = windVelocityChart.getDatasetMeta(0),

        temperature = temperatureChart.canvas.getBoundingClientRect(),
        humid = humidChart.canvas.getBoundingClientRect(),
        wind = windVelocityChart.canvas.getBoundingClientRect(),

        point_temperature = meta_temperature.data[index].getCenterPoint(),
        point_humid = meta_humid.data[index].getCenterPoint(),
        point_wind = meta_wind.data[index].getCenterPoint();

    var evtOntemperatureChart = new MouseEvent('mousemove', {
        clientX: temperature.left + point_temperature.x,
        clientY: temperature.top + point_temperature.y
    });

    var evtOnhumidChart = new MouseEvent('mousemove', {
        clientX: humid.left + point_humid.x,
        clientY: humid.top + point_humid.y
    });

    var evtOnwindChart = new MouseEvent('mousemove', {
        clientX: wind.left + point_wind.x,
        clientY: wind.top + point_wind.y
    });

    temperatureChart.canvas.dispatchEvent(evtOntemperatureChart);
    humidChart.canvas.dispatchEvent(evtOnhumidChart);
    windVelocityChart.canvas.dispatchEvent(evtOnwindChart);
}