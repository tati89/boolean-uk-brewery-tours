const state = {
  breweries: [],
};

listenToSelectStateForm();

const mainEl = document.querySelector("main");
const article = document.createElement("article");

const ulEl = document.createElement("ul");
ulEl.setAttribute("class", "breweries-list");
article.append(ulEl);
mainEl.append(article);

function getBreweriesByState(state) {
  return fetch(
    `https://api.openbrewerydb.org/breweries?by_state=${state}&per_page=50`
  ).then(function (response) {
    return response.json();
  });
}

function listenToSelectStateForm() {
  const formEl = document.querySelector("#select-state-form");

  formEl.addEventListener("submit", function (event) {
    event.preventDefault();

    // get the user's input from the select-state input on the form
    // NOTE: forms have properties for every input with a name within it
    const USState = formEl["select-state"].value;

    getBreweriesByState(USState).then(function (breweriesFromServer) {
      const filteredBreweries = breweriesFromServer.filter(function (brewery) {
        // condition of the brewery I want to find
        return (
          brewery.brewery_type === "brewpub" ||
          brewery.brewery_type === "micro" ||
          brewery.brewery_type === "regional"
        );
      });

      const slicedBreweries = filteredBreweries.slice(0, 10);

      state.breweries = slicedBreweries;

      const hi1El = document.createElement("h1");
      hi1El.innerText = "List of Breweries";

      const header = createHeaderSearchBar();
      let asideFilterEl = createFilterSection();
      mainEl.append(hi1El, header, asideFilterEl);
      renderBreweryList();
    });
  });
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

  searchForm.append(labelSearchEl, searchInputEl);

  headerEl.append(searchForm);

  return headerEl;
}

function renderBreweryList() {
  for (const brewery of state.breweries) {
    renderSingleBreweryListItem(brewery);
  }
}

function renderSingleBreweryListItem(brewery) {
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

  const option2El = document.createElement("option");
  option2El.setAttribute("value", "regional");
  option2El.innerText = "Regional";

  const option3El = document.createElement("option");
  option3El.setAttribute("value", "brewpub");
  option3El.innerText = "Brewpub";

  selectEl.append(optionEl, option1El, option2El, option3El);
  filterByTypeForm.append(labelTypeEl, selectEl);

  //folter-by-city div
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

  const inputChardon = document.createElement("input");
  inputChardon.setAttribute("type", "checkbox");
  inputChardon.setAttribute("name", "chardon");
  inputChardon.setAttribute("value", "chardon");

  const labelChardon = document.createElement("label");
  labelChardon.setAttribute("for", "chardon");
  labelChardon.innerText = "Chardon";

  const inputCincinnati = document.createElement("input");
  inputCincinnati.setAttribute("type", "checkbox");
  inputCincinnati.setAttribute("name", "cincinnati");
  inputCincinnati.setAttribute("value", "cincinnati");

  const labelCincinnati = document.createElement("label");
  labelCincinnati.setAttribute("for", "cincinnati");
  labelCincinnati.innerText = "Cincinnati";

  filterByCityForm.append(
    inputChardon,
    labelChardon,
    inputCincinnati,
    labelCincinnati
  );

  asideFilterEl.append(h2El, filterByTypeForm, cityFilterDiv, filterByCityForm);

  return asideFilterEl;
}