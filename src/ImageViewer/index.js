import React, { Component } from "react";
import AlloyFinger from "alloyfinger/react/AlloyFinger";
import "alloyfinger/transformjs/transform";
import { CenterImage } from "./CenterImage";
import PropTypes from "prop-types";
import Singleton from "./singleton";

import "./index.global.scss";

const gap = 30;

class ImageView extends Component {
  static defaultProps = {
    current: 0
  };

  constructor(props) {
    super(props);

    const { imagelist, current } = props;
    this.state = {
      current
    };

    this.count = imagelist.length;
    this.focus = false; // 是否正在放大某张图片
  }

  ob = null;

  render() {
    const { imagelist } = this.props;

    const { current } = this.state;

    return (
      <div className="imageview" ref="wrapper">
        <AlloyFinger
          onSingleTap={this.onSingleTap.bind(this)}
          onPressMove={this.onPressMove.bind(this)}
          onSwipe={this.onSwipe}
        >
          <ul ref={el => (this.ulRef = el)} className="imagelist">
            {imagelist.map((item, i) => {
              return (
                <li
                  className="imagelist-item"
                  style={{ marginRight: gap + "px" }}
                  key={"img" + i}
                >
                  <AlloyFinger>
                    <CenterImage
                      id={`view${i}`}
                      className="imagelist-item-img"
                      src={item}
                      index={i}
                      current={current}
                      wrapperProps={{
                        width: this.wrapperWidth,
                        height: this.wrapperHeight
                      }}
                    />
                  </AlloyFinger>
                </li>
              );
            })}
          </ul>
        </AlloyFinger>
        <div className="page" ref="page">
          {current + 1} / {this.count}
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { current } = this.state;
    const { imagelist } = this.props;

    this.count = imagelist.length;

    this.wrapperWidth = this.refs.wrapper.offsetWidth;
    this.wrapperHeight = this.refs.wrapper.offsetHeight;

    window.Transform(this.ulRef);

    current && this.changeIndex(current, false);

    this.bindStyle(current);
  }

  onSingleTap() {
    this.props.close && this.props.close();
  }

  onPressMove(evt) {
    // const { current } = this.state;
    // this.endAnimation();
    // if (!this.focused) {
    //   if (
    //     (current === 0 && evt.deltaX > 0) ||
    //     (current === this.count - 1 && evt.deltaX < 0)
    //   ) {
    //     this.ulRef.translateX += evt.deltaX / 3;
    //   } else {
    //     this.ulRef.translateX += evt.deltaX;
    //   }
    // }
  }

  onSwipe = e => {
    console.log("swipe: ", e);
    const { direction } = e;

    let { current } = this.state;
    if (this.focused) {
      return false;
    }

    switch (direction) {
      case "Left":
        if (current < this.count - 1) {
          current++;
        }
        this.bindStyle(current);
        break;
      case "Right":
        if (current > 0) {
          current--;
        }
        this.bindStyle(current);
        break;
      default:
    }

    this.changeIndex(current);
  };

  bindStyle(current) {
    this.setState({ current }, () => {
      this.ob && this.restore();
      this.ob = document.getElementById(`view${current}`);
      if (this.ob && !this.ob.scaleX) {
        window.Transform(this.ob);
      }
      // ease hide page number
      const page = this.refs.page;
      if (page) {
        page.classList.remove("hide");
        setTimeout(() => {
          page.classList.add("hide");
        }, 2000);
      }
    });
  }

  changeIndex(current, ease = true) {
    ease && (this.ulRef.style.transition = "300ms ease");
    this.ulRef.translateX = -current * (this.wrapperWidth + gap);

    this.props.changeIndex && this.props.changeIndex(current);
  }

  restore(rotate = true) {
    this.ob.translateX = 0;
    this.ob.translateY = 0;
    !!rotate && (this.ob.rotateZ = 0);
    this.ob.scaleX = 1;
    this.ob.scaleY = 1;
    this.ob.originX = 0;
    this.ob.originY = 0;
  }

  endAnimation() {
    this.ulRef.style.webkitTransition = "0";
    this.ob && this.ob.style && (this.ob.style.webkitTransition = "0");
  }
}

export const SingleImageView = new Singleton(ImageView);

export default ImageView;
