const state = {
  breweries: [],
  filters: {
    search: "",
    type: "",
    cities: [],
  },
};

function getBreweriesByState(state) {
  return fetch(
    `https://api.openbrewerydb.org/breweries?by_state=${state}&per_page=50`
  ).then(function (response) {
    return response.json();
  });
}

const mainEl = document.querySelector("main");
const formEl = document.querySelector("#select-state-form");

formEl.addEventListener("submit", function (event) {
  event.preventDefault();

  const USState = formEl["select-state"].value;
  getBreweriesByState(USState).then(function (breweriesFromServer) {
    const filteredBreweries = breweriesFromServer.filter(function (brewery) {
      // condition of the brewery I want to find
      return ["brewpub", "micro", "regional"].includes(brewery.brewery_type);
      //   brewery.brewery_type === "brewpub" ||
      //     brewery.brewery_type === "micro" ||
      //     brewery.brewery_type === "regional"
      // );
    });

    state.breweries = filteredBreweries;

    renderState();
  });
});

function renderState() {
  mainEl.innerHTML = "";
  const articleEl = document.createElement("article");
  const ulEl = document.createElement("ul");
  ulEl.setAttribute("class", "breweries-list");

  articleEl.append(ulEl);
  mainEl.append(articleEl);

  // Render all the stuff
  const hi1El = document.createElement("h1");
  hi1El.innerText = "List of Breweries";
  const header = createHeaderSearchBar();

  let asideFilterEl = createFilterSection();

  ulEl.innerHTML = "";
  renderBreweryList();
  mainEl.append(hi1El, header, asideFilterEl);
}

//return li
function createSingleBreweryItem(brewery) {
  const LiEl = document.createElement("li");

  const h2El = document.createElement("h2");
  h2El.innerText = brewery.name;

  const divTypeEl = document.createElement("div");
  divTypeEl.setAttribute("class", "type");
  divTypeEl.innerText = brewery.brewery_type;

  const addressSectionEl = document.createElement("section");
  addressSectionEl.setAttribute("class", "address");

  const h3El = document.createElement("h3");
  h3El.innerText = "Address:";

  const streetPEl = document.createElement("p");
  streetPEl.innerText = brewery.street;

  const cityPostCodePEl = document.createElement("p");
  const strongEl = document.createElement("strong");
  strongEl.innerText = `${brewery.city}, ${brewery.postal_code}`;

  cityPostCodePEl.append(strongEl);

  addressSectionEl.append(h3El, streetPEl, cityPostCodePEl);

  const phoneSectionEl = document.createElement("section");
  phoneSectionEl.setAttribute("class", "phone");

  const h3PhoneEl = document.createElement("h3");
  h3PhoneEl.innerText = "Phone:";

  const pEl = document.createElement("p");
  pEl.innerText = brewery.phone;

  phoneSectionEl.append(h3PhoneEl, pEl);

  const linkSectionEl = document.createElement("section");
  linkSectionEl.setAttribute("class", "link");

  const linkEl = document.createElement("a");
  linkEl.href = brewery.website_url;
  linkEl.setAttribute("target", "_blank");
  linkEl.innerText = "Visit Website";

  linkSectionEl.append(linkEl);

  LiEl.append(h2El, divTypeEl, addressSectionEl, phoneSectionEl, linkSectionEl);

  return LiEl;
}

function createHeaderSearchBar() {
  const headerEl = document.createElement("header");
  headerEl.setAttribute("class", "search-bar");

  const searchForm = document.createElement("form");
  searchForm.setAttribute("id", "search-breweries-form");
  searchForm.setAttribute("autocomplete", "off");

  const labelSearchEl = document.createElement("label");
  labelSearchEl.setAttribute("for", "search-breweries");

  const h2El = document.createElement("h2");
  h2El.innerText = "Search breweries:";

  labelSearchEl.append(h2El);

  const searchInputEl = document.createElement("input");
  searchInputEl.setAttribute("id", "search-breweries");
  searchInputEl.setAttribute("name", "search-breweries");
  searchInputEl.setAttribute("type", "text");
  searchInputEl.value = state.filters.search;

  searchForm.addEventListener("input", function (event) {
    event.preventDefault();
    state.filters.search = searchInputEl.value;
    renderBreweryList();
  });

  searchForm.append(labelSearchEl, searchInputEl);

  headerEl.append(searchForm);

  return headerEl;
}

