async function writeRaceGrid(dataArray) {
  const raceSection = document.querySelector('.race-section')

  const races = await fetchRaceData();
  races.forEach(race => {
    const container = document.createElement('section');
    const contentHeader = document.createElement('div');
    const contentBody = document.createElement('div');

    container.classList.add('race-container');
    const containerClass = race.raceName.toLowerCase().replaceAll(" ", "-").replaceAll("grand-prix", "gp");
    container.classList.add(containerClass);
    contentHeader.classList.add('race-header');
    contentBody.classList.add('race-body');

    contentHeader.innerHTML = `
      <p>Round ${race.round}</p>
      <h2>${race.Circuit.Location.country}</h2>
      <p>${race.Circuit.circuitName}</p>
    `;

    /* ------------------ Creates img-tag for country flag ------------------ */
    const raceCountry = race.Circuit.Location.country;
    let raceCountryImage = document.createElement('img');
    raceCountryImage.src = `/src/assets/images/flags/${raceCountry.toLowerCase().replaceAll(" ", "-")}-flag.svg`;
    raceCountryImage.alt = `Flag of ${raceCountry}`
    contentHeader.append(raceCountryImage);

    /* ----------------------- Creates p-tag for date ----------------------- */
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let raceDate = document.createElement('p');
    const raceStartDate = Number(race.FirstPractice.date.slice(-2));
    const raceEndDate = Number(race.date.slice(-2))
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

    container.append(contentHeader, contentBody);
    raceSection.append(container)
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

/* ----------------------------- Exports module ----------------------------- */
export function initRaceData() {
  writeRaceGrid();
}

