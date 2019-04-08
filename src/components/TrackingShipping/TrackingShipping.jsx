import React, { Component } from 'react';
import Steps, { Step } from 'rc-steps';


class TrackingShipping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        }
    }

    render() {
        let body = <h1>Loading...</h1>

        // let steps = <Step
        //     // key={index}
        //     // title={value.statusName}
        //     // description={desc}
        // />;

        if (!this.props.isTracking && this.props.data !== null) {

            let steps = this.props.data.data.manifest.map((value, index) => {

                let desc = <>
                    <span>{value.manifest_date} {value.manifest_time} WIB</span>
                </>

                return <Step
                    key={index}
                    title={value.manifest_description}
                    description={desc}
                />
            });

            body = <div className="tracking-ui-wrapper">
                <div className="tracking-header">
                    <img width="100" src="https://res.cloudinary.com/blst/image/upload/v1554457731/slider/Icon-send-packet-ipbpress-small.png" alt="" />
                    <div className="tracking-basic-info">
                        <small>Nomor Resi</small>
                        <h3>{this.props.data.data.details.waybill_number}</h3>
                    </div>
                </div>
                <div className="tracking-body">
                    <Steps current={this.props.data.data.manifest.length-1} direction="vertical">
                        {steps}
                    </Steps>
                </div>
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