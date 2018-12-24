import React from 'react';
import './Modal.css'
import Backdrop from '../Backdrop/Backdrop';

const modal = (props) => (
<div>
    <Backdrop clicked={props.modalClose} name={props.name} show={props.show}/>
    <div className="Modal"
        style={{
            transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: props.show ? '1':'0'
        }}
    >
        {props.children}
    </div>
</div>

);

export default modal;