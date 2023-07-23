const API_KEY = '****';

function getCurrentWeatherEndpoint(cityName)
{
    return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&lang=RO&units=metric`;
}

function getForecastEndpoint(cityName)
{
    return `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&lang=RO&units=metric`;
}

