import React, { Component } from 'react';
import Steps, { Step } from 'rc-steps';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner';

class TrackingShipping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        }
    }

    render() {
        let body = <div className="loading-tracking"><Loader type="Plane"></Loader></div>

        // let steps = <Step
        //     // key={index}
        //     // title={value.statusName}
        //     // description={desc}
        // />;

        if (!this.props.isTracking && this.props.isTrackingValid) {
            
            let steps = this.props.data.manifestArray.reverse().map((value, index) => {

                let desc = <>
                    <span>{value.date} WIB</span>
                </>

                return <Step
                    key={index}
                    title={value.desc}
                    description={desc}
                />
            });

            body = <div className="tracking-ui-wrapper">
                <div className="tracking-header">
                    <img width="100" src="https://res.cloudinary.com/blst/image/upload/v1554457731/slider/Icon-send-packet-ipbpress-small.png" alt="" />
                    <div className="tracking-basic-info">
                        <small>Nomor Resi</small>
                        <h3>{this.props.data.no_resi}</h3>
                    </div>
                </div>
                <div className="tracking-body">
                    <Steps current={this.props.data.manifestArray.length-1} direction="vertical">
                        {steps}
                    </Steps>
                </div>
            </div>
        }else if(!this.props.isTracking && !this.props.isTrackingValid){
            body = <div>
                <span>Invalid waybill. Resi yang Anda masukkan salah atau belum terdaftar.</span>
            </div>
        }

        return (
            <>
                {body}
            </>
        );
    }
}

export default TrackingShipping;