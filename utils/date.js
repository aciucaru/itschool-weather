function getDayOfTheWeek(utc)
{
    // Pentru a crea o data, pornind la o valoare unix utc, este nevoie sa o inmultim cu 1000 mai intai.
    const date = new Date(utc * 1000);
    // Extragem ziua saptamanii, sub forma de index.
    const dayIndex = date.getDay();
    let day;
  
    switch (dayIndex) {
      case 0:
        day = "Duminică";
        break;
      case 1:
        day = "Luni";
        break;
      case 2:
        day = "Marți";
        break;
      case 3:
        day = "Miercuri";
        break;
      case 4:
        day = "Joi";
        break;
      case 5:
        day = "Vineri";
        break;
      case 6:
        day = "Sâmbătă";
        break;
      default:
        // Aruncam o eroare daca index-ul nu este valid (nu ar trebui sa se ajunga vreodata aici).
        throw new Error("Indexul trebuie sa fie intre 0 si 6.");
    }
  
    // Retunam ziua echivalenta indexului.
    return day;
}
  
function getHour(utc)
{
    // Pentru a crea o data, pornind la o valoare unix utc, este nevoie sa o inmultim cu 1000 mai intai.
    const date = new Date(utc * 1000);
    // Extragem ora. Daca ora are o valoare mai mica de 10, ii adaugam un 0.
    let hours = date.getHours();
    if (hours < 10) {
        hours = "0" + hours;
    }
    // Extragem minutele. Daca minutele au o valoare mai mica de 10, le adaugam un 0.
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    // Returnam ora, sub formatul dorit.
    return `${hours}:${minutes}`;
}

/* Functie auxiliara ce genereaza o secventa de 5 zile consecutive, incepand da la ziua pasata ca argument */
function get5DaySequenceStartingAt(dayName)
{
    let daySequence = [];

    switch(dayName)
    {
        case "Duminică":
            daySequence = ["Duminică", "Luni", "Marți", "Miercuri", "Joi"];
            break;
        
        case "Luni":
            daySequence = ["Luni", "Marți", "Miercuri", "Joi", "Vineri"];
            break;

        case "Marți":
            daySequence = ["Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
            break;

        case "Miercuri":
            daySequence = ["Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];
            break;

        case "Joi":
            daySequence = ["Joi", "Vineri", "Sâmbătă", "Duminică", "Luni"];
            break;

        case "Vineri":
            daySequence = ["Vineri", "Sâmbătă", "Duminică", "Luni", "Marți"];
            break;

        case "Sâmbătă":
            daySequence = ["Sâmbătă", "Duminică", "Luni", "Marți", "Miercuri"];
            break;
    }

    return daySequence;
}

