const cityName = document.getElementById('cityName');
const submitBTN = document.getElementById('submitBTN');
const city_name = document.getElementById('city_name');
const temp_value = document.getElementById('temp_value');
const temp_status = document.getElementById('temp_status');
const datahide = document.querySelector('.middle_layer');

const getInfo = async (event) => {
    event.preventDefault();
    let cityVal = cityName.value;
    if (cityVal === "") {
        city_name.innerText = `Please write the name before search`;
        datahide.classList.add('data_hide');
    } else {
        try {

            let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&units=metric&appid=55bf0f11fefb3d5a6e4394c109470092`
            const response = await fetch(url);
            const data = await response.json();
            const arrData = [data];

            city_name.innerText = `${arrData[0].name}, ${arrData[0].sys.country}`;
            temp_value.innerText = arrData[0].main.temp;
            const tempIcon = arrData[0].weather[0].main;

            // condition to check sunny or cloudy

            if (tempIcon == 'Clear') {
                temp_status.innerHTML = "<i class='fas fa-sun' style='color: #eccc68;'></i>";
            }
            else if (tempIcon == 'Clouds') {
                temp_status.innerHTML = "<i class='fas fa-cloud' style='color: #f1f2f6;'></i>";
            }
            else if (tempIcon == 'Rain') {
                temp_status.innerHTML = "<i class='fas fa-cloud-rain' style='color: #a4b0be;'></i>";
            }
            else {
                temp_status.innerHTML = "<i class='fas fa-sun' style='color: #eccc68;'></i>";
            }
            datahide.classList.remove('data_hide');

        } catch {
            city_name.innerText = `Please enter the city name properly`;
            datahide.classList.add('data_hide');
        }
    }

}



submitBTN.addEventListener('click', getInfo);