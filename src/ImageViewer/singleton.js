import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

export default class Singleton {
  constructor(component) {
    this.dom = null;
    this.component = component;
    this.instance = null;
  }

  isShow() {
    return this.instance !== null;
  }

  show(option) {
    if (!this.dom) {
      this.dom = document.createElement("div");
      document.body.appendChild(this.dom);
    }
    this.instance = <this.component {...option} />;
    render(this.instance, this.dom);
  }

  hide() {
    if (this.instance) {
      this.instance = null;
      setTimeout(() => {
        unmountComponentAtNode(this.dom);
      }, 100);
    }
  }
}
