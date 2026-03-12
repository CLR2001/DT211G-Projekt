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

/* ----------------------- Function to create race-map ---------------------- */
function createRaceMap(race, id) {
  const lat = parseFloat(race.Circuit.Location.lat);
  const lon = parseFloat(race.Circuit.Location.long);
  var map = L.map(`${id}`).setView([lat, lon], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(`<b>${race.Circuit.circuitName}</b>`);

  // Updates map after animation to avoid errors
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}

/* -------------- Function to filter races with a search input -------------- */
function searchData(dataArray) {
  const input = document.querySelector("#search-input").value.toLowerCase();
  const raceContainers = document.querySelectorAll('.race-container');

  raceContainers.forEach((container, index) => {
    const race = dataArray[index];
    const searchables = `${race.Circuit.Location.country} ${race.raceName} ${race.Circuit.circuitName}`.toLowerCase()

    if (searchables.includes(input)) {
      container.style.display = "block";
    }
    else {
      container.style.display = "none";
    }
  });
}

function openRace(raceData) {
  const raceSection = document.querySelector('.race-section');
  raceSection.addEventListener('click', (event) => {
    const container = event.target.closest('.race-container');
    if (!container || container.id === 'clone') return;

    raceSection.querySelectorAll('.race-container').forEach(container => {
      container.dataset.open = "closed";
    })

    if (container.dataset.open === "closed") {
      container.dataset.open = "open";

      // Creates clone of race-container to allow animations
      const rect = container.getBoundingClientRect();
      const clone = container.cloneNode(true);
      clone.id = 'clone';
      
      clone.style.position = 'fixed';
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.zIndex = '1000';
      clone.style.transition = 'all 0.3s ease-in-out';
      clone.querySelector('.race-body').style.display = 'flex';
      raceSection.appendChild(clone);

      // Animates clone resizing
      const standardPadding = 'clamp(1.5rem, 5vw, 3rem)';
      const scrollbarWidth = getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-width');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          clone.style.top = '15vh';
          clone.style.left = standardPadding;
          clone.style.width = `calc(100vw - 2 * ${standardPadding} - ${scrollbarWidth})`;
          clone.style.height = '70vh';
          clone.style.backgroundColor = '	#16181a';
        });
      });

      // Finds coordinates for selected race and creates a map accordingly
      const round = container.querySelector('.race-header p').innerHTML.replace("Round ", ""); 
      const race = raceData.filter(race => race.round === round);
      const mapContainer = document.createElement('div');
      mapContainer.classList.add('race-map');
      mapContainer.id = 'map';
      clone.querySelector('.race-body').prepend(mapContainer);
      createRaceMap(race[0], mapContainer.id);
    }
  })
}

function closeModal() {
  const raceSection = document.querySelector('.race-section');
  const modal = document.querySelector('.modal');
  modal.addEventListener('click', () => {
    const openRace = document.querySelector('[data-open="open"]');
    openRace.dataset.open = "closed";
    raceSection.querySelector('#clone').remove();
  });
}


/* ----------------------------- Exports module ----------------------------- */
export async function initRaceData() {
  const raceData = await fetchRaceData();
  writeRaceGrid(raceData);
  const searchInput = document.querySelector("#search-input");  
  searchInput.addEventListener('input', () => {
    searchData(raceData);
  });
  openRace(raceData);
  closeModal();
}