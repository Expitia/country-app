import { isValidJSON } from "./utils";

export interface Metadata {
  style: string;
  selector: string;
  template: string;
}

const END_IF = "</if>";
const START_IF = "<if";
const END_TMPL = "}}";
const START_TMPL = "{{";
const END_RUNNER = "</for>";
const START_RUNNER = "<for";
const END_MODEL = "</model>";
const START_MODEL = "<model";

export const Component = (args: Metadata) => {
  return (target) => {
    const customElement: any = class extends target {
      props: Record<string, any> = {};
      prevProps: Record<string, any> = {};

      constructor() {
        super();
        this.__render();
      }

      __render() {
        const shadow = this.shadowRoot || this.attachShadow({ mode: "open" });
        shadow.innerHTML = "";
        const template = document.createElement("template");
        const style = `${args.style ? `<style>${args.style}</style>` : ""}`;
        template.innerHTML = `${style}${
          args.template ? this.addTemplateData(args.template) : ""
        }`;
        const clone = document.importNode(template, true);
        shadow.appendChild(clone.content);
        super.onRender && super.onRender(shadow);
      }

      attributeChangedCallback(name) {
        this.__render();
        super.attributeChangedCallback &&
          super.attributeChangedCallback(
            name,
            this.prevProps[name],
            this.props[name]
          );
      }

      static get observedAttributes() {
        return target.attributes || [];
      }

      addTemplateData(template: string) {
        template = this.clearWhiteSpace(template);
        template = this.processVisibility(template);
        template = this.processRunners(template);
        template = this.processModel(template);
        template = this.processSimpleData(template);
        return template;
      }

      processModel(template: string) {
        let sindex, eindex, property;
        do {
          sindex = template.indexOf(START_MODEL);
          eindex = template.indexOf(END_MODEL);
          const subTemplate = template.slice(sindex, eindex + 8);
          property = this.getProperty(subTemplate);
          const value = this[property] || this.props[property] || {};
          const mapTemplate = subTemplate.match(
            /<model[^>]*>([\s\S]*?)<\/model>/
          );
          if (mapTemplate) {
            const toTemplate = this.processSimpleData(mapTemplate[1], value);
            template = template.replace(subTemplate, toTemplate);
          }
        } while (sindex >= 0 || eindex >= 0);

        return template;
      }

      clearWhiteSpace(template: string) {
        while (
          template.includes(`${START_TMPL} `) ||
          template.includes(` ${END_TMPL}`)
        ) {
          template = template.replaceAll(` ${END_TMPL}`, END_TMPL);
          template = template.replaceAll(`${START_TMPL} `, START_TMPL);
        }
        return template;
      }

      processVisibility(template: string) {
        let sindex, eindex, property;
        do {
          sindex = template.indexOf(START_IF);
          eindex = template.indexOf(END_IF);
          const subTemplate = template.slice(sindex, eindex + 6);
          property = this.getProperty(subTemplate);
          const value = this[property] || this.props[property];
          const mapTemplate = subTemplate.match(/<if[^>]*>([\s\S]*?)<\/if>/);
          if (mapTemplate) {
            if (value) template = template.replace(subTemplate, mapTemplate[1]);
            else template = template.replace(subTemplate, "");
          }
        } while (sindex >= 0 || eindex >= 0);

        return template;
      }

      processRunners(template: string) {
        let sindex, eindex, property;
        do {
          sindex = template.indexOf(START_RUNNER);
          eindex = template.indexOf(END_RUNNER);
          const subTemplate = template.slice(sindex, eindex + 6);
          property = this.getProperty(subTemplate);
          const value = this[property] || this.props[property] || [];
          const mapTemplate = subTemplate.match(/<for[^>]*>([\s\S]*?)<\/for>/);
          if (mapTemplate) {
            const toTemplate = value.map((item) =>
              this.processSimpleData(mapTemplate[1], item)
            );
            template = template.replace(subTemplate, toTemplate.join("\n"));
          }
        } while (sindex >= 0 || eindex >= 0);

        return template;
      }

      processSimpleData(template: string, scope?) {
        let property: string;
        do {
          property = this.getProperty(template);
          const value = (scope || this)[property] || this.props[property];
          template = template.replace(START_TMPL + property + END_TMPL, value);
        } while (property);

        return template;
      }

      getProperty(template: string) {
        const sindex = template.indexOf(START_TMPL);
        const eindex = template.indexOf(END_TMPL);
        return sindex >= 0 && eindex >= 0
          ? template.slice(sindex + 2, eindex)
          : undefined;
      }
    };

    customElements.define(args.selector, customElement);
    return customElement;
  };
};
