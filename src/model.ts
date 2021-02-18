export interface Country {
  flag: string;
  area: number;
  capital: string;
  demonym: string;
  borders: string[];
  alpha2Code: string;
  alpha3Code: string;
  altSpellings: string[];
  callingCodes: string[];
  cioc: string;
  gini: number;
  name: string;
  region: string;
  latlng: number[];
  subregion: string;
  nativeName: string;
  population: number;
  numericCode: string;
  timezones: string[];
  topLevelDomain: string[];
  languages: Array<{
    name: string;
    iso639_1: string;
    iso639_2: string;
    nativeName: string;
  }>;
  currencies: Array<{
    code: string;
    name: string;
    symbol: string;
  }>;
  // custom values
  favoriteIcon?: string;
  customBorders?: string;
  customCurrency?: string;
  customLanguages?: string;
  customPopulation?: string;
}

export interface Option {
  value: string;
  display: string;
}

export enum SearchOptions {
  SHOW_ALL = "Show All",
  ASIAN = "Asia",
  AFRICA = "Africa",
  EUROPE = "Europe",
  OCEANIA = "Oceania",
  AMERICA = "Americas",
  FAVORITES = "Favorites",
}
