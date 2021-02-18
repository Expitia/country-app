import "./components/header/header.component";
import "./components/searcher/searcher.component";
import "./components/country-row/country-row.component";
import "./components/country-details/country-details.component";
import "./components/continent-container/continent-container.component";
import {
  ClickedData,
  ContinentElement,
} from "./components/continent-container/continent-container.component";
import { Country, SearchOptions } from "./model";
import { SearcherElement } from "./components/searcher/searcher.component";
import { CountryDetailElement } from "./components/country-details/country-details.component";
import { getJSONStorage, HttpClient, setJSONStorage } from "./utils/utils";

const searcher: SearcherElement = document.getElementById("searcher-filter");
const asianComponent: ContinentElement = document.getElementById("asian");
const africaComponent: ContinentElement = document.getElementById("africa");
const europeComponent: ContinentElement = document.getElementById("europe");
const oceaniaComponent: ContinentElement = document.getElementById("oceania");
const americaComponent: ContinentElement = document.getElementById("america");
const countryDetails: CountryDetailElement = document.getElementById("details");
const favorites: string[] = getJSONStorage("favorites") || [];

const loadData = (text: string = "", onlyFavorites?: boolean) => {
  const client = new HttpClient();
  client.get(
    text
      ? `https://restcountries.eu/rest/v2/name/${text}`
      : "https://restcountries.eu/rest/v2/all",
    (response: Country[]) => {
      const asian = response.filter(
        (item) =>
          item.region == SearchOptions.ASIAN &&
          (onlyFavorites ? favorites.includes(item.name) : true)
      );
      const africa = response.filter(
        (item) =>
          item.region == SearchOptions.AFRICA &&
          (onlyFavorites ? favorites.includes(item.name) : true)
      );
      const europe = response.filter(
        (item) =>
          item.region == SearchOptions.EUROPE &&
          (onlyFavorites ? favorites.includes(item.name) : true)
      );
      const oceania = response.filter(
        (item) =>
          item.region == SearchOptions.OCEANIA &&
          (onlyFavorites ? favorites.includes(item.name) : true)
      );
      const america = response.filter(
        (item) =>
          item.region == SearchOptions.AMERICA &&
          (onlyFavorites ? favorites.includes(item.name) : true)
      );

      asianComponent.countries = asian;
      africaComponent.countries = africa;
      europeComponent.countries = europe;
      oceaniaComponent.countries = oceania;
      americaComponent.countries = america;
    }
  );
};
loadData();

// apply some filter in search params
searcher.search = (data) => {
  if (
    !data.detail.option ||
    data.detail.option === SearchOptions.SHOW_ALL ||
    data.detail.option === SearchOptions.FAVORITES
  ) {
    asianComponent.show = true;
    africaComponent.show = true;
    europeComponent.show = true;
    oceaniaComponent.show = true;
    americaComponent.show = true;
  } else if (data.detail.option !== SearchOptions.FAVORITES) {
    asianComponent.show = data.detail.option === SearchOptions.ASIAN;
    africaComponent.show = data.detail.option === SearchOptions.AFRICA;
    europeComponent.show = data.detail.option === SearchOptions.EUROPE;
    oceaniaComponent.show = data.detail.option === SearchOptions.OCEANIA;
    americaComponent.show = data.detail.option === SearchOptions.AMERICA;
  }
  loadData(data.detail.text, data.detail.option === SearchOptions.FAVORITES);
};
searcher.options = Object.values(SearchOptions).map((item) => ({
  value: item,
  display: item,
}));

// Click on the row for details
const openOnClick = (data: CustomEvent<ClickedData>) => {
  countryDetails.country = data.detail.country;
  countryDetails.show = true;
  countryDetails.favorite = favorites.includes(data.detail.name);
};
asianComponent.clicked = (data) => openOnClick(data);
africaComponent.clicked = (data) => openOnClick(data);
europeComponent.clicked = (data) => openOnClick(data);
oceaniaComponent.clicked = (data) => openOnClick(data);
americaComponent.clicked = (data) => openOnClick(data);

// Add or remove element from favorites
let toRemove: string;
countryDetails.toggle = (data) => {
  if (data.detail.favorite) favorites.push(data.detail.name);
  else {
    toRemove = data.detail.name;
    favorites.filter((item) => item !== data.detail.name);
  }
  setJSONStorage("favorites", favorites);
};
countryDetails.close = () => {
  const removeCountry = (component: ContinentElement, name: string) => {
    component.countries = component.countries.filter(
      (item) => item.name !== name
    );
  };
  removeCountry(asianComponent, toRemove);
  removeCountry(africaComponent, toRemove);
  removeCountry(europeComponent, toRemove);
  removeCountry(oceaniaComponent, toRemove);
  removeCountry(americaComponent, toRemove);
};
