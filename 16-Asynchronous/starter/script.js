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
  fetchCountryByCode(country)
    .then(data => {
      const neighbour = data.data.objects?.[0];
      renderCountry(neighbour);
      console.log(neighbour);
      return neighbour;
    })
    .then(data => fetchCountryByCode(data.borders?.[0]))
    .then(data => renderCountry(data.data.objects?.[0], 'neighbour'))
    .catch(reject => renderError(reject))
    .finally((countriesContainer.style.opacity = 1));
}

btn.addEventListener('click', function () {
  //   fetchCountryData('PT');
  // whereAmI(52.508, 13.381);
  // whereAmI(19.037, 72.873);
  // whereAmI(-33.933, 18.474);
  // whereAmI(42.48721344350255, 27.481978838106198);
  whereAmI();
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
      fetchCountryData(data.countryCode);
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
  const position = await getPosition();
  console.log('position: ', position);
  const { latitude: lat, longitude: lon } = position.coords;
  const location = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}`,
  );
  console.log('location: ', location);
  const locationData = await location.json();
  console.log('locationData: ', locationData);

  console.log(`You are in ${locationData.city}, ${locationData.countryName}`);
  fetchCountryData(locationData.countryCode);

  // .catch(reject => renderError(reject));
};

// whereAmIAsyncAwait();

// Coding Challenge #3

/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/

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
  imgArr.map(image => loadNPause(image));
};

const imgs = ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'];

loadAll(imgs);
