/* Functie ce ia datele meteo de pe 'openweathermap.org', date meteo ce reprezinta prognoza pe 5 zile pt.
    un anume oras.
    Deoarece aceasta functie doar ia datele de pe server, ea terbuie sa ele returneze cumva.
    Functia nu returneaza datele direct, ci returneaza o promisiune ('Promise') care promite sa ia datele meteo
    si sa le returneze candva.
    Pentru a accesa datele meteo atunci cand le va lua promisiunea, se foloseste methoda 'then()' ce se aplica
    promisiunii, iar din interiorul metodei 'then()' se pot accesa datele promise de promisiune.
    
    Deoarece datele meteo luate de pe server sunt mult mai complexe decat ce se foloseste efectiv, se aplica o
    conversie (mapping) cu ajutorul metodei 'map()', care converteste fiecare element al sirului de prognoze orare
    in cate un element mult simplificat. */
function getWeatherForecast(cityName)
{
    const apiUrl = getForecastEndpoint(cityName);
    let promise = 
        fetch(apiUrl)
            .then(response => response.json())
            .then(data =>
                    {
                        const simpifiedDataArray =
                            data.list
                                // se aplica map() pt. a converti elementele sirului 'list' in obiecte mult mai simple
                                .map((hourlyForecast) => 
                                        {
                                            const weatherDescription = hourlyForecast.weather[0].description;
                                            const weatherIconURL = getWeatherIcon(hourlyForecast.weather[0].icon);
            
                                            const temperature = Math.round(hourlyForecast.main.temp);
                                            const humidity = Math.round(hourlyForecast.main.humidity);
            
                                            const day = getDayOfTheWeek(hourlyForecast.dt);

                                            const date = new Date(hourlyForecast.dt * 1000);
                                            let hour = date.getHours();
            
                                            const windSpeed = windToKmPerHour(hourlyForecast.wind.speed);

                                            // aceste date sunt singurele ce raman pt. fiecare element in parte
                                            return {
                                                weatherDescription: weatherDescription,
                                                weatherIconURL: weatherIconURL,
                                                temperature: temperature,
                                                humidity: humidity,
                                                day: day,
                                                hour: hour,
                                                windSpeed: windSpeed,
                                            }
                                        }
                                    );

                        return simpifiedDataArray;
                    }
                );
    return promise;
}

/* Functie auxiliara ce determina si returneaza toate intervalele orare pt. o anumita zi.
    Acesta functie returneaza prognezele grupate in 4 intervale orare.
    Functia primeste ca argumente:
    - 'allDaysForecastArray': sirul de prognoze orare specific unei singure zile (deci un sir filtrat)
    - 'dayName': numele zilei, folosit pt. a filtra doar prognozele specifice acelei zile */
function getOneDayForecastIntervals(allDaysForecastArray, dayName)
{
    // prima data se filtreaza sirul de prognoze primit ca argument, astfel incat sa aiba prognozele pe
    // o singura zi (adica ziua primita ca argument 'dayName')
    const oneDayForecastArray = allDaysForecastArray.filter(hourlyForecast =>
                                                    hourlyForecast.day === dayName
                                                );

    // primul interval (00:00 ... 06:00)
    const nightInterval = oneDayForecastArray.find(hourlyForecast =>
                0 <= hourlyForecast.hour && hourlyForecast.hour < 6
            );

    // al doilea interval (06:00 ... 12:00)
    const morningInterval = oneDayForecastArray.find(hourlyForecast =>
                6 <= hourlyForecast.hour && hourlyForecast.hour < 12
            );

    // al treilea interval (12:00 ... 18:00)
    const afternoonInterval = oneDayForecastArray.find(hourlyForecast =>
                12 <= hourlyForecast.hour && hourlyForecast.hour < 18
            );

    // al patrulea interval (18:00 ... 21:00)
    const eveningInterval = oneDayForecastArray.find(hourlyForecast =>
            18 <= hourlyForecast.hour && hourlyForecast.hour <= 21
        );

    // dupa ce au fost obtinute prognozele orare filtrate pe intervale de ore, se creeaza un obiect final
    // ce contine numele zilei si intervalele orare cu prognoze
    return {
        dayName: dayName,
        nightForecast: nightInterval, // intervalul de noapte
        morningForecast: morningInterval, // intervalul de dimineata
        afternoonForecast: afternoonInterval, // intervalul de dupa amiaza
        eveningForecast: eveningInterval // intervalul de seara
    };
}

/* Functie ce deseneaza/afiseaza prognoza dintr-un singur interval orar (de ex. seara) pentru o singura zi.
    Aceasta functie primeste ca argumente:
    - 'intervalForecast': prognoza pt. acel interval orar
    - 'intervalContainer': un container HTML in elementele caruia sa aplice valorile din prognoza */
