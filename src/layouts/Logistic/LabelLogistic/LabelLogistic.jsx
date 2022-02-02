import React, { useEffect, useState } from 'react';
import './LabelLogistic.scss';
import { ListOrderDetail } from '../../../api';
import Barcode from 'react-barcode';
import PrintIcon from '../../../assets/img/print-icon.png';

const LabelLogistic = (props) => {

    const [data, setData] = useState(null);
    const [maxProductRender, setMaxProductRender] = useState(5);

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

    const formatuang = (amount) => {
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
        height: 40,
        font: "sans-serif",
        fontSize: 18
    }

    let otdProduct = null;
    let otdProduct7 = null;
    let ButtonCondition = null;


    if (data !== null && data.result !== null) {
        // console.log(this.state.data)
        if (data.result.OrderProducts.length < maxProductRender) { // batas label print 15 cm, jadinya panjang jadi lanjutannya ada di sticker kedua
            otdProduct = data.result.OrderProducts.map((value, index) => {

                if (index < maxProductRender) {
                    return <tr>
                        <td style={{ paddingRight: '5px' }}>
                            <img width="30" src={value.Product !== null ? value.Product.Pictures[0].url_small : null} alt="" />
                        </td>
                        <td>{value.Product.name}</td>
                        <td style={{ paddingLeft: '5px' }}>{value.qty}</td>
                    </tr>
                }

            })
        } else {
            otdProduct = data.result.OrderProducts.map((value, index) => {

                if (index < maxProductRender) {
                    return <tr>
                        <td style={{ paddingRight: '5px' }}>
                            <img width="30" src={value.Product !== null ? value.Product.Pictures[0].url_small : null} alt="" />
                        </td>
                        <td>{value.Product.name}</td>
                        <td style={{ paddingLeft: '5px' }}>{value.qty}</td>
                    </tr>
                }

            })

            otdProduct7 = data.result.OrderProducts.map((value, index) => {

                if (index >= maxProductRender) {
                    return <tr>
                        <td style={{ paddingRight: '5px' }}>
                            <img width="30" src={value.Product !== null ? value.Product.Pictures[0].url_small : null} alt="" />
                        </td>
                        <td>{value.Product.name}</td>
                        <td style={{ paddingLeft: '5px' }}>{value.qty}</td>
                    </tr>
                }

            })
        }




    }

    return (
        <div>
            <div className="no-print button-print" onClick={() => window.print()}>
              <img src={PrintIcon} width="50" alt=""/>  Cetak
            </div>
            {data !== null && (
                <>
                    <div className="label-send-wrapper">
                        <div className="header-brand">
                            <img src={data.result.Company.logo} height="50" alt="" />
                            <h3>Label Pengiriman</h3>
                        </div>
                        <div className="line-sparator"></div>
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
                            </div>
                            <div className="barcode-shipment">
                                <Barcode value={data.result.transactionId} {...barcodeOptions} />
                                <small><i>Kode Transaksi ini Bukan Resi Pengiriman</i></small>
                            </div>
                        </div>
                        <div className="line-sparator"></div>
                        <div className="address-wrapper">
                            <table width="100%">
                                <tr>
                                    <td>
                                        <p>Kepada:</p>
                                        <b ><strong>{data.result.Address_Customer.shipTo}</strong><br /></b>
                                        <p>{data.result.Address_Customer.address1}</p>
                                        <p>
                                            {data.result.Address_Customer.city}, {data.result.Address_Customer.subdistrict}, {data.result.Address_Customer.province}
                                        </p>
                                        <p>{data.result.Address_Customer.phone}</p>
                                    </td>
                                </tr>

                                {data.result.OrderProducts.length <= 4 && (
                                    <>
                                        <tr>
                                            <td><br /></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p>Dari:</p>
                                                <b ><strong>{data.result.Company.companyName}</strong><br /></b>
                                                <p>{data.result.Company.address}</p>
                                                <p>{data.result.Company.phone}</p>
                                            </td>
                                        </tr>
                                    </>
                                )}

                            </table>
                        </div>
                        <div className="line-sparator"></div>
                        <div className="product-wrapper">
                            <table width="100%">
                                <tr>
                                    <td colspan="3">
                                        Produk ({data.result.OrderProducts.length})
                                </td>
                                </tr>
                                {otdProduct}
                            </table>
                        </div>
                    </div>

                    {
                        data.result.OrderProducts.length > maxProductRender && (
                            <div className="label-send-wrapper" >

                                <table width="100%">
                                    {otdProduct7}
                                </table>
                                <Barcode value={data.result.transactionId} {...barcodeOptions} />
                            </div>
                        )
                    }

                </>
            )}
        </div>
    )

}

export default LabelLogistic;