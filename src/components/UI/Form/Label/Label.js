import React from 'react';
import './Label.css';


export const Label = (props) => {  
  let required = null;
  if(props.required){
    required=<span className="required-label">Required</span>;
  }
  return (
  <div className="label-wrapper">
    <span className="label">{props.children}</span> 
    {required}
  </div>
  )
  
}
;
