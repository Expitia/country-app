import { isValidJSON } from "./utils";

export const Prop = () => {
  return (target: any, attrName: string) => {
    function get() {
      if (!this.props) this.props = {};
      if (!this.prevProps) this.prevProps = {};
      const value = this.getAttribute(attrName) || this.props[attrName];
      const parseValue = isValidJSON(value) ? JSON.parse(value) : value;
      return parseValue;
    }
    function set(value) {
      if (!this.props) this.props = {};
      if (!this.prevProps) this.prevProps = {};
      this.prevProps[attrName] = this.props[attrName];
      this.props[attrName] = isValidJSON(value) ? JSON.parse(value) : value;
      if (value) this.setAttribute(attrName, "");
      else this.removeAttribute(attrName);
    }

    if (!target.constructor.attributes) target.constructor.attributes = [];
    if (!target.constructor.attributes.includes(attrName)) {
      target.constructor.attributes.push(attrName);
    }
    Object.defineProperty(target, attrName, { get, set });
  };
};
