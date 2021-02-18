import { Component } from "../../utils/component.directive";

@Component({
  selector: "header-panel",
  style: `
    .header-panel {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-panel img {
      width: 65%;
      border-bottom-left-radius: 150px;
    }
    .header-panel span {
      font-size: 50px;
      line-height: 59px;
      font-weight: bold;
    }
    .header-panel span span {
      color: #54aecf;
    }
  `,
  template: `
    <div class="header-panel">
      <span>
        Find any <span>country</span><br />
        in the world.
      </span>
      <img src="public/header.png" />
    </div>
  `,
})
export class Header extends HTMLElement {
  constructor() {
    super();
  }
}
