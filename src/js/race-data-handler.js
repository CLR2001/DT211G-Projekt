"use Strict";

/**
 * @file F1 Race Schedule & Circuit Map Handler
 * @module RaceDataModule
 * @description
 * This module manages the Formula 1 2026 race calendar. It handles data <br>
 * fetching from the Jolpica API, dynamic rendering of the race grid, and interactive features including: <br>
 * 1. Data Management: Fetches, filters, and sorts race schedules. <br>
 * 2. Interactive UI: Generates a responsive grid with expanded modal views. <br>
 * 3. Geospatial Integration: Visualizes circuit locations using Leaflet.js maps. <br>
 * 4. Accessibility & UX: Implements keyboard navigation and manages the 'inert' attribute for focus trapping.
 */

/**
 * Renders the race grid by creating and appending HTML elements for each race.
 * @param {Array<Object>} dataArray - An array of race objects from Jolpica API.
 * @returns {Promise<void>}
 */
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
    container.tabIndex = 0;
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
    raceCountryImage.src = `/flags/${raceCountry.toLowerCase().replaceAll(" ", "-")}-flag.svg`;
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

    /* ----------------------- Creates tags for race info ----------------------- */
    const raceInfo = document.createElement('div');
    raceInfo.classList.add('race-info');

    if (race.FirstPractice) {
      const fp = document.createElement('p');
      fp.innerHTML = `
        <h2>FP1:</h2> 
        <p><b>Time: </b>${race.FirstPractice.time.replace(":00Z", "")}</p>
        <p><b>Date: </b> 
          ${race.FirstPractice.date.slice(-2)} 
          ${months[Number(race.FirstPractice.date.slice(5, 7)) - 1]}
        </p>
        `
      raceInfo.append(fp);
    }
    if (race.SecondPractice) {
      const fp = document.createElement('p');
      fp.innerHTML = `
        <h2>FP2:</h2> 
        <p><b>Time: </b>${race.SecondPractice.time.replace(":00Z", "")}</p>
        <p><b>Date: </b> 
          ${race.SecondPractice.date.slice(-2)} 
          ${months[Number(race.SecondPractice.date.slice(5, 7)) - 1]}
        </p>
        `      
      raceInfo.append(fp);
    }
    if (race.ThirdPractice) {
      const fp = document.createElement('p');
      fp.innerHTML = `
        <h2>FP3:</h2> 
        <p><b>Time: </b>${race.ThirdPractice.time.replace(":00Z", "")}</p>
        <p><b>Date: </b> 
          ${race.ThirdPractice.date.slice(-2)} 
          ${months[Number(race.ThirdPractice.date.slice(5, 7)) - 1]}
        </p>
        `
      raceInfo.append(fp);
    }
    if (race.SprintQualifying) {
      const sq = document.createElement('p');
      sq.innerHTML = `
        <h2>Sprint Qualifying:</h2> 
        <p><b>Time: </b>${race.SprintQualifying.time.replace(":00Z", "")}</p>
        <p><b>Date: </b> 
          ${race.SprintQualifying.date.slice(-2)} 
          ${months[Number(race.SprintQualifying.date.slice(5, 7)) - 1]}
        </p>
        `
      raceInfo.append(sq);
    }
    if (race.Sprint) {
      const s = document.createElement('p');
      s.innerHTML = `
        <h2>Sprint:</h2> 
        <p><b>Time: </b>${race.Sprint.time.replace(":00Z", "")}</p>
        <p><b>Date: </b> 
          ${race.Sprint.date.slice(-2)} 
          ${months[Number(race.Sprint.date.slice(5, 7)) - 1]}
        </p>
        `
      raceInfo.append(s);
    }
    if (race.Qualifying) {
      const q = document.createElement('p');
      q.innerHTML = `
        <h2>Qualifying:</h2> 
        <p><b>Time: </b>${race.Qualifying.time.replace(":00Z", "")}</p>
        <p><b>Date: </b> 
          ${race.Qualifying.date.slice(-2)} 
          ${months[Number(race.Qualifying.date.slice(5, 7)) - 1]}
        </p>
        `
      raceInfo.append(q);
    }
    const r = document.createElement('p');
      r.innerHTML = `
        <h2>Race:</h2> 
        <p><b>Time: </b>${race.time.replace(":00Z", "")}</p>
        <p><b>Date: </b> 
          ${race.date.slice(-2)} 
          ${months[Number(race.date.slice(5, 7)) - 1]}
        </p>
        `
      raceInfo.append(r);

    contentHeader.append(raceInfo);

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

/**
 * Fetches Formula 1 race data for the 2026 season from the API.
 * @async
 * @returns {Promise<Array<Object>|undefined>} A promise that resolves to an array of race objects.
 */
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

/**
 * Initializes and renders a Leaflet map for a specific race circuit.
 * @param {Object} race - The specific race object containing circuit location data.
 * @param {string} id - The ID of the HTML element where the map should be rendered.
 */
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
  marker.openPopup();

  // Updates map after animation to avoid errors
  setTimeout(() => {
    map.invalidateSize();
    map.setView([lat, lon], 13)
  }, 300);
}

