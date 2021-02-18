import { Country } from "../../model";
import { Component } from "../../utils/component.directive";
import { Dispatch, DispatchEmitter } from "../../utils/dispatch.directive";
import { Prop } from "../../utils/props.directive";
import { CountryRowElement } from "../country-row/country-row.component";

export interface ClickedData {
  name: string;
  event: MouseEvent;
  country: Country;
}

export interface ContinentElement extends HTMLElement {
  show?: boolean;
  header?: string;
  countries?: Country[];
  clicked?: (event: CustomEvent<ClickedData>) => void;
}

@Component({
  selector: "continent-container",
  style: `
    h2 {
      color: #09295E;
      font-size: 20px;
      min-width: 220px;
      line-height: 23px;
      font-weight: bold;
    }
  `,
  template: `
    <if {{show}}>
      <h2>{{ header }}</h2>
      <div class="countries">
        <for {{countries}}>
          <country-row name="{{ name }}" url="{{ flag }}"></country-row>
        </for>
      </div>
    </if>
  `,
})
export class ContinentContainer extends HTMLElement {
  @Prop() show: boolean = true;
  @Prop() header: string;
  @Prop() countries: Country[];
  @Dispatch() clicked: DispatchEmitter;

  constructor() {
    super();
  }

  onRender(shadow: HTMLElement) {
    const rows = shadow.querySelectorAll<CountryRowElement>("country-row");
    rows.forEach((item) => {
      item.clicked = (data) => {
        this.clicked.emit({
          detail: {
            ...data.detail,
            country: this.countries.find(
              (item) => item.name === data.detail.name
            ),
          },
        });
      };
    });
  }
}
