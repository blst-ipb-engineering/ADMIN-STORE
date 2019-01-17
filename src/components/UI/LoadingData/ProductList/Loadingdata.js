import React from 'react';
import './Loadingdata.css';

const LoadingProductAdmin = () => (
    
        <tr>
        {/* Check */}
        <td>

        </td>
        {/* Product */}
        <td>
            <div className="products-display-container">
                <div className="box-media">
                    <div className="loading-pict"></div>
                    {/* <img className="img-frame" src="https://www.most.co.id/tradingv2/Image/ShowImage/40?useDefault=False" alt={this.props.produk.name}></img> */}
                </div>
                <div className="box-short-desc-loading">
                    <div className="product-loading" style={{width:'300px',height:'20px',marginBottom:'8px'}}></div>
                    <div className="product-loading" style={{width:'150px',height:'10px',marginBottom:'8px'}}></div>
                    <div className="product-loading" style={{width:'100px',height:'10px'}}></div>
                </div>                
            </div>
        </td>   
        {/* Price    */}
        <td style={{verticalAlign:'top'}}>
            <div className="product-loading" style={{width:'100px',height:'20px',marginBottom:'8px'}}></div>
        </td>
        {/* Stock */}
        <td style={{verticalAlign:'top',textAlign:'center'}}>
            <div className="product-loading" style={{width:'40px',height:'20px',marginBottom:'8px'}}></div>
        </td>
        {/* Edit Publish */}
        <td  style={{verticalAlign:'top'}}>
            <ul className="icon-manage-product">
                <li>
                    <div className="product-loading" style={{width:'15px',height:'15px',marginBottom:'8px'}}></div>                   
                </li>
                <li>
                    <div className="product-loading" style={{width:'15px',height:'15px',marginBottom:'8px'}}></div>                                     
                </li>
                <li>
                    <div className="product-loading" style={{width:'15px',height:'15px',marginBottom:'8px'}}></div>                                                    
                </li>
                
            </ul>
        </td>
    </tr>
    
)

export default LoadingProductAdmin;