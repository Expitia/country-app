import { Country } from "../../model";
import { Component } from "../../utils/component.directive";
import { Dispatch, DispatchEmitter } from "../../utils/dispatch.directive";
import { Prop } from "../../utils/props.directive";
import { compareObjects, formatCurrency } from "../../utils/utils";

interface ToggleData {
  name: string;
  country: Country;
  favorite: boolean;
}

export interface CountryDetailElement extends HTMLElement {
  show?: boolean;
  country?: Country;
  favorite?: boolean;
  close?: (event: CustomEvent) => void;
  toggle?: (event: CustomEvent<ToggleData>) => void;
}

enum FavoriteIcons {
  EMPTY = "public/star.png",
  FILL = "public/fill.png",
}

@Component({
  selector: "country-details",
  style: `
    .country-detail{
        z-index: 2;
        width: auto;
        height: auto;
        margin: auto;
        position: fixed;
        top: calc(50% - 253px);
        left: calc(50% - 443px);
    }
    
    .country-detail .country-detail-container {
        width: 886px;
        height: 506px;
        display: flex;
        padding: 20px;
        flex-direction: column;
        background-color: white;
    }

    .detail-shadow {
        top: 0px;
        left: 0px;
        z-index: 1;
        content: "";
        width: 100%;
        height: 100%;
        opacity: 0.4;
        position: fixed;
        background-color: black;
    }

    .country-detail .country-detail-container .close-button {
        top: 20px;
        right: 40px;
        opacity: 0.4;
        cursor: pointer;
        position: absolute;
        transform: scale(1.5);
    }

    .country-detail .country-detail-container .icon-close {
        color: #000;
        position: relative;
        margin-left: 3px;
        margin-top: 10px;
    }

    .country-detail .country-detail-container .icon-close:after {
        content: '';
        position: absolute;
        width: 15px;
        height: 1px;
        background-color: currentColor;
        -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
    }

    .country-detail .country-detail-container .icon-close:before {
        content: '';
        position: absolute;
        width: 15px;
        height: 1px;
        background-color: currentColor;
        -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
    }

    .country-detail .country-detail-container h2 {
        color: #09295E;
        font-size: 40px;
        font-weight: 500;
    }

    .country-detail .country-detail-container .country-data {
        color: #4F4F4F;
        font-size: 20px;
        margin-bottom: 10px;
    }

    .country-detail .country-detail-container .flag {
        width: 181px;
        height: 120px;
    }
    .country-detail .country-detail-container .favorite {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }
  `,
  template: `
    <if {{show}}>
      <div class="detail-shadow"></div>
    </if>
    <div class="country-detail">
      <if {{show}}>
        <div class="country-detail-container">
          <div class="close-button">
            <span class="icon-close"></span>
          </div>
          <model {{country}}>
            <h2>
              {{ name }}
              <img class="favorite" src="{{ favoriteIcon }}" />
            </h2>
            <div class="country-data">
              <strong>Region:</strong>
              <span>{{ region }}</span>
            </div>
            <div class="country-data">
              <strong>Population:</strong>
              <span>{{ customPopulation }}</span>
            </div>
            <div class="country-data">
              <strong>Capital:</strong>
              <span>{{ capital }}</span>
            </div>
            <div class="country-data">
              <strong>Currency:</strong>
              <span>{{ customCurrency }}</span>
            </div>
            <div class="country-data">
              <strong>Language:</strong>
              <span>{{ customLanguages }}</span>
            </div>
            <div class="country-data">
              <strong>Border Countries:</strong>
              <span>{{ customBorders }}</span>
            </div>
            <div class="country-data">
              <strong>Flag:</strong>
            </div>
            <img class="flag" src="{{ flag }}" />
          </model>
        </div>
      </if>
    </div>
  `,
})
export class ContinentContainer extends HTMLElement {
  @Prop() show: boolean;
  @Prop() country: Country;
  @Prop() favorite: boolean;
  @Dispatch() close: DispatchEmitter;
  @Dispatch() toggle: DispatchEmitter;

  constructor() {
    super();
  }

  attributeChangedCallback(name, prev, current) {
    if (name === "country" && !compareObjects(prev, current)) {
      const country = { ...current } as Country;
      country.customBorders = country.borders.join(" ,");
      country.customPopulation = formatCurrency(country.population);
      country.customCurrency = country.currencies
        .map((item) => item.name)
        .join(" ,");
      country.customLanguages = country.languages
        .map((item) => item.nativeName)
        .join(" ,");
      if (!country.favoriteIcon) country.favoriteIcon = FavoriteIcons.EMPTY;
      this.country = country;
    }
    if (name === "favorite") {
      this.country = {
        ...this.country,
        favoriteIcon: current ? FavoriteIcons.FILL : FavoriteIcons.EMPTY,
      };
    }
  }

  onRender(shadow: HTMLElement) {
    const close: HTMLDivElement = shadow.querySelector(".close-button");
    const favorite: HTMLImageElement = shadow.querySelector(".favorite");
    if (close) {
      close.onclick = () => {
        this.show = false;
        this.close.emit({});
      };
    }
    if (favorite) {
      favorite.onclick = () => {
        this.favorite = !this.favorite;
        this.toggle.emit({
          detail: {
            country: this.country,
            name: this.country.name,
            favorite: this.favorite,
          },
        });
      };
    }
  }
}
