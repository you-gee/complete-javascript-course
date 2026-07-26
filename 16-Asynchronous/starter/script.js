'use strict';

const token = 'rc_live_d324866a6ef74a52a312bbed3af91888';
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://restcountries.com/v2/name/portugal

/*
function getCountryData(country) {
  const request = new XMLHttpRequest();
  request.onload = function () {
    const data = JSON.parse(this.responseText).data.objects[0];
    console.log(data);
    const html = `
    <article class="country">
        <img class="country__img" src="${data.flag.url_svg}"/>
        <div class="country__data">
        <h3 class="country__name">${data.names.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed(1)} millions</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].code}</p>
        </div>
    </article>
`;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  };
  //   request.addEventListener('load', function () {
  //     const data = JSON.parse(this.responseText).data.objects[0];
  //     console.log(data);
  //     const html = `
  //     <article class="country">
  //         <img class="country__img" src="${data.flag.url_svg}"/>
  //         <div class="country__data">
  //         <h3 class="country__name">${data.names.common}</h3>
  //         <h4 class="country__region">${data.region}</h4>
  //         <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed(1)} millions</p>
  //         <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
  //         <p class="country__row"><span>💰</span>${data.currencies[0].code}</p>
  //         </div>
  //     </article>
  // `;
  //     countriesContainer.insertAdjacentHTML('beforeend', html);
  //     countriesContainer.style.opacity = 1;
  //   });
  request.open(
    'GET',
    `https://api.restcountries.com/countries/v5/codes.alpha_2/${country}`,
  );
  request.setRequestHeader(
    'Authorization',
    `Bearer ${token}`,
  );
  request.send();
}
*/

function renderCountry(data) {
  console.log('Data received:', data);
  const html = `
    <article class="country">
        <img class="country__img" src="${data.flag.url_svg}"/>
        <div class="country__data">
        <h3 class="country__name">${data.names.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed(1)} millions</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].code}</p>
        </div>
    </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
}

/*
function getCountryAndNeighbour(country) {
  const request = new XMLHttpRequest();
  request.addEventListener('load', function () {
    const data = JSON.parse(this.responseText).data.objects[0];
    console.log(data);
    renderCountry(data);

    // render neighbouring country
    const neighbour = data.borders?.[0];
    console.log(neighbour);
    const request = new XMLHttpRequest();
    request.addEventListener('load', function () {
      const data = JSON.parse(this.responseText).data.objects[0];
      console.log(data);
      renderCountry(data);
    });
    request.open(
      'GET',
      `https://api.restcountries.com/countries/v5/codes.alpha_3/${neighbour}`,
    );
    request.setRequestHeader(
      'Authorization',
      'Bearer rc_live_d324866a6ef74a52a312bbed3af91888',
    );
    request.send();
  });
  request.open(
    'GET',
    `https://api.restcountries.com/countries/v5/codes.alpha_2/${country}`,
  );
  request.setRequestHeader(
    'Authorization',
    'Bearer rc_live_d324866a6ef74a52a312bbed3af91888',
  );
  request.send();
}
*/

// getCountryData('PT');
// getCountryData('US');
// getCountryData('DE');
// getCountryAndNeighbour('PT');

// NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

///////////////////////////////////////

function fetchCountryData(country) {
  fetch(`https://api.restcountries.com/countries/v5/codes.alpha_2/${country}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(response =>
    response.json().then(data => renderCountry(data.data.objects[0])),
  );
}

fetchCountryData('PT');
