/* Functie ce ia datele pt. prognoza pe ziua curenta, pentru un singur oras.
    Luarea datelor meteo de pe server s-ar fi putut face si direct in functia 'displayCurrentWeather()'
    care ar trebuiu sa deseneze (afiseze) prognoza pt. un singur oras, dar este mai corect sa se separe
    cele 2 functii: o functie ia datele de pe server si alta le afiseaza.

    Deoarece functia 'getCurrentWeather()' doar ia datele de pe server, atunci ea trebuie sa returneze cumva
    datele. Dar deoarece nu se stie cat timp va dura ca aceasta functie sa ia datele meteo pt. un oras,
    aceasta functie nu returneaza datele meteo in sine, ci returneaza un 'Promise', care la randul
    sau promite ca va returna datele meteo cand finalizeaza.
    Pentru a accesa datele meteo pe care promite Promise-ul sa le returneze candva, trebuie apelata
    methoda 'then()' asupra acelui 'Promise' returnat de aceasta functie (getCurrentWeather). */
function getCurrentWeather(cityName)
{
    const apiUrl = getCurrentWeatherEndpoint(cityName);
    let promise = fetch(apiUrl)
                    .then(response => response.json())
                    .then(data =>
                            {
                                const weatherMainDescription = data.weather[0].main;
                                const weatherDescription = data.weather[0].description;
                                const weatherIconURL = getWeatherIcon(data.weather[0].icon);

                                const temperature = Math.round(data.main.temp);
                                const humidity = Math.round(data.main.humidity);

                                const day = getDayOfTheWeek(data.dt);
                                const hour = getHour(data.dt);

                                const windSpeed = windToKmPerHour(data.wind.speed);

                                const cityName = data.name;

                                // se returneaza un opiect ce contine doar datele necesare, nu toate datele meteo
                                // luate de pe server
                                return {
                                    weatherMainDescription: weatherMainDescription,
                                    weatherDescription: weatherDescription,
                                    weatherIconURL: weatherIconURL,
                                    temperature: temperature,
                                    humidity: humidity,
                                    day: day,
                                    hour: hour,
                                    windSpeed: windSpeed,
                                    cityName: cityName
                                };
                            }
                        );
    // nu se returneaza datele in sine, ci un 'Promise' care promite sa returneze acele data meteo, cand va finaliza
    return promise;
}

/* Functie ce afiseaza prognoza meteo pt. un singur oras. Functia ia datele meteo de pe 'openweathermap.org'
    si le afiseaza in elementele HTML ale unui container HTML pe care trebuie sa il primeasca ca argument.
    Pe baza acelui container HTML primit ca argument (un div), functia ia elmentele HTML interne ale
    container-ului (pe baza claselor) si modifica continutul acelor elemente HTML interne. */
function displayCurrentWeather(cityName, cityContainerElem)
{
    /* getCurrentWeather() nu returneaza datele meteo direct, ci returneaza o promisiune care promite sa
        ia si sa returneze aceste date meteo.
        Astfel ca, pt. a accesa datele meteo date de promisiune, se aplica functia 'then()' promisiunii, iar
        in interiorul functiei 'then()' se pot accesa datele pe care le va lua promisiunea candva in viitor,
        in acest caz concret se acceseaza variabila 'returnedData' (numele este arbitrar, poate avea orice nume). */
    getCurrentWeather(cityName)
        .then( returnedData =>
                {
                    // aici se pot accesa datele "promise" de promisiune (adica 'returnedData')

                    // element HTML ce afiseaza numele orasului
                    const nameElem = cityContainerElem.querySelector(".id-current-weather-city-name");
                    nameElem.textContent = returnedData.cityName; // se schimba continutul

                    // element HTML ce afiseaza imaginea specifica prognozei meteo
                    const imageElem = cityContainerElem.querySelector(".id-current-weather-icon");
                    imageElem.src = returnedData.weatherIconURL; // se schimba continutul

                    // element HTML ce afiseaza descrierea prognozei meteo
                    const descriptionElem = cityContainerElem.querySelector(".id-current-weather-description");
                    descriptionElem.textContent = returnedData.weatherDescription; // se schimba continutul

                    // element HTML ce afiseaza temperatura
                    const temperatureElem = cityContainerElem.querySelector(".id-current-weather-temperature");
                    temperatureElem.textContent = `${returnedData.temperature} C`; // se schimba continutul

                    // element HTML ce afiseaza umiditatea
                    const humidityElem = cityContainerElem.querySelector(".id-current-weather-humidity");
                    humidityElem.textContent = `${returnedData.humidity} %`; // se schimba continutul

                    // element HTML ce afiseaza viteza vantului
                    const windSpeedElem = cityContainerElem.querySelector(".id-current-weather-windspeed");
                    windSpeedElem.textContent = `${returnedData.windSpeed} km/h`; // se schimba continutul
                }
            );
}

/* Functie care afiseaza prognoza meteo (pt. ziua curenta) pt. toate orasele din sirul de orase.
    Functia itereaza prin sirul de orase si afiseaza prognoza pentru doar 5 orase consecutive din tot sirul. */
function displayAllCitiesCurrentWeather(cityArray, cityStartIndex)
{
    // se ia containerul principal, ce contine containerele pt. orase
    const allCitiesContainer = document.getElementById("all-cities-current-weather-container");

    // se iau toate containerele ce afiseaza date meteo pt. cate un oras
    const cityContainerArray = allCitiesContainer.querySelectorAll(".id-city-current-weather-container");

    // pentru fiecare container HTML ce afiseaza un oras
    for(let i=0; i<cityContainerArray.length; i++)
    {
        /* sirul de containere HTML si sirul de orase nu au neaparat acelasi numar de elemente,
            deci exista riscul ca sa se depaseasca oricare dintre cele doua siruri,
            asa ca se verifica sa nu se depaseasca nici sirul de orase si apoi se face redesenarea */
        if(i + cityStartIndex < cityArray.length)
            displayCurrentWeather(cityArray[i+cityStartIndex], cityContainerArray[i]); // se redeseneaza
        else
            break;
    }
}
