import { Component } from "../../utils/component.directive";
import { Dispatch, DispatchEmitter } from "../../utils/dispatch.directive";
import { Prop } from "../../utils/props.directive";

export interface ClickedData {
  name: string;
  event: MouseEvent;
}

export interface CountryRowElement extends HTMLElement {
  url: string;
  name: string;
  clicked?: (event: CustomEvent<ClickedData>) => void;
}

@Component({
  selector: "country-row",
  style: `
    .country-row {
      height: 20px;
      display: flex;
      cursor: pointer;
      min-width: 220px;
      position: relative;
      align-items: center;
      justify-content: flex-start;
    }

    .country-row:hover:after {
      top: 0px;
      left: 0px;
      content: "";
      width: 100%;
      height: 100%;
      opacity: 0.1;
      position: absolute;
      background-color: #21ADCF;
    }

    .country-row img {
      width: 18px;
      height: 12px;
    }

    .country-row span {
      color: black;
      font-size: 12px;
      line-height: 14px;
      margin-left: 10px;
    }
  `,
  template: `
    <div class="country-row">
      <img src="{{ url }}" />
      <span>{{ name }}</span>
    </div>
  `,
})
export class CountryRow extends HTMLElement {
  @Prop() url: string;
  @Prop() name: string;
  @Dispatch() clicked: DispatchEmitter;

  constructor() {
    super();
  }

  onRender(shadow: HTMLElement) {
    const div: HTMLDivElement = shadow.querySelector(".country-row");
    div.onclick = (event) =>
      this.clicked.emit({ detail: { event, name: this.name } });
  }
}
