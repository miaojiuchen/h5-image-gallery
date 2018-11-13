import React, { Component } from "react";

const PRELOAD_NUM = 1;
function shouldLoad(index, current) {
  return index <= current + PRELOAD_NUM && index >= current - PRELOAD_NUM;
}

export class CenterImage extends Component {
  constructor() {
    super();

    this.state = {
      hide: true,
      loading: true,
      error: false
    };

    this.loadSuccess = false;
  }

  componentDidMount() {
    const { index, current } = this.props;
    if (shouldLoad(index, current)) {
      this.loadImg();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (shouldLoad(this.props.index, nextProps.current)) {
      // prevent hidden error items' retrying, only allow next entering item
      this.loadImg(this.state.error && this.props.index !== nextProps.current);
    }
  }

  render() {
    const { loading, error, hide } = this.state;

    if (hide) {
      return null;
    }

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <Error />;
    }

    // imageStyle must be set before rendering
    return (
      <img
        alt=""
        ref={el => (this.image = el)}
        id={this.props.id}
        src={this.props.src}
        style={this.imageStyle}
      />
    );
  }

  // use 'prevent' to stop retry load image for hidden items
  loadImg(prevent = false) {
    if (prevent) {
      return;
    }

    if (this.loadSuccess) {
      return;
    }

    this.setState({ hide: false, error: false, loading: true });

    let img = new Image();

    img.onload = e => {
      this.loadSuccess = true;
      this.imageStyle = this.getImageStyle(e.target);

      this.setState({ loading: false }, () => {
        this.props.onImageLoad(this.image);
      });
    };
    img.onerror = () => {
      this.setState({
        loading: false,
        error: true
      });
    };
    img.src = this.props.src;
  }

  getImageStyle = img => {
    const { width, height } = this.props.wrapperProps;

    const target = img; // dom img
    const h = target.naturalHeight;
    const w = target.naturalWidth;

    const imgRatio = h / w;
    const wrapperRatio = height / width;

    let imgStyle;

    if (wrapperRatio > 1) {
      // 竖屏
      imgStyle = {
        width: width + "px",
        height: width * imgRatio + "px"
      };
      if (h <= height) {
        imgStyle.top = height / 2 - (width * imgRatio) / 2 + "px";
      } else {
        imgStyle.top = 0;
      }
    } else if (wrapperRatio < 1) {
      // TODO: support 横屏
      // imgStyle = {
      //   width: ,
      //   height: height + 'px'
      // };
      // if( w <= width) {
      //   imgStyle.left = width / 2 - (w * height) / h / 2 + 'px';
      // } else {
      //   imgStyle.top = 0;
      // }
    } else {
      // eslint-disable-line
    }

    // const s = Object.keys(imgStyle)
    //   .map(k => `${k}: ${imgStyle[k]}`)
    //   .join("; ");

    return imgStyle;
    // target.setAttribute("style", s);

    // target.setAttribute('rate', 1 / imgRatio);
    // if (imgRatio >= 3.5) {
    //   target.setAttribute('long', true);
    // }
  };
}

const Loading = () => {
  return (
    <div className="spinner">
      <div className="double-bounce1" />
      <div className="double-bounce2" />
    </div>
  );
};

const Error = () => {
  return <div className="errorpage">加载失败</div>;
};
