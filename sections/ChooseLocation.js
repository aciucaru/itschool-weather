// cityIndexOffset => cityStartIndex


/* Sir cu orasele pentru care se vor face prognozele meteo.
    Acest sir va fi refolosit in functiile care iau datele de pe "openweathermap.org"
    dar si de catre functiile ce deseneaza prognoza meteo. */
const cityArray =
[
    "Bucharest",
    "Botosani",
    "Brasov",
    "Braila",
    "Craiova",

    "Cluj",
    "Oradea",
    "Pitesti",
    "Sibiu",
    "Timisoara",
];

/* Variabila stocata in 'localStorage' ce reprezinta deviatia fata de 0 (fata de primul element),
    de la care incepe sa se afiseze prognoza pe mai multe orase simultan ('current weather' pt. 5
    orase consecutive).
    Aceasta variabila se foloseste pt. functionalitatea 'Previous/Next', care permite sa se mearga inainte/inapoi
    cu cate un oras, in lista de orase.
    In mod normal, prognoza ar incepe de la orasul aflat la indexul 0, dar in realitate va incepe de la
    indexul 'cityStartIndex'.
    Acest index nu poate fi mai mare decat lungimea sirului de orase minus numarul de orase afisate
    simultan (5 orase).*/
if(localStorage.getItem("cityStartIndex") == null)
    localStorage.setItem("cityStartIndex", 0);

/* Variabila stocata in 'localStorage' ce reprezinta inca o deviatie fata de 0 (fata de primul element).
    Variabila se foloseste numai pt. prognoza pe 5 zile pt. un singur oras (cel selectat), adica pt. 'weather forecast'
    Prognoze se afiseaza pe 5 orase simultan, iar cand utilizatorul face click pe unul din cele 5 orase, aceasta
    variabila se schimba si functia care afiseaza prognoza detaliata pe 5 zile ('displayWeatherForecast(cityName)')
    este apelata din nou, pt. a redesena prognoza pe 5 zile.*/
if(localStorage.getItem("selectedCityIndexOffset") == null)
    localStorage.setItem("selectedCityIndexOffset", 0);

let cityStartIndex = parseInt(localStorage.getItem("cityStartIndex"));
let selectedCityIndexOffset = parseInt(localStorage.getItem("selectedCityIndexOffset"));

/* Butoane care permit selectarea unui oras anume din cele 5 afisate simultan, pentru a afisa prognoza
detaliza pe 5 zile numai pentru acel oras selectat.
Butoanele se iau "la gramada" dupa o clasa comuna si se pun intr-un sir. */
const cityForecastButtonArray = document.getElementsByClassName("id-city-forecast-button");

cityForecastButtonArray[0].classList.toggle("city-selector-button-selected", true);

// se seteaza textul fiecarui buton
for(let i=0; i<cityForecastButtonArray.length; i++)
{
    cityForecastButtonArray[i].textContent = cityArray[cityStartIndex + i];
}

/* Functie ce face tranzitia (animatia) intre imaginea orasului curent si imaginea orasului selectat.
    Aceasta functie poate face tranzitia intre imaginile de fundal a oricare doua orase din sirul de orase,
    orasele nu trebuie sa fie neaparat consecutive */
function setBackgroundTransition(cityStartIndex, currentSelectedCityIndexOffset, newSelectedCityIndexOffset)
{
    // const cityStartIndex = parseInt(localStorage.getItem("cityStartIndex"));
    // const selectedCityNewIndexOffset = parseInt(localStorage.getItem("selectedCityIndexOffset"));
    const currentCityIndex = cityStartIndex + currentSelectedCityIndexOffset;
    const nextCityIndex = cityStartIndex + newSelectedCityIndexOffset;

    const backgroundFrontElem = document.getElementById("background-img-front");
    const backgroundBackElem = document.getElementById("background-img-back");

    // daca sirul are suficiente orase fata de indexul orasului selectat deja (verificare de siguranta)
    if(0 <= currentCityIndex && currentCityIndex < cityArray.length &&
        0 <= nextCityIndex && nextCityIndex < cityArray.length )
    {
        // daca opacitatea este 1 (adica mai mare ca zero)
        if(backgroundFrontElem.style.opacity > 0)
        {
            backgroundFrontElem.className = "bg-image-" + cityArray[currentCityIndex];
            backgroundBackElem.className = "bg-image-" + cityArray[nextCityIndex];
            backgroundFrontElem.style.opacity = 0; // opacitatea lui 'front' va face o tranzitie catre 0
        }
        else
        {
            backgroundFrontElem.className = "bg-image-" + cityArray[nextCityIndex];
            backgroundBackElem.className = "bg-image-" + cityArray[currentCityIndex];
            backgroundFrontElem.style.opacity = 1; // opacitatea lui 'front' va face o tranzitie catre 1
        }
    }
    else
        console.log(`ERROR: currentIndex: ${currentCityIndex}, nextIndex: ${nextCityIndex}`);
}

