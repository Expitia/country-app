import { Component } from "../../utils/component.directive";
import { Dispatch, DispatchEmitter } from "../../utils/dispatch.directive";
import { Prop } from "../../utils/props.directive";
import { Option } from "./../../model";

export interface SearchValue {
  text: string;
  option: string;
}

export interface SearcherElement extends HTMLElement {
  options?: Option[];
  placeholder?: string;
  search?: (event: CustomEvent<SearchValue>) => void;
}

@Component({
  selector: "searcher-filter",
  style: `
      .searcher {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .searcher input[type=text] {
        width: 100%;
        height: 70px;
        margin: 8px 0;
        max-width: 700px;
        padding: 12px 20px;
        display: inline-block;
        border: 1px solid #ccc;
        box-sizing: border-box;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        border-right: 0px;
      } 

      .searcher .div-select select {
        appearance: none;
        width: 148px;
        height: 70px;
        padding: 20px;
        color: #4F4F4F;
        font-size: 19px;
        border: 1px solid #ccc;
        background-color: white;
        border-right: 0px;
      }

      .searcher .div-select {
        cursor: pointer;
        position: relative;
      }

      .searcher .div-select::after {
        content: "";
        right: 15px;
        width: 0.8em;
        height: 0.5em;
        position: absolute;
        top: calc(50% - 0.25em);
        background-color: #21ADCF;
        clip-path: polygon(100% 0%, 0 0%, 50% 100%);
      }

      .searcher input[type=text]::placeholder {
        color: #C4C4C4;
        font-size: 19px;
      } 


      .searcher .icon {
        width: 12px;
        height: 12px;
        color: white;
        position: absolute;
        border-radius: 100%;
        border: solid 1px currentColor;
        -webkit-transform: rotate(-45deg) scale(1.5);
                transform: rotate(-45deg) scale(1.5);
      }

      .searcher .icon:before {
        content: '';
        top: 12px;
        left: 5px;
        width: 1px;
        height: 6px;
        position: absolute;
        background-color: currentColor;
      }

      .searcher .icon-container {
        display: flex;
        width: 70px;
        height: 70px;
        cursor: pointer;
        background: #21ADCF;
        align-items: center;
        justify-content: center;
        border: 1px solid #E0E0E0;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
  `,
  template: `
    <div class="searcher">
      <input type="text" placeholder="{{ placeholder }}" />
      <div class="div-select">
        <select>
          <for {{options}}>
            <option value="{{ value }}">{{ display }}</option>
          </for>
        </select>
      </div>
      <div class="button icon-container"><div class="icon"></div></div>
    </div>
  `,
})
export class Searcher extends HTMLElement {
  @Prop() options: Option[];
  @Prop() placeholder: string;
  @Dispatch() search: DispatchEmitter;
  inputValue: string;
  selectValue: string;

  constructor() {
    super();
  }

  onRender(shadow: HTMLElement) {
    const input: HTMLInputElement = shadow.querySelector(".searcher input");
    const select: HTMLSelectElement = shadow.querySelector(".searcher select");
    const icon: HTMLSelectElement = shadow.querySelector(".searcher .button");
    input.onchange = (event: InputEvent) => {
      const target = event.target as HTMLInputElement;
      this.inputValue = target.value;
      this.changed();
    };
    select.onchange = (event: InputEvent) => {
      const target = event.target as HTMLInputElement;
      this.selectValue = target.value;
      this.changed();
    };
    icon.onclick = () => this.changed();
    this.changed();
  }

  changed() {
    this.search.emit({
      detail: {
        text: this.inputValue,
        option: this.selectValue,
      },
    });
  }
}
