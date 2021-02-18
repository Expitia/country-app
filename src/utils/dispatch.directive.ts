import { timingSafeEqual } from "crypto";

export interface CustomEventOptions {
  bubbles?: boolean;
  composed?: boolean;
  detail?: any;
}

export interface DispatchEmitter {
  emit(options?: CustomEventOptions): void;
}

export const Dispatch = (eventName?: string) => {
  return (target: HTMLElement, propertyName: string) => {
    function get() {
      const self = this as EventTarget;
      return {
        emit(options?: CustomEventOptions) {
          const evtName = eventName ? eventName : propertyName;
          self.dispatchEvent(new CustomEvent(evtName, options));
        },
      };
    }

    function set(callback) {
      if (!this.preview) this.preview = {};
      const evtName = eventName ? eventName : propertyName;
      this.removeEventListener(evtName, this.preview[evtName]);
      this.addEventListener(evtName, callback);
      this.preview[evtName] = callback;
    }
    Object.defineProperty(target, propertyName, { get, set });
  };
};
