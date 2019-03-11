import React, { Component } from 'react';
import {
    Input,
    Button,
} from "reactstrap";
import Moment from 'react-moment';
import 'moment/locale/id';
import { ConfirmSend, ListOrderDetail } from '../../api/index';



class OrderCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isCollapse: false,
            isDetailOpen: false,
            isInputResiOpen: false,
            isbackdropOpen: false,
            noResi: null,
            data: null
        }
    }

    fetchData(){
        const content = {
            transactionId: this.props.OrderProps.transactionId
        }
        ListOrderDetail(content).then(res => {           
            this.setState({ data: res.result[0] })
        }).catch(err => {
            console.log(err)
        })
    }

    componentDidMount() {
       this.fetchData();
    }

    detailHandler = (event) => {
        event.preventDefault();
        this.setState({ isDetailOpen: !this.state.isDetailOpen, isbackdropOpen: true })
    }

    inputResiHandler = (event) => {
        event.preventDefault();
        this.setState({ isInputResiOpen: !this.state.isInputResiOpen, isbackdropOpen: !this.state.isbackdropOpen })
    }

    formatuang(amount) {
        if (amount === null) {
            amount = 0;
        }
        // deletecomma
        let comadel = amount.toString().replace(/\,/g, '');
        let price = comadel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
        return price;
    }

    onSubmitResi = (event, transactionId, value) => {
        const content = {
            no_resi: value,
            transactionId: transactionId
        }

        ConfirmSend(content).then(res => {
            if (res.status === "success") {
                this.setState({ isInputResiOpen: false, isbackdropOpen: false },()=>{this.fetchData()})
            }
        }).catch(err => { console.log(err) })

    }


    render() {

        let otdProduct = null;

        if (this.state.data !== null) {
            otdProduct = this.state.data.OrderProducts.map((value, index) => (
                <div className="otd-product" key={index}>
                    <div className="pict">
                        <img src={value.Product.Pictures[0].url_small} alt="" />
                    </div>
                    <div className="desc">
                        {value.Product.name} <strong>x {value.qty} pcs</strong>
                    </div>
                    <div className="totalPrice">Rp {this.formatuang(value.subtotal)}</div>
                </div>
            ))
        }

        return (
            <>
                {this.state.data !== null ? (
                    <>
                    
                        <div className={this.state.isCollapse ? "otd-dard-header-short yellow" : "otd-dard-header-short"} onClick={() => { this.setState({ isCollapse: !this.state.isCollapse }) }}>
                            <div>{this.state.data.invoiceNumber}</div>
                            <div>{this.state.data.Customer.email}</div>
                            <div><strong>{this.state.data.courier} ({this.state.data.etd})</strong></div>
                            <div><Button size="sm" style={{ margin: '0', background: this.state.data.StatusOrder.color }}>{this.state.data.StatusOrder.statusName}</Button></div>
                            <div>{this.state.data.no_resi}</div>
                            <div></div>
                        </div>
                        <div className={this.state.isCollapse ? "otd-card otd-open" : "otd-card"}>
                            <div className="otd-card-description">
                                <h5>No Order: {this.state.data.invoiceNumber} <Button onClick={(event) => { this.detailHandler(event) }} size="sm" style={{ fontSize: '7pt' }}>Detail</Button> </h5>
                                {this.state.isbackdropOpen ? (
                                    <div className="backdrop" onClick={() => { this.setState({ isDetailOpen: false, isInputResiOpen: false, isbackdropOpen: false }) }}></div>
                                ) : null}
                                <div className={this.state.isDetailOpen ? "otd-dtail-order-wrapper otd-opened" : "otd-dtail-order-wrapper"}>
                                    <div className='otd-dtail-inner'>
                                        <div className="close-button" onClick={() => { this.setState({ isDetailOpen: false, isbackdropOpen: false }) }}><i className="nc-icon nc-simple-remove" /></div>

                                        <div className="otd-header-product">{this.state.data.OrderProducts.length} jenis Produk </div>
                                        {otdProduct}

                                    </div>
                                </div>

                                <div className="otd-p-info">Nilai Total : <strong> Rp. {this.formatuang(this.state.data.subtotal)}</strong></div>
                                <div className="otd-p-info">Metode Pembayaran :<br></br> <strong> {this.state.data.Bank.bankname} a.n {this.state.data.Bank.an}</strong></div>
                                <div className="shipment-info-wrapper">
                                    <div className="descri">Nomor Resi: <strong>{this.state.data.no_resi}</strong> </div>
                                    <div className="descri">Shipping Service: <strong>{this.state.data.courier} ({this.state.data.etd})</strong></div>
                                    <div className="descri">Ongkos Kirim: <strong>Rp 15.000</strong></div>
                                    <Button onClick={(event) => { this.inputResiHandler(event) }} size="sm" style={{ fontSize: '7pt' }}><i className="nc-icon nc-send" /> Input Resi</Button>
                                </div>
                            </div>
                            <div className="otd-timeline-process">
                                <div className={this.state.isInputResiOpen ? "inpr-wrapper inpr-wrapper-open" : "inpr-wrapper"}>
                                    <div className="descri">Shipping Service: <strong>{this.state.data.courier} ({this.state.data.etd})</strong></div>
                                    <div className="descri">No Order: <strong>{this.state.data.invoiceNumber}</strong></div>
                                    <Input size="bg" onChange={(event) => { this.setState({ noResi: event.target.value }) }} autoComplete="off" placeholder="Nomor Resi"></Input>
                                    <Button onClick={(event) => this.onSubmitResi(event, this.state.data.transactionId, this.state.noResi)} color="danger">Update Resi Pengiriman</Button>
                                </div>

                                <div className={this.state.data.status >= 1 ? "chip red" : "chip"} ><strong>Pesanan dibuat</strong><br></br><small> {this.state.data.createdAt !== null ? (<Moment fromNow={true} locale="id" format="LLLL">{this.state.data.createdAt}</Moment>) : null} </small> </div>
                                <div className={this.state.data.status >= 1 ? "chip yellow" : "chip"} ><strong>Pembayaran dikonfirmasi</strong><br></br><small> {this.state.data.dateconfirm !== null ? (<Moment fromNow={true} locale="id" format="LLLL">{this.state.data.dateconfirm}</Moment>) : null} </small> </div>
                                <div className={this.state.data.status >= 2 ? "chip blue" : "chip"} ><strong>Pesanan diproses</strong><br></br><small> {this.state.data.dateproses !== null ? (<Moment fromNow={true} locale="id" format="LLLL">{this.state.data.dateproses}</Moment>) : null} </small> </div>
                                <div className={this.state.data.status >= 3 ? "chip green" : "chip"} ><strong>Pesanan dikirim</strong><br></br><small> {this.state.data.datesend !== null ? (<Moment fromNow={true} locale="id" format="LLLL">{this.state.data.datesend}</Moment>) : null} </small> </div>
                                <div className={this.state.data.status >= 4 ? "chip blue-light" : "chip"}><strong>Pesanan diterima</strong><br></br><small> {this.state.data.datereceived !== null ? (<Moment fromNow={true} locale="id" format="LLLL">{this.state.data.datereceived}</Moment>) : null} </small> </div>
                            </div>
                            <div className="otd-card-shipment">
                                <h4>Alamat Pengiriman</h4>
                                <strong>{this.state.data.Address_Customer.shipTo}</strong>
                                <p>{this.state.data.Address_Customer.address1 + ", " + this.state.data.Address_Customer.city + ", " + this.state.data.Address_Customer.subdistrict + ", " + this.state.data.Address_Customer.province}</p>
                            </div>
                        </div>
                    </>

                ) : null}
            </>
        )
    }
}

export default OrderCard;