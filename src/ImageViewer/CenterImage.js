import React, { Component } from 'react';

const PRELOADNUM = 3;

export class CenterImage extends Component {
  state = {
    loading: true,
    error: false,
    loaded: false
  };

  render() {
    const { loading, error } = this.state;
    const { index, current, lazysrc } = this.props;
    const img = <img onLoad={this.onImgLoad} src={lazysrc} alt="" />;

    if (loading) {
      return <Loading />;
    }
    
    // init first image, others have been preloaded
    if (index === current) {
      return img;
    }
    
    if (error) {
      return <Error />;
    }

    return img;
  }

  componentDidMount() {
    this.loadImg();
  }

  componentWillReceiveProps() {
    !this.state.loaded && this.loadImg();
  }

  loadImg() {
    const { index, current, lazysrc } = this.props;

    if (lazysrc && index <= current + PRELOADNUM && index >= current - PRELOADNUM) {
      let img = new Image();

      img.src = lazysrc;
      img.onload = () => {
        // this.setState({
        //   loading: false
        // });
      };
      img.onerror = () => {
        this.setState({
          loading: false,
          error: true
        });
      };
    }
  }

  onImgLoad = e => {
    this.setState({ loaded: true });

    const { width, height } = this.props.wrapperProps;

    const target = e.target; // dom img
    const h = target.naturalHeight;
    const w = target.naturalWidth;

    const imgRatio = h / w;
    const wrapperRatio = height / width;

    let imgStyle;

    if (wrapperRatio > 1) {
      // 竖屏
      imgStyle = {
        width: width + 'px',
        height: width * imgRatio + 'px'
      };
      if (h <= height) {
        imgStyle.top = height / 2 - (width * imgRatio) / 2 + 'px';
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

    const s = Object.keys(imgStyle)
      .map(k => `${k}: ${imgStyle[k]}`)
      .join('; ');
    target.setAttribute('style', s);

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
