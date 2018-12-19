import React from 'react';
import './Product.css';

const Products = (props) => (
    <tr key={props.key}>
        {/* Check */}
        <td>

        </td>
        {/* Product */}
        <td>
            <div className="products-list-container">
                <h3 >{props.produk.name}</h3>
            </div>
        </td>   
        {/* Price    */}
        <td>

        </td>
        {/* Stock */}
        <td>

        </td>
        {/* Edit Publish */}
        <td>
            
        </td>
    </tr>
);

export default Products;
