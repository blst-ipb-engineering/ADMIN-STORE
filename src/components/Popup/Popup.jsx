import React, { Component } from 'react';

class Popup extends Component {
    render() {
        return (
            <div style={(this.props.isLacak) ? {position:'fixed'} : null} className={!this.props.isOpen ? "popup-wrapper hide" : "popup-wrapper"} >
                <div className="popup-card">
                    <div className="popup-header">
                        <div>{this.props.headerTitle}</div>
                        <i onClick={(event) => this.props.onClosePopupHandler(event)} className="fas fa-times"></i>
                    </div>
                    <div className="popup-body">
                        {this.props.body}
                    </div>
                    <div className="popup-footer">
                        {/* <div>Footer</div> */}
                    </div>
                </div>
                <div onClick={(event) => this.props.onClosePopupHandler(event)} className="backdrop"></div>
            </div>
        )
    }
}

export default Popup;