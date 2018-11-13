import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { SingleImageView } from "./ImageViewer";

class App extends Component {
  componentDidMount() {
    this.show(
      [
        "http://192.168.1.105:5000/7.jpeg",
        "http://192.168.1.105:5000/1.jpeg",
        "http://192.168.1.105:5000/2.jpeg",
        "http://192.168.1.105:5000/3.jpeg",
        "http://192.168.1.105:5000/4.jpg",
        "http://192.168.1.105:5000/5.jpeg",
        "http://192.168.1.105:5000/6.jpg",
      ],
      2
    );
  }

  show(imagelist, current) {
    SingleImageView.show({
      imagelist,
      current,
      close: () => {
        SingleImageView.hide();
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
      </div>
    );
  }
}

export default App;
