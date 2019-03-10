import React, { Component } from 'react';
import {
    Input,
    Button,
} from "reactstrap";


class OrderCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isDetailOpen: false,
            isInputResiOpen: false,
            isbackdropOpen:false,
        }
    }

    detailHandler = (event) => {
        event.preventDefault();
        this.setState({ isDetailOpen: !this.state.isDetailOpen,isbackdropOpen:true })
    }

    inputResiHandler = (event) => {
        event.preventDefault();
        this.setState({ isInputResiOpen: !this.state.isInputResiOpen,isbackdropOpen:!this.state.isbackdropOpen })
    }


    render() {

        return (
            <div className="otd-card">
                <div className="otd-card-description">
                    <h5>No Pesanan: 20191230343 <Button onClick={(event) => { this.detailHandler(event) }} size="sm" style={{ fontSize: '7pt' }}>Detail</Button> </h5>
                    {this.state.isbackdropOpen ? (
                        <div className="backdrop" onClick={() => { this.setState({ isDetailOpen: false,isInputResiOpen:false, isbackdropOpen:false}) }}></div>
                    ) : null}


                    <div className={this.state.isDetailOpen ? "otd-dtail-order-wrapper otd-opened" : "otd-dtail-order-wrapper"}>
                        <div className='otd-dtail-inner'>
                            <div className="close-button" onClick={() => { this.setState({ isDetailOpen: false,isbackdropOpen:false }) }}><i className="nc-icon nc-simple-remove" /></div>

                            <div className="otd-header-product">Order Total: 5 pcs</div>
                            <div className="otd-product">
                                <div className="pict">
                                    <img src="http://res.cloudinary.com/blst/image/upload/dpr_auto,w_200/q_auto:eco/v1/product/k1mpz0t8hazxl2ydcvas" alt="" />
                                </div>
                                <div className="desc">
                                    APLIKASI TEKNIK PENGAMBILAN KEPUTUSAN DALAM MANAJEMEN RANTAI PASOK <strong>x 1 pcs</strong>
                                </div>
                                <div className="totalPrice">Rp 20.000</div>
                            </div>
                            <div className="otd-product">
                                <div className="pict">
                                    <img src="http://res.cloudinary.com/blst/image/upload/dpr_auto,w_200/q_auto:eco/v1/product/k1mpz0t8hazxl2ydcvas" alt="" />
                                </div>
                                <div className="desc">
                                    APLIKASI TEKNIK PENGAMBILAN KEPUTUSAN DALAM MANAJEMEN RANTAI PASOK <strong>x 1 pcs</strong>
                                </div>
                                <div className="totalPrice">Rp 20.000</div>
                            </div>
                            <div className="otd-product">
                                <div className="pict">
                                    <img src="http://res.cloudinary.com/blst/image/upload/dpr_auto,w_200/q_auto:eco/v1/product/k1mpz0t8hazxl2ydcvas" alt="" />
                                </div>
                                <div className="desc">
                                    APLIKASI TEKNIK PENGAMBILAN KEPUTUSAN DALAM MANAJEMEN RANTAI PASOK <strong>x 1 pcs</strong>
                                </div>
                                <div className="totalPrice">Rp 20.000</div>
                            </div>
                            <div className="otd-product">
                                <div className="pict">
                                    <img src="http://res.cloudinary.com/blst/image/upload/dpr_auto,w_200/q_auto:eco/v1/product/k1mpz0t8hazxl2ydcvas" alt="" />
                                </div>
                                <div className="desc">
                                    APLIKASI TEKNIK PENGAMBILAN KEPUTUSAN DALAM MANAJEMEN RANTAI PASOK <strong>x 1 pcs</strong>
                                </div>
                                <div className="totalPrice">Rp 20.000</div>
                            </div>
                            <div className="otd-product">
                                <div className="pict">
                                    <img src="http://res.cloudinary.com/blst/image/upload/dpr_auto,w_200/q_auto:eco/v1/product/k1mpz0t8hazxl2ydcvas" alt="" />
                                </div>
                                <div className="desc">
                                    APLIKASI TEKNIK PENGAMBILAN KEPUTUSAN DALAM MANAJEMEN RANTAI PASOK <strong>x 1 pcs</strong>
                                </div>
                                <div className="totalPrice">Rp 20.000</div>
                            </div>

                        </div>

                    </div>



                    <div className="otd-p-info">Nilai Total : <strong> Rp. 920,000</strong></div>

                    <div className="otd-p-info">Metode Pembayaran :<br></br> <strong> BANK BRI a.n PT PENERBIT IPB PRESS</strong></div>
                    <div className="shipment-info-wrapper">
                        <div className="descri">Nomor Resi: <strong>023231432489247283</strong> </div>
                        <div className="descri">Shipping Service: <strong>JNE YES (3-5)</strong></div>
                        <div className="descri">Ongkos Kirim: <strong>Rp 15.000</strong></div>
                        <Button onClick={(event) => { this.inputResiHandler(event) }} size="sm" style={{ fontSize: '7pt' }}><i className="nc-icon nc-send" /> Input Resi</Button>
                    </div>
                </div>
                <div className="otd-timeline-process">
                    <div className={this.state.isInputResiOpen ? "inpr-wrapper inpr-wrapper-open" : "inpr-wrapper"}>                    
                            <div className="descri">Shipping Service: <strong>JNE YES (3-5)</strong></div>                        
                            <Input size="bg" autoComplete="off" placeholder="Nomor Resi"></Input>
                            <Button color="danger">Update Resi Pengiriman</Button>
                    </div>

                    <div className="chip red"><strong>Pesanan dibuat</strong><br></br><small>Jumat 23 Januari 2019 Pukul 16:02 WIB</small> </div>
                    <div className="chip yellow"><strong>Pembayaran dikonfirmasi</strong><br></br><small>Jumat 23 Januari 2019 Pukul 16:02 WIB</small> </div>
                    <div className="chip blue"><strong>Pesanan diproses</strong><br></br><small>Jumat 23 Januari 2019 Pukul 16:02 WIB</small> </div>
                    <div className="chip green"><strong>Pesanan dikirim</strong><br></br><small>Jumat 23 Januari 2019 Pukul 16:02 WIB</small> </div>
                    <div className="chip blue-light"><strong>Pesanan diterima</strong><br></br><small>Jumat 23 Januari 2019 Pukul 16:02 WIB</small> </div>
                </div>
                <div className="otd-card-shipment">
                    <h4>Alamat Pengiriman</h4>
                    <strong>Fulan</strong>
                    <p>Perumahan Bukit IPB Press Jalan Institut Pertanian Bogor, No 99 Kabupaten Bojonegoro, Jawa Timur, Republik Indonesia</p>
                </div>
            </div>
        )
    }
}

export default OrderCard;