function renderBreweryList() {
  const ulEl = document.querySelector("ul");
  ulEl.innerHTML = "";
  let breweriesToRender = state.breweries;

  if (state.filters.type !== "") {
    // code here depends on filter type
    breweriesToRender = breweriesToRender.filter(function (brewery) {
      return brewery.brewery_type === state.filters.type;
    });
  }

  if (state.filters.search !== "") {
    breweriesToRender = breweriesToRender.filter(function (brewery) {
      return (
        brewery.name
          .toLowerCase()
          .indexOf(state.filters.search.toLowerCase()) !== -1
      );
    });
  }

  if (state.filters.cities.length > 0) {
    // code here depends on filter cities
    breweriesToRender = breweriesToRender.filter(function (brewery) {
      return state.filters.cities.includes(brewery.city);
    });
  }

  breweriesToRender = breweriesToRender.slice(0, 10);
  for (const brewery of breweriesToRender) {
    renderSingleBreweryListItem(brewery);
  }
  createFilterSection();
}

function renderSingleBreweryListItem(brewery) {
  const ulEl = document.querySelector("ul");
  // code to put a single brewery on the page here...
  let liEl = createSingleBreweryItem(brewery);
  ulEl.append(liEl);
}

function createFilterSection() {
  const asideFilterEl = document.createElement("aside");
  asideFilterEl.setAttribute("class", "filters-section");

  const h2El = document.createElement("h2");
  h2El.innerText = "Filter By:";

  //Filter-by-type FORM
  const filterByTypeForm = document.createElement("form");
  filterByTypeForm.setAttribute("id", "filter-by-type-form");
  filterByTypeForm.setAttribute("autocompete", "off");

  labelTypeEl = document.createElement("label");
  labelTypeEl.setAttribute("for", "filter-by-type");

  h3TypeEl = document.createElement("h3");
  h3TypeEl.innerText = "Type of Brewery";

  labelTypeEl.append(h3TypeEl);

  const selectEl = document.createElement("select");
  selectEl.setAttribute("name", "filter-by-type");
  selectEl.setAttribute("id", "filter-by-type");

  const optionEl = document.createElement("option");
  optionEl.setAttribute("value", "");
  optionEl.innerText = "Select a type...";

  const option1El = document.createElement("option");
  option1El.setAttribute("value", "micro");
  option1El.innerText = "Micro";
  if (state.filters.type == "micro") {
    option1El.setAttribute("selected", "selected");
  }

  const option2El = document.createElement("option");
  option2El.setAttribute("value", "regional");
  option2El.innerText = "Regional";
  if (state.filters.type == "regional") {
    option2El.setAttribute("selected", "selected");
  }

  const option3El = document.createElement("option");
  option3El.setAttribute("value", "brewpub");
  option3El.innerText = "Brewpub";
  if (state.filters.type == "brewpub") {
    option3El.setAttribute("selected", "selected");
  }

  selectEl.addEventListener("change", function () {
    state.filters.type = selectEl.value;
    renderBreweryList();
  });

  selectEl.append(optionEl, option1El, option2El, option3El);

  filterByTypeForm.append(labelTypeEl, selectEl);

  //filter-by-city div
  const cityFilterDiv = document.createElement("div");
  cityFilterDiv.setAttribute("class", "filter-by-city-heading");

  const h3CityEl = document.createElement("h3");
  h3CityEl.innerText = "Cities";

  const filterCityBtn = document.createElement("button");
  filterCityBtn.setAttribute("class", "clear-all-btn");
  filterCityBtn.innerText = "clear all";

  cityFilterDiv.append(h3CityEl, filterCityBtn);

  //filter-by-city FORM
  const filterByCityForm = document.createElement("form");
  filterByCityForm.setAttribute("id", "filter-by-city-form");

  asideFilterEl.append(h2El, filterByTypeForm, cityFilterDiv, filterByCityForm);

  const allCities = state.breweries.map(function (brewery) {
    return brewery.city;
  });

  const uniqueCitiesArray = [...new Set(allCities)];
  const sortedCituesArray = uniqueCitiesArray.slice().sort();

  for (const city of sortedCituesArray) {
    const inputEl = document.createElement("input");
    inputEl.setAttribute("type", "checkbox");
    inputEl.setAttribute("name", city);
    inputEl.setAttribute("value", city);

    if (state.filters.cities.includes(inputEl.value)) {
      inputEl.setAttribute("checked", true);
    }

    inputEl.addEventListener("change", function () {
      if (state.filters.cities.includes(inputEl.value)) {
        let index = state.filters.cities.indexOf(inputEl.value);
        if (index > -1) {
          state.filters.cities.splice(index, 1);
        }
      } else {
        state.filters.cities.push(inputEl.value);
      }
      renderBreweryList();
    });

    const labelEl = document.createElement("label");
    labelEl.setAttribute("for", city);
    labelEl.innerText = city;

    filterByCityForm.append(inputEl, labelEl);
  }

  return asideFilterEl;
}
