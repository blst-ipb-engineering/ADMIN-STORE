import React from 'react';

const Terlaris = (props) => {

    return (
        <div className="terlaris-wrapper">
            <ul>
                {props.data !== null ? props.data.map((value, index) => (
                    <li key={index}>
                        <div className="image">            
                            <div className="star">{index+1}</div>               
                            <img src={value.url} alt="" />
                        </div>
                        <div className="description">
                           
                            <div className="title">{value.name}</div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            Terjual:
                                        </td>
                                        <td>
                                            <b>{value.total_qty}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Customer:
                                        </td>
                                        <td>
                                            <b>{value.freq}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>                           
                        </div>
                    </li>
                )) : null}
            </ul>
        </div>
    )
}

export default Terlaris;