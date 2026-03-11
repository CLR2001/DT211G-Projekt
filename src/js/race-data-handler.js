async function writeRaceGrid(dataArray) {
  const raceSection = document.querySelector('.race-section')
  raceSection.innerHTML = "";
  /* ------------------------- Loops thorugh all races ------------------------ */
  let loopCounter = 1;
  dataArray.forEach(race => {
    const container = document.createElement('section');
    const contentHeader = document.createElement('div');
    const contentBody = document.createElement('div');

    container.classList.add('race-container');
    const containerClass = race.raceName.toLowerCase().replaceAll(" ", "-").replaceAll("grand-prix", "gp");
    container.classList.add(containerClass);
    contentHeader.classList.add('race-header');
    contentBody.classList.add('race-body');

    /* ------------------------- Creates p-tag for round ------------------------ */
    const round = document.createElement('p');
    round.innerHTML = 'Round ' + race.round;
    contentHeader.append(round);

    /* --------------------- Creates h2-tag for country name -------------------- */
    const countryName = document.createElement('h2');
    const country = race.Circuit.Location.country;
    if (country === 'USA' || country === 'UAE' || country === 'Spain' && race.Circuit.Location.locality === 'Barcelona') {
      countryName.innerHTML = race.raceName.replaceAll(' Grand Prix',"");
    }
    else {
      countryName.innerHTML = race.Circuit.Location.country;
    }

    /* ------------------ Creates img-tag for country flag ------------------ */
    const raceCountry = race.Circuit.Location.country;
    let raceCountryImage = document.createElement('img');
    raceCountryImage.src = `/src/assets/images/flags/${raceCountry.toLowerCase().replaceAll(" ", "-")}-flag.svg`;
    raceCountryImage.alt = `Flag of ${raceCountry}`;

    const countryContainer = document.createElement('div');
    countryContainer.append(countryName, raceCountryImage);
    countryContainer.classList.add('country-name');
    contentHeader.append(countryContainer);
    
    /* --------------------- Creates p-tag for circuit name --------------------- */
    const circuitName = document.createElement('p');
    circuitName.innerHTML = race.Circuit.circuitName;
    contentHeader.append(circuitName);

    /* ----------------------- Creates p-tag for date ----------------------- */
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let raceDate = document.createElement('p');
    const raceStartDate = race.FirstPractice.date.slice(-2);
    const raceEndDate = race.date.slice(-2);
    const raceStartMonth = Number(race.FirstPractice.date.slice(5, 7))
    const raceEndMonth = Number(race.date.slice(5, 7));

    if (raceStartMonth != raceEndMonth) {
      raceDate.innerHTML = `${raceStartDate} ${months[raceStartMonth - 1]} - ${raceEndDate} ${months[raceEndMonth - 1]}`
      contentHeader.append(raceDate);
    }
    else {
      raceDate.innerHTML = `${raceStartDate} - ${raceEndDate} ${months[raceEndMonth - 1]}`
      contentHeader.append(raceDate);
    }

    /* ------------------------------- Creates map ------------------------------ */
    const mapContainer = document.createElement('div');
    mapContainer.id = `map-${loopCounter}`;
    mapContainer.classList.add('race-map');
    contentBody.append(mapContainer);

    /* --------------- Creates link to google maps for directions --------------- */
    const directionsButton = document.createElement('a');
    directionsButton.classList.add('directions-button');
    directionsButton.innerHTML = 'Få vägbeskrivning';
    const lat = race.Circuit.Location.lat;
    const lon = race.Circuit.Location.long;
    directionsButton.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    directionsButton.target = '_blank'
    contentBody.append(directionsButton);
    
    





    container.append(contentHeader, contentBody);
    raceSection.append(container);
    createRaceBodyContent(race, loopCounter);
    loopCounter++;
  });
}

/* -------------- Function to fetch Formula 1 data from an API -------------- */
async function fetchRaceData() {
  try {
    const response = await fetch('https://api.jolpi.ca/ergast/f1/?limit=28&offset=1148');
    const data = await response.json();
    const races = data.MRData.RaceTable.Races.filter(race => race.season === '2026').sort((a, b) => Number(a.round) - Number(b.round));
    return races;
  }
  catch (error) {
    console.error("Error: ", error);
  }
  finally {
    console.log('Races fetched successfully');
  }
}

/* ------------------ Function to create race-content-body ------------------ */
function createRaceBodyContent(race, id) {
  const lat = parseFloat(race.Circuit.Location.lat);
  const lon = parseFloat(race.Circuit.Location.long);
  var map = L.map(`map-${id}`).setView([lat, lon], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(`<b>${race.Circuit.circuitName}</b>`);
}

/* -------------- Function to filter races with a search input -------------- */
function searchData(dataArray) {
  const input = document.querySelector("#search-input").value;
  const data = dataArray.filter(race => 
    race.Circuit.Location.country.toLowerCase().includes(input.toLowerCase()) ||
    race.raceName.toLowerCase().includes(input.toLowerCase()) || 
    race.Circuit.circuitName.toLowerCase().includes(input.toLowerCase())
  );
  const filteredRaceData = [...data];
  writeRaceGrid(filteredRaceData);
}

/* ----------------------------- Exports module ----------------------------- */
export async function initRaceData() {
  const raceData = await fetchRaceData();
  writeRaceGrid(raceData);
  const searchInput = document.querySelector("#search-input");
  console.log(searchInput);
  
  searchInput.addEventListener('input', () => {
    searchData(raceData);
  });
}

