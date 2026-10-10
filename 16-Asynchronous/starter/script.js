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

function renderCountry(data, classname = '') {
  const html = `
    <article class="country ${classname}">
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
  countriesContainer.insertAdjacentHTML('beforeEnd', html);
}

function renderError(error) {
  countriesContainer.insertAdjacentText(
    'beforeend',
    `Something went wrong: ${error}`,
  );
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

function fetchCountryByCode(code, error = 'Something went wrong :(') {
  const codeType = `alpha_${code.length}`;

  return fetch(
    `https://api.restcountries.com/countries/v5/codes.${codeType}/${code}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  ).then(response => {
    if (!response.ok) {
      throw new Error(`${error} (${response.status})`);
    }
    return response.json();
  });
}

function fetchCountryData(country) {
  return fetchCountryByCode(country)
    .then(data => {
      const neighbour = data.data.objects?.[0];

      if (!neighbour) throw new Error('Country not found');

      renderCountry(neighbour);
      return neighbour.borders?.[0];
    })
    .then(neighbourCode => {
      if (!neighbourCode) return;
      return fetchCountryByCode(neighbourCode);
    })
    .then(data => {
      if (data) renderCountry(data.data.objects?.[0], 'neighbour');
    })
    .catch(reject => renderError(reject))
    .finally(() => (countriesContainer.style.opacity = 1));
}

btn.addEventListener('click', function () {
  // fetchCountryData('PT');
  // whereAmI(52.508, 13.381);
  // whereAmI(19.037, 72.873);
  // whereAmI(-33.933, 18.474);
  // whereAmI(42.48721344350255, 27.481978838106198);
  // whereAmI();
  whereAmIAsyncAwait().catch(error => console.error(error));
});

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function whereAmI() {
  getPosition()
    .then(location => {
      console.log(location);
      const { latitude: lat, longitude: lon } = location.coords;
      return fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`,
      );
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`*shrug* (${response.status})`);
      }
      return response.json();
    })
    // .then(data => fetchCountryData(data.countryCode));
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.countryName}`);
      return fetchCountryData(data.countryCode);
    })
    .catch(reject => renderError(reject));
}

const images = document.querySelector('.images');

const createImage = imgPath => {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img');

    image.addEventListener('load', () => {
      images.appendChild(image);
      resolve(image);
    });

    image.addEventListener('error', () =>
      reject(new Error(`Couldn't resolve the image.`)),
    );

    image.src = imgPath;
  });
};

const wait = seconds =>
  new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });

/*
createImage('img/img-1.jpg')
  .then(img => wait(2).then(() => (img.style.display = 'none')))
  .then(() => createImage('img/img-2.jpg'))
  .then(img => wait(2).then(() => (img.style.display = 'none')))
  .then(() => createImage('img/img-3.jpg'))
  .then(img => wait(2).then(() => (img.style.display = 'none')))
  .catch(reject => console.error(`WTF dude? No image? ${reject}`));
*/

// update whereAmI function to async/await

const whereAmIAsyncAwait = async () => {
  try {
    const position = await getPosition();
    const { latitude: lat, longitude: lon } = position.coords;
    const location = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`,
    );

    const locationData = await location.json();

    await fetchCountryData(locationData.countryCode);

    return `You are in ${locationData.city}, ${locationData.countryName}`;
  } catch (error) {
    renderError(error);
    throw error;
  }
};

const loadNPause = async imgPath => {
  try {
    const img = await createImage(imgPath);
    img.classList.add('parallel');
    await wait(2);
    img.style.display = 'none';
  } catch (error) {
    console.error(`WTF dude? No image? ${error}`);
  }
};

// loadNPause('img/img-1.jpg');

const loadAll = async imgArr => {
  try {
    const loadedImages = await Promise.all(imgArr.map(createImage));
    loadedImages.forEach(img => img.classList.add('parallel'));
  } catch (error) {
    console.error(`WTF dude? No image? ${error}`);
  }
};

const imgs = ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'];

loadAll(imgs);