function displayOneIntervalWeatherForecast(intervalForecast, intervalContainerElem)
{
    /* Server-ul meteo returneaza prognoza orara incepand mereu de la ora curenta, deci este posibil ca
        prognozele pt. anumite ore (si intervale orare) sa nu existe, adica sa fie 'undefined'.
        De aceea se verifica la inceput daca acea prognoza chiar exista */
    if(intervalForecast !== undefined)
    {
        // element HTML ce afiseaza imaginea specifica prognozei meteo
        const imageElem = intervalContainerElem.querySelector(".id-weather-forecast-icon");
        imageElem.src = intervalForecast.weatherIconURL;

        // element HTML ce afiseaza descrierea prognozei meteo
        const descriptionElem = intervalContainerElem.querySelector(".id-weather-forecast-description");
        descriptionElem.textContent = intervalForecast.weatherDescription;
    }
    else
    {
        // element HTML ce afiseaza imaginea specifica prognozei meteo
        const imageElem = intervalContainerElem.querySelector(".id-weather-forecast-icon");
        imageElem.src = './images/no-forecast.png';

        // element HTML ce afiseaza descrierea prognozei meteo
        const descriptionElem = intervalContainerElem.querySelector(".id-weather-forecast-description");
        descriptionElem.textContent = "nu exista prognoza";
    }
}

/* Functie ce deseneaza/afiseaza prognoza meteo pt. o singura zi, dar pt. toate intervalele orare ale acelei zi
    (adica noapte, dimineata, dupa amiaza, seara).
    Functia primeste ca argumente:
    - 'oneDayForecast': intreaga prognoza pt. acea zi (pt. toate cele 4 intervale orare)
    - 'dayContainerElem': un container (element) HTML care contine containere pt. fiecare din cele 4 intervale orare */
function displayOneDayWeatherForecast(oneDayForecast, dayName, dayContainerElem)
{
    // element HTML ce afiseaza imaginea specifica prognozei meteo
    const dayNameElem = dayContainerElem.querySelector(".id-weather-forecast-param-day-name");
    dayNameElem.textContent = dayName;

    const nightIntervalContainer = dayContainerElem.querySelector(".id-weather-forecast-interval.id-night-interval");
    displayOneIntervalWeatherForecast(oneDayForecast.nightForecast, nightIntervalContainer);

    const morningIntervalContainer = dayContainerElem.querySelector(".id-weather-forecast-interval.id-morning-interval");
    displayOneIntervalWeatherForecast(oneDayForecast.morningForecast, morningIntervalContainer);

    const afternoonIntervalContainer = dayContainerElem.querySelector(".id-weather-forecast-interval.id-afternoon-interval");
    displayOneIntervalWeatherForecast(oneDayForecast.afternoonForecast, afternoonIntervalContainer);

    const eveningIntervalContainer = dayContainerElem.querySelector(".id-weather-forecast-interval.id-evening-interval");
    displayOneIntervalWeatherForecast(oneDayForecast.eveningForecast, eveningIntervalContainer);
}

/* Functie ce deseneaza/afiseaza prognoza meteo pt. orasul curent. Se afiseaza prognoza meteo pt. toate cele 5 zile
    si pt. toate intervalele orare ale fiecarei zi (noapte, dimineata, dupa amiaza, seara).
    Ca sa poata afisa prognozele meteo, aceasta functie ia datele meteo de pe server cu ajutorul functiei
    'getWeatherForecast()' ce returneaza o promisiune ('Promise'), nu datele meteo direct. */
function displayWeatherForecast(cityName)
{
    const allDaysContainer = document.getElementById("all-days-weather-forecast-container");
    const dayContainerArray = allDaysContainer.querySelectorAll(".one-day-weather-forecast-container");

    getWeatherForecast(cityName)
        .then( hourlyForecastArray =>
                {
                    const cityStartIndex = parseInt(localStorage.getItem("cityStartIndex"));
                    const selectedCityIndexOffset = parseInt(localStorage.getItem("selectedCityIndexOffset"));
                    
                    // se determina prima zi din sirul de prognoze orare
                    const firstDay = hourlyForecastArray[0].day;
                    // console.log(`firstDay: ${firstDay}`);

                    // se determina succesiunea de 5 zile ce incepe cu prima zi determinata anterior
                    const daySequence = get5DaySequenceStartingAt(firstDay);
                    // console.log(daySequence);

                    // sir final cu toate prognozele grupate pe zi, iar apoi grupate pe intervale orare
                    let dayGroupedForecastArray = [];

                    // pentru fiecare zi din succesiune, se determina un sir cu prognozele grupate
                    // pe intervale orare (00:00-06:00, 06:00-12:00, etc.) si se adauga la sirul final
                    let currentDayForecast;
                    for(const dayName of daySequence)
                    {
                        // se ia prognoza pt. ziua curenta din iteratie
                        currentDayForecast = getOneDayForecastIntervals(hourlyForecastArray, dayName);

                        // se adauga prognaza la sirul de prognoze grupate pe zi
                        dayGroupedForecastArray.push(currentDayForecast);
                    }

                    console.log(`dayGroupedForecastArray lenght: ${dayGroupedForecastArray.length}`);
                    console.table(dayGroupedForecastArray);

                    console.log(`dayContainerArray lenght: ${dayContainerArray.length}`);
                    console.table(dayContainerArray);

                    for(let i=0; i<dayGroupedForecastArray.length; i++)
                    {
                        if(i < dayContainerArray.length)
                        {
                            displayOneDayWeatherForecast(dayGroupedForecastArray[i], daySequence[i], dayContainerArray[i]);
                        }
                    }
                }
            );
}