function setSelectorCity(selectedCityNewIndexOffset)
{
    console.log("setSelectorCity");
    // const currentSelectedCityIndexOffset = parseInt(localStorage.getItem("selectedCityIndexOffset"));

    // if(selectedCityNewIndexOffset != currentSelectedCityIndexOffset)
    // {
        // se reseteaza clasele tuturor butoanelor
        cityForecastButtonArray[0].className = "id-city-forecast-button city-selector-button button-left";
        cityForecastButtonArray[1].className = "id-city-forecast-button city-selector-button button-middle";
        cityForecastButtonArray[2].className = "id-city-forecast-button city-selector-button button-middle";
        cityForecastButtonArray[3].className = "id-city-forecast-button city-selector-button button-middle";
        cityForecastButtonArray[4].className = "id-city-forecast-button city-selector-button button-right";

        // se modifica in mod corespunzator clasele ce apartin numai butonului apasat
        switch(selectedCityNewIndexOffset)
        {
            case 0:
                cityForecastButtonArray[selectedCityNewIndexOffset].className =
                    "id-city-forecast-button city-selector-button-selected button-left";
                break;

            case 1:
            case 2:
            case 3:
                cityForecastButtonArray[selectedCityNewIndexOffset].className =
                    "id-city-forecast-button city-selector-button-selected button-middle";
                break;

            case 4:
                cityForecastButtonArray[selectedCityNewIndexOffset].className =
                    "id-city-forecast-button city-selector-button-selected button-right";
            default:
                break;
        }
    // }
}

function selectCity(selectedCityNewIndexOffset)
{
    console.log("selectCity");
    const cityStartIndex = parseInt(localStorage.getItem("cityStartIndex"));
    const currentSelectedCityIndexOffset = parseInt(localStorage.getItem("selectedCityIndexOffset"));

    // console.log(`selectCity(): currentIndex: ${currentSelectedCityIndexOffset}, selectedIndex: ${selectedCityNewIndexOffset}`);

    setBackgroundTransition(cityStartIndex, currentSelectedCityIndexOffset, selectedCityNewIndexOffset);

    // se redeseneaza prognoza detaliata pe 5 zile
    displayWeatherForecast(cityArray[cityStartIndex + selectedCityNewIndexOffset]);
}

// se seteaza event listener-ul fiecarui buton
for(let i=0; i<cityForecastButtonArray.length; i++)
{
    // cityForecastButtonArray[i].textContent = cityArray[cityStartIndex + i];
    cityForecastButtonArray[i].addEventListener( "click", (event) =>
        { 
            setSelectorCity(i);
            selectCity(i);
            localStorage.setItem("selectedCityIndexOffset", i);
        }
    );
}

// buton care decrementeza cele 5 orase afisate simultan, cu un oras
const previousCityButton = document.getElementById("previous-city-button");
// buton care avanseaza cele 5 orase afisate simultan, cu un oras
const nextCityButton = document.getElementById("next-city-button");

previousCityButton.addEventListener(
    "click",
    (event) =>
    {
        // offset-ul pentru index-ul de la care incep cele 5 orase afisate simultan
        let cityStartIndex = parseInt(localStorage.getItem("cityStartIndex"));
        // offset-ul pentru orasul curent pt. care se afiseaza prognoza pe 5 zile
        const selectedCityIndexOffset = parseInt(localStorage.getItem("selectedCityIndexOffset"));

        // daca offset-ul este suficient de mare incat sa mai poate fi decrementat
        if(cityStartIndex >= 1)
        {
            cityStartIndex--; // atunci se decrementeza


            for(let i=0; i<cityForecastButtonArray.length; i++)
            {
                // se schimba textul fiecarui buton la noile orase, in succesiune
                cityForecastButtonArray[i].textContent = cityArray[cityStartIndex + i];
            }

            // setBackgroundToPreviousImage(cityStartIndex, selectedCityIndexOffset);
            setBackgroundTransition(cityStartIndex, selectedCityIndexOffset + 1, selectedCityIndexOffset);
            setSelectorCity(selectedCityIndexOffset);

            localStorage.setItem("cityStartIndex", cityStartIndex);

            // se redeseneaza prognoza simpla (pt. 5 orase consecutive)
            displayAllCitiesCurrentWeather(cityArray, cityStartIndex);
            // se redeseneaza si prognoza detaliata, pe 5 zile, pt. un orasul curent
            displayWeatherForecast(cityArray[cityStartIndex + selectedCityIndexOffset]);
        }
    }
);

nextCityButton.addEventListener(
    "click",
    (event) =>
    {
        // offset-ul pentru index-ul de la care incep cele 5 orase afisate simultan
        let cityStartIndex = parseInt(localStorage.getItem("cityStartIndex"));
        // offset-ul pentru orasul curent pt. care se afiseaza prognoza pe 5 zile
        const selectedCityIndexOffset = parseInt(localStorage.getItem("selectedCityIndexOffset"));

        // daca offset-ul este suficient de mic incat sa mai poate fi incrementat si incat
        // sa nu se depaseasca cele 5 containere HTML pt. afisarea simultana a oraselor
        if(cityStartIndex < cityArray.length - 5)
        {
            cityStartIndex++; // atunci se incrementeaza

            for(let i=0; i<cityForecastButtonArray.length; i++)
            {
                // se schimba textul fiecarui buton la noile orase, in succesiune
                cityForecastButtonArray[i].textContent = cityArray[cityStartIndex + i];
            }

            // setBackgroundToNextImage(cityStartIndex, selectedCityIndexOffset);
            setBackgroundTransition(cityStartIndex, selectedCityIndexOffset - 1, selectedCityIndexOffset);
            setSelectorCity(selectedCityIndexOffset);

            localStorage.setItem("cityStartIndex", cityStartIndex);

            // se redeseneaza prognoza simpla (pt. 5 orase consecutive)
            displayAllCitiesCurrentWeather(cityArray, cityStartIndex);
            // se redeseneaza si prognoza detaliata, pe 5 zile, pt. un orasul curent
            displayWeatherForecast(cityArray[cityStartIndex + selectedCityIndexOffset]);
        }
    }
);