/**
 * Filters the displayed race containers based on the user's search input. <br>
 * Matches against country, race name, and circuit name.
 * @param {Array<Object>} dataArray - The original array of race data.
 */
function searchData(dataArray) {
  const input = document.querySelector("#search-input").value.toLowerCase();
  const raceContainers = document.querySelectorAll('.race-container');

  raceContainers.forEach((container, index) => {
    const race = dataArray[index];
    const searchables = `${race.Circuit.Location.country} ${race.raceName} ${race.Circuit.circuitName}`.toLowerCase()

    if (searchables.includes(input)) {
      container.style.display = "flex";
      if(container.dataset.theme === "open") {
        container.style.display = "grid";
      }
    }
    else {
      container.style.display = "none";
    }
  });
}

/**
 * Attaches event listeners to the race section to handle user interaction. <br>
 * Enables opening a detailed race modal via mouse click or the 'Enter' key for improved accessibility.
 * @param {Array<Object>} raceData - The complete dataset of race information used to populate the modal.
 * @returns {void}
 */
function openRace(raceData) {
  const raceSection = document.querySelector('.race-section');
  raceSection.addEventListener('click', (event) => {
    createRaceModal(raceData, event);
  });
  raceSection.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
      createRaceModal(raceData, event);
    }
  });
}

/**
 * Creates a modal view of a race by cloning the card and expanding it.
 * Handles animations, map initialization, and manages accessibility (inert attribute).
 * @param {Array<Object>} raceData - The full race dataset to find the specific round details.
 * @param {Event} event - The click or keydown event that triggered the modal.
 */
function createRaceModal(raceData, event) {
  const raceSection = document.querySelector('.race-section');
  const container = event.target.closest('.race-container');
    if (!container || container.id === 'clone') return;

    // Creates clone of race-container to allow animations
    const rect = container.getBoundingClientRect();
    const clone = container.cloneNode(true);
    clone.id = 'clone';
    clone.dataset.open = "open";

    const closeButton = document.createElement('button');
    closeButton.innerHTML = `<svg class="icon"><use href="#icon-hamburger-close"></use></svg>`;
    closeButton.classList.add('close-race');
    closeButton.addEventListener('click', () => {
      const openRace = document.querySelector('[data-open="open"]');
      openRace.dataset.open = "closed";
      raceSection.querySelector('#clone').remove();
      header.inert = false;
      search.inert = false;
      raceContainers.forEach(container => {
        container.inert = false;
      })
      footer.inert = false;
    });
    clone.prepend(closeButton);

    clone.style.position = 'fixed';
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.zIndex = '1000';
    clone.style.transition = 'all 0.3s ease-in-out';
    clone.removeAttribute('tabindex');
    clone.querySelector('.race-body').style.display = 'flex';
    raceSection.appendChild(clone);

    // Animates clone resizing
    const standardPadding = 'clamp(1.5rem, 5vw, 3rem)';
    const scrollbarWidth = getComputedStyle(document.documentElement).getPropertyValue('--scrollbar-width');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        clone.style.top =  '50%';
        clone.style.transform = 'translateY(-50%)';
        clone.style.left = standardPadding;
        clone.style.width = `calc(100vw - 2 * ${standardPadding} - ${scrollbarWidth})`;
        clone.style.minHeight = '70vh'
        clone.style.height = 'max-content';
        clone.style.maxHeight = `calc(100svh - 2 * ${standardPadding})`
        clone.style.boxShadow = 'none';
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

    /* ------------------------------ Toggles inert ----------------------------- */
    const header = document.querySelector('header');
    const search = document.querySelector('#search-input');
    const raceContainers = document.querySelectorAll('.race-container');
    const footer = document.querySelector('footer');

    header.inert = true;
    search.inert = true;
    raceContainers.forEach(container => {
      container.inert = true;
    })
    footer.inert = true;

    clone.inert = false;
}

/**
 * Initializes the event listener for closing the race detail modal. <br>
 * When the modal background is clicked, it removes the cloned element, <br>
 * resets data attributes, and restores interactivity to the rest of <br>
 * the page by disabling the 'inert' property on main layout components.
 * @returns {void}
 */
function closeModal() {
  const raceSection = document.querySelector('.race-section');
  const modal = document.querySelector('.modal');
  const header = document.querySelector('header');
  const search = document.querySelector('#search-input');
  const raceContainers = document.querySelectorAll('.race-container');
  const footer = document.querySelector('footer');

  modal.addEventListener('click', () => {
    const openRace = document.querySelector('[data-open="open"]');
    openRace.dataset.open = "closed";
    raceSection.querySelector('#clone').remove();
    header.inert = false;
    search.inert = false;
    raceContainers.forEach(container => {
      container.inert = false;
    })
    footer.inert = false;
  });
}


/**
 * Main entry point to initialize the race data module.
 * Fetches data, renders the grid, and attaches event listeners for search and modals.
 * @async
 * @returns {Promise<void>}
 */
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