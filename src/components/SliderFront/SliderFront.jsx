import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



class SliderFront extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
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
            responsive: [{
                breakpoint: 480,
                vertical: true,
                verticalSwiping: true,
            }]
        }

        return (
            <Container>
                <div className="slider-wrapper">
                    <div className="inner-container-slider">
                        <div className="main-slider">
                            {/* <img width="740" src="https://ipbstore.com/wp-content/uploads/2019/01/HP-FE-3-1.png" alt=""/> */}
                            {/* <div className="loading-slider" style={{ width: '685px', height: '255px' }}></div> */}
                            <Slider {...setting}>
                                <div className="item-slider-wrapper">
                                    <div
                                        className="loading-slider"
                                        style={{
                                            width: '100%',
                                            background: 'url("https://ipbstore.com/wp-content/uploads/2019/01/HP-FE-3-1.png")',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                        }}>
                                    </div>
                                </div>
                                <div className="item-slider-wrapper">
                                    <div className="loading-slider" style={{ width: '100%' }}></div>
                                </div>
                            </Slider>
                        </div>
                        <div className="promo-static-slider">
                            <div className="static-slider-item">
                                <div
                                    className="loading-slider static-slider"
                                    style={{
                                        width: '100%',
                                        background: 'url("https://ipbstore.com/wp-content/uploads/2019/01/HP-FE-3-1.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                </div>
                                {/* <img src="" alt=""/> */}
                            </div>
                            <div className="static-slider-item">
                                {/* <img src="" alt=""/> */}
                                <div
                                    className="loading-slider static-slider"
                                    style={{
                                        width: '100%',
                                        background: 'url("https://ipbstore.com/wp-content/uploads/2019/01/HP-FE-3-1.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Container>
        )
    }
}

export default SliderFront;