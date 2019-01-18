import React from 'react';
import {Loadercss} from './Loader.css';

const Loader = (props) => (
    <div className="Loadercss ">
        <div className="bar">
            <div className="circle"></div>
            <p>{props.text}</p>
        </div>  
    </div>
    
)

export default Loader;
