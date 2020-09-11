import React, { useEffect, useState } from 'react';
import './LabelLogistic.scss';
import { ListOrderDetail } from '../../../api';
import Barcode from 'react-barcode';

const LabelLogistic = (props) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        fetchData();

    }, [])

    console.log(data)

    const fetchData = () => {
        const content = {
            transactionId: props.match.params.id
        }


        ListOrderDetail(content).then(res => {
            if (res) {
                setData(res)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const formatuang = (amount) =>{
        if (amount === null) {
            amount = 0;
        }
        // deletecomma
        let comadel = amount.toString().replace(/,/g, '');
        let price = comadel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
        return price;
    }

    const barcodeOptions = {
        width: '1',
        height: 50,
        font: "sans-serif",
        fontSize: 18
    }

    return (
        <div>
            {data !== null && (
                <div className="label-send-wrapper">
                    <div className="header-brand">
                        <img src={data.result.Company.logo} height="50" alt="" />
                        <h3>Label Pengiriman</h3>
                    </div>
                    <div className="shipment-wrapper">
                        <div className="shipment-service-detail">
                            <table width="100%">
                                <tr>
                                    <td>

                                    </td>
                                    <td>
                                        {data.result.courier} <br /> ({data.result.etd})
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>Berat: <br />
                                            <b> {data.result.weight / 1000} kg </b>
                                        </span>
                                    </td>
                                    <td>
                                        <span>
                                            Ongkir: <br />
                                            <b>Rp {formatuang(data.result.value)} </b>
                                        </span>
                                    </td>
                                </tr>
                            </table>
                            <div>

                            </div>
                        </div>
                        <div className="barcode-shipment">
                            <Barcode value={data.result.transactionId} {...barcodeOptions} />
                            <small><i>Kode Transaksi ini Bukan Resi Pengiriman</i></small>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )

}

export default LabelLogistic;