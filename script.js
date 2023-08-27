"use strict";

const countriesContainer = document.querySelector(".country__container");
const searchInput = document.querySelector(".search__input");
const searchFilter = document.querySelector(".search__filter");

const container = document.querySelector(".container");
const containerMain = document.querySelector(".container__main");
const containerSecondary = document.querySelector(".container__secondary");

const btnBack = document.querySelector(".info__country-box-btn");

////////////////////////////////////////////////////////////////

function renderHTML(countryArr) {
  countryArr.forEach((country) => {
    const formattedPopulation = country.population.toLocaleString(); // Format population number

    const html = `
        <div class="country__card" data-country="${country.name.common}">
        <div class="country__card-img-box">
          <img class="country__card-img alt=${country.name.common} src="${
      country.flags.svg
    }" />
        </div>

        <div class="country__card-info">
          <h2 class="heading__secondary">${country.name.common}</h2>

          <ul class="country__card-list">
            <li class="country__card-list-item">
              <strong>Population</strong>: ${formattedPopulation}
            </li>
            <li class="country__card-list-item">
              <strong>Region:</strong> ${country.region}
            </li>
            <li class="country__card-list-item">
              <strong>Capital:</strong>  ${
                country.capital ? country.capital[0] : "null"
              }
            </li>
          </ul>
          </div>
        </div>`;

    countriesContainer.insertAdjacentHTML("afterbegin", html);
  });
}

let borderArr = [];

const countryBorders = async function (data) {
  const borders = data.borders;
  if (!borders) return;

  const countryBordersArr = borders.map(async (border) => {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${border}`
    );
    const [data] = await response.json();

    return data.name.common;
  });

  const bordersArr = await Promise.all(countryBordersArr);

  return (borderArr = bordersArr.map((border) => `<p>${border}</p>`));
};

async function renderCountryInfoHTML(countryInfo) {
  const countryNameValues = Object.values(countryInfo.name.nativeName);
  const countryNativeName = countryNameValues[0].official;

  const [currencies] = Object.values(countryInfo.currencies);
  const languages = Object.values(countryInfo.languages);

  await countryBorders(countryInfo);

  const borderCountriesHTML = borderArr.join("");

  const html = `
  <button class="info__country-box-btn">
  <ion-icon name="arrow-back"></ion-icon>
  <p>Back</p>
</button>

  <div class="container__country-info">
  <div class="info__img-box">
    <img src="${countryInfo.flags.svg}" alt=${countryInfo.name.common}/>
  </div>

  <div class="info__country-box">
    <h3 class="heading__tertiary">${countryInfo.name.common}</h3>

    <div class="info__country-box-info">
      <ul class="info__country-box-list">
        <li class="info__country-box-item">
          <strong>Native Name: </strong>${countryNativeName}
        </li>
        <li class="info__country-box-item">
          <strong>Population: </strong>${countryInfo.population.toLocaleString()}
        </li>
        <li class="info__country-box-item">
          <strong>Region: </strong>${countryInfo.region}
        </li>
        <li class="info__country-box-item">
          <strong>Sub Region: </strong>${countryInfo.subregion}
        </li>
        <li class="info__country-box-item">
          <strong>Capital: </strong>${countryInfo.capital[0]}
        </li>
      </ul>

      <ul class="info__country-box-list">
        <li class="info__country-box-item">
          <strong>Top Level Domain: </strong>${countryInfo.tld}
        </li>
        <li class="info__country-box-item">
          <strong>Currencies: </strong>${currencies.name}
        </li>
        <li class="info__country-box-item">
          <strong>Languages: </strong>${languages.join(", ")}
        </li>
      </ul>
    </div>

    <div class="info__country-box-borders">
      <span><strong>Border Countries:</strong></span>

      <div class="info__country-box-borders-countries">
        ${borderCountriesHTML}
      </div>
    </div>

  </div>
</div>`;

  containerMain.style.display = "none";
  containerSecondary.style.display = "block";

  containerSecondary.innerHTML = "";
  containerSecondary.insertAdjacentHTML("afterbegin", html);
}

//////////////////////////////////////////////////////////////
// Rendering countries

let data;

// Render ALL countries
const renderCountries = async function () {
  const response = await fetch(`https://restcountries.com/v3.1/all`);
  data = await response.json();

  renderHTML(data);
};

renderCountries();

// Render FILTERED countries
searchFilter.addEventListener("change", function () {
  const region = this.value;
  countriesContainer.innerHTML = "";

  const filteredCountries = data.filter((country) => country.region === region);
  renderHTML(filteredCountries);
});

searchInput.addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  console.log(searchValue);
  countriesContainer.innerHTML = "";

  const filteredCountries = data.filter((country) =>
    country.name.common.toLowerCase().includes(searchValue)
  );

  renderHTML(filteredCountries);
});

// Display country INFO
countriesContainer.addEventListener("click", function (e) {
  const country = e.target.closest(".country__card");
  if (!country) return;

  container.style.backgroundColor = "white";
  const countryName = country.dataset.country;

  const countryInfo = data.find(
    (country) => country.name.common === countryName
  );

  renderCountryInfoHTML(countryInfo);
});

// Hide country INFO (go back)
containerSecondary.addEventListener("click", function (e) {
  const btnBack = e.target.closest(".info__country-box-btn");
  if (!btnBack) return;

  container.style.backgroundColor = "hsl(0, 0%, 98%)";
  containerMain.style.display = "block";
  containerSecondary.style.display = "none";
});
