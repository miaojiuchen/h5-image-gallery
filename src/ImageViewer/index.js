import React, { Component } from "react";
import AlloyFinger from "alloyfinger/react/AlloyFinger";
import "alloyfinger/transformjs/transform";
import { CenterImage } from "./CenterImage";
import Singleton from "./singleton";

import "./index.global.scss";

const gap = 0;

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

  getNode = i => {
    return this.images[i];
  };

  // 是否正在放大某张图片
  focus = false;
  canPinch = false;
  // 每张图片初始缩放，这个值随着放大与缩小而产生变化
  currentScale = 1;
  maxScale = 3;

  handleImageLoad = i => {
    return domNode => {
      this.images[i] = domNode;
      this.bindStyle(i);
    };
  };

  componentDidMount() {
    const { current } = this.state;
    const { imagelist } = this.props;

    this.count = imagelist.length;

    this.setState(
      {
        wrapperWidth: this.refs.wrapper.offsetWidth,
        wrapperHeight: this.refs.wrapper.offsetHeight,
        wrapperReady: true
      },
      () => {
        this.wrapperWidth = this.state.wrapperWidth;
        this.wrapperHeight = this.state.wrapperHeight;
        window.Transform(this.ul);
        this.swipeTo(current, false);
      }
    );
  }

  get wrapperScrollLeft() {
    return this.refs.wrapper.scrollLeft;
  }
  get wrapperScrollTop() {
    return this.refs.wrapper.scrollTop;
  }

  render() {
    const { imagelist } = this.props;

    const { current, wrapperWidth, wrapperHeight, wrapperReady } = this.state;

    return (
      <div className="imageview" ref="wrapper">
        {wrapperReady && (
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
                      className="imagelist-item-img"
                      src={item}
                      index={i}
                      current={current}
                      onImageLoad={this.handleImageLoad(i)}
                      wrapperProps={{
                        width: wrapperWidth,
                        height: wrapperHeight
                      }}
                    />
                  </li>
                </AlloyFinger>
              );
            })}
          </ul>
        )}
        <div className="page" ref="page">
          {current + 1} / {this.count}
        </div>
      </div>
    );
  }

  handleDoubleTap = e => {
    this.focus = !this.focus;
    const { origin } = e;
    const originX = origin[0] - this.wrapperWidth / 2 - this.wrapperScrollLeft;
    const originY = origin[1] - this.wrapperHeight / 2 - this.wrapperScrollTop;

    if (this.focus) {
      this.node.translateX = originX;
      this.node.originX = originX;

      this.node.translateY = originY;
      this.node.originY = originY;
      this.setScale(this.node, 2);
    } else {
      this.node.translateX = this.node.originX;
      this.node.translateY = this.node.originY;
      this.setScale(this.node, 1);
    }
  };

  // pinch之前设置当前图片的缩放
  onMultipointStart = e => {
    this.currentScale = this.node.scaleX;
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

    this.node.scaleX = this.currentScale * e.scale;
    this.node.scaleY = this.currentScale * e.scale;
  };

  onMultipointEnd = e => {
    if (this.node.scaleX < 1) {
      this.restore(this.node);
    }

    if (this.node.scaleX > this.maxScale) {
      this.setScale(this.node, this.maxScale);
    }
  };

  onSingleTap = () => {
    console.log("single tap");
    this.props.close && this.props.close();
  };

  onPressMove = e => {
    if (!this.focus) {
      return;
    }
    console.log("onPressMove");
    const { deltaX, deltaY } = e;
    const { scaleX, width } = this.node;

    if (scaleX <= 1 || e.touches.length > 1) {
      return;
    }

    if (this.checkBoundary(deltaX, deltaY)) {
      this.node.translateX += deltaX;
      this.node.translateY += deltaY;
    }
  };

  checkBoundary = (deltaX, deltaY) => {
    const {
      translateX,
      translateY,
      scaleX,
      scaleY,
      originX,
      originY,
      width,
      height
    } = this.node;

    const rangeLeft = (scaleX - 1) * (width / 2 + originX) + originX;
    const rangeRight = -(scaleX - 1) * (width / 2 - originX) + originX;
    const rangeTop = (scaleY - 1) * (height / 2 + originY) + originY;
    const rangeBottom = -(scaleY - 1) * (height / 2 - originY) + originY;

    const nextX = translateX + deltaX;
    const nextY = translateY + deltaY;
    return (
      nextX <= rangeLeft &&
      nextX >= rangeRight &&
      nextY <= rangeTop &&
      nextY >= rangeBottom
    );
  };

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

    this.setState({ current });

    this.swipeTo(current);
  };

  // init bind image style, add transform support
  bindStyle(i) {
    const node = this.getNode(i);
    this.restore(node);
    window.Transform(node);
  }

  swipeTo(current, ease = true) {
    if (ease) {
      this.ul.style.transition = "300ms ease";
    }
    this.ul.translateX = -current * (this.state.wrapperWidth + gap);

    // ease hide page number
    clearTimeout(this.pageHideTimeout);
    const { page } = this.refs;
    page.classList.remove("hide");
    this.pageHideTimeout = setTimeout(() => {
      page.classList.add("hide");
    }, 2000);
  }

  setScale = (node, size) => {
    node.style.transition = "300ms ease-in-out";
    node.scaleX = size;
    node.scaleY = size;
  };

  restore(node) {
    node.translateX = 0;
    node.translateY = 0;
    node.scaleX = 1;
    node.scaleY = 1;
    node.originX = 0;
    node.originY = 0;
  }

  endAnimation() {
    this.ul.style.transition = "0";
    this.node && this.node.style && (this.node.style.transition = "0");
  }
}

export const SingleImageView = new Singleton(ImageView);

export default ImageView;
