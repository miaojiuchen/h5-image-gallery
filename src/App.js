import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import { SingleImageView } from "./ImageViewer";

class App extends Component {
  componentDidMount() {
    this.show(
      [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQo_3zC1FpgMmtbD0IDEVKiCMZ8H3SfbtBTOn42O8_fIj4fe8xQ",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfIGvdeXeFRgdNXbUbkgF0H6jr3IkUFtiMAaoYkCKb_8vMuEm9",
        'https://wx4.sinaimg.cn/mw690/9e6b7fdbly1fx1teg816bj20br1fhtc9.jpg',
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPvXFfMeEGvyCST6VTbp0LK0Zl0W88hVItqYyWYafleIrUeJIg",
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXk7s5SVnpDOjU-zqn4W7_FVGZeIrOiKlCeosU4w_Td5JN-NX9',
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo0M8tcOJgEGoAIFUQBEtFbxmyHNITsk8wYBD3Q9SZehfUAfm4",
        "https://www.thoughtco.com/thmb/yVxg0XRkUEJ3GKT1lWfmCmE36vI=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/JTSiemer-5666ee215f9b583dc3a4befd.jpg"
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
