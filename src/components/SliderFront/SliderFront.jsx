import React, { Component } from "react";
import { Container } from "reactstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class SliderFront extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const setting = {
      dots: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: true,
      // centerMode: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 480,
          vertical: true,
          verticalSwiping: true
        }
      ]
    };

    let slide =
      <div className="item-slider-wrapper">
        <div
          className="loading-background"
          style={{ width: "100%", height: "255px" }}
        />
      </div>;

    if (this.props.SliderPreview.length !== 0) {
      slide = this.props.SliderPreview.map((value, index) => (
        <div className="item-slider-wrapper" key={index}>
          <div
            className="loading-slider"
            style={{
              width: "100%",
              background:
                'url("' + value.slidebar + '")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          />
        </div>
      ));
    }

    let static_1 = <div
      className="loading-slider loading-background static-slider"
      style={{
        width: "100%",
      }}
    />;

    let static_2 = <div
      className="loading-slider loading-background static-slider"
      style={{
        width: "100%",
      }}
    />;
    // console.log(this.props.StaticSliderPreview +" ---- "+ this.props.SliderPreview)

    if (this.props.StaticSliderPreview.length > 0) {
      static_1 = this.props.StaticSliderPreview.slice(0, 1).map((value, index) => (
        <div
          className="loading-slider static-slider"
          style={{
            width: "100%",
            background:
              'url("' + value.slidebar + '")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
      ))

      
      if(this.props.StaticSliderPreview.slice(1,2).length > 0){
        static_2 = this.props.StaticSliderPreview.slice(1,2).map((value,index)=> (
          <div
          className="loading-slider static-slider"
          style={{
            width: "100%",
            background:
              'url("' + value.slidebar + '")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        />
        )) 
      }            
    }

    return (
      <Container>
        <div className="slider-wrapper">
          <div className="inner-container-slider">
            <div className="main-slider">
              <Slider {...setting}>
                {slide}                
              </Slider>
            </div>
            <div className="promo-static-slider">
              <div className="static-slider-item">
                {static_1}
              </div>
              <div className="static-slider-item">
                {static_2}
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default SliderFront;
