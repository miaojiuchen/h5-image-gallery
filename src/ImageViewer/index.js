import React, { Component } from "react";
import AlloyFinger from "alloyfinger/react/AlloyFinger";
import "alloyfinger/transformjs/transform";
import { CenterImage } from "./CenterImage";
import Singleton from "./singleton";

import "./index.global.scss";

const gap = 0;
const viewId = id => `view${id}`;

class ImageView extends Component {
  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);

    const { imagelist, current } = props;
    this.state = { current };
    this.count = imagelist.length;
    this.images = new Array(imagelist.length);
  }

  // Todo: 分析图片懒加载流程，然后cache it
  get node() {
    return this.images[this.state.current];
  }

  // 是否正在放大某张图片
  focus = false;
  boundaryReach = false;

  handleImageLoad = i => {
    return domNode => {
      this.images[i] = domNode;
      console.log(this.images);
    };
  };

  render() {
    const { imagelist } = this.props;

    const { current } = this.state;

    return (
      <div className="imageview" ref="wrapper">
        <ul ref={el => (this.ul = el)} className="imagelist">
          {imagelist.map((item, i) => {
            return (
              <AlloyFinger
                key={i}
                onSingleTap={this.onSingleTap}
                onSwipe={this.onSwipe}
                onPressMove={this.onPressMove}
                onDoubleTap={this.handleDoubleTap}
                onPinch={this.handlePinch}
                onMultipointStart={this.onMultipointStart}
                onMultipointEnd={this.onMultipointEnd}
              >
                <li
                  className="imagelist-item"
                  style={{ marginRight: gap + "px" }}
                >
                  <CenterImage
                    id={viewId(i)}
                    className="imagelist-item-img"
                    src={item}
                    index={i}
                    current={current}
                    onImageLoad={this.handleImageLoad(i)}
                    wrapperProps={{
                      width: this.wrapperWidth,
                      height: this.wrapperHeight
                    }}
                  />
                </li>
              </AlloyFinger>
            );
          })}
        </ul>
        <div className="page" ref="page">
          {current + 1} / {this.count}
        </div>
      </div>
    );
  }

  handleDoubleTap = e => {
    console.log("double tap");
    this.focus = !this.focus;

    console.log();
  };

  handlePinch = e => {
    this.focus = true;

    this.node.style.transition = "cubic-bezier(.25,.01,.25,1)";
    const { originX, originY } = this.node;

    const originX2 =
      e.center.x - this.wrapperWidth / 2 - this.wrapperScrollLeft;
    const originY2 =
      e.center.y - this.wrapperHeight / 2 - this.wrapperScrollTop;

    this.node.originX = originX2;
    this.node.originY = originY2;

    this.node.translateX =
      this.node.translateX + (originX2 - originX) * this.node.scaleX;
    this.node.translateY =
      this.node.translateY + (originY2 - originY) * this.node.scaleY;

    this.node.scaleX = e.scale;

    console.log(originX, originY, e.center);
  };

  componentDidMount() {
    const { current } = this.state;
    const { imagelist } = this.props;

    this.count = imagelist.length;

    this.wrapperWidth = this.refs.wrapper.offsetWidth;
    this.wrapperHeight = this.refs.wrapper.offsetHeight;

    window.Transform(this.ul);

    this.swipeTo(current, false);

    // this.bindStyle(current);
  }

  get wrapperScrollLeft() {
    return this.refs.wrapper.scrollLeft;
  }
  get wrapperScrollTop() {
    return this.refs.wrapper.scrollTop;
  }

  onSingleTap = () => {
    console.log("single tap");
    // this.props.close && this.props.close();
  };

  // onMultipointStart = () => {
  //   console.log("multipointStart");
  // };

  onPressMove = e => {
    if (!this.focus) {
      return;
    }

    console.log("pressMove");
  };

  // onMultipointEnd = () => {
  //   console.log("multipointEnd");
  // };

  onSwipe = e => {
    if (this.focus) {
      return;
    }

    let { current } = this.state;

    switch (e.direction) {
      case "Left":
        if (current < this.count - 1) {
          current++;
        }
        break;
      case "Right":
        if (current > 0) {
          current--;
        }
        break;
      default:
    }

    this.setState({ current }, () => {
      this.bindStyle(current);
    });

    this.swipeTo(current);
  };

  bindStyle(current) {
    // this.node &&
    this.restore();

    if (this.node && !this.node.scaleX) {
      window.Transform(this.node);
    }
    // // ease hide page number
    // const page = this.refs.page;
    // if (page) {
    //   page.classList.remove("hide");
    //   setTimeout(() => {
    //     page.classList.add("hide");
    //   }, 2000);
    // }
  }

  swipeTo(current, ease = true) {
    if (ease) {
      this.ul.style.transition = "300ms ease";
    }
    this.ul.translateX = -current * (this.wrapperWidth + gap);
  }

  restore(rotate = true) {
    this.node.translateX = 0;
    this.node.translateY = 0;
    !!rotate && (this.node.rotateZ = 0);
    this.node.scaleX = 1;
    this.node.scaleY = 1;
    this.node.originX = 0;
    this.node.originY = 0;
  }

  endAnimation() {
    this.ul.style.transition = "0";
    this.node && this.node.style && (this.node.style.transition = "0");
  }
}

export const SingleImageView = new Singleton(ImageView);

export default ImageView;
