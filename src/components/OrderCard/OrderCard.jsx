import React, { Component } from 'react';
import {
    Input,
    Button,
} from "reactstrap";
import Moment from 'react-moment';
import 'moment/locale/id';
import { ConfirmSend } from '../../api/index';



class OrderCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isCollapse: false,
            isDetailOpen: false,
            isInputResiOpen: false,
            isbackdropOpen: false,
            noResi:null
        }
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

    onSubmitResi = (event,transactionId,value)=>{
        const content = {
            no_resi:value,
            transactionId:transactionId
        }

        ConfirmSend(content).then(res=>{
            if(res.status === "success"){
                this.setState({ isInputResiOpen: false, isbackdropOpen: false})                
            }
        }).catch(err=>{console.log(err)})

    }


    render() {
       
        let otdProduct = null;

        otdProduct = this.props.OrderProps.OrderProducts.map((value, index) => (
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

        return (
            <>
                <div className={this.state.isCollapse ? "otd-dard-header-short yellow" : "otd-dard-header-short"} onClick={() => { this.setState({ isCollapse: !this.state.isCollapse }) }}>
                    <div>{this.props.OrderProps.invoiceNumber}</div>
                    <div>{this.props.OrderProps.Customer.email}</div>
                    <div><strong>{this.props.OrderProps.courier} ({this.props.OrderProps.etd})</strong></div>
                    <div><Button size="sm" style={{ margin: '0', background: this.props.OrderProps.StatusOrder.color }}>{this.props.OrderProps.StatusOrder.statusName}</Button></div>
                    <div>{this.props.OrderProps.no_resi}</div>
                    <div></div>
                </div>
                <div className={this.state.isCollapse ? "otd-card otd-open" : "otd-card"}>
                    <div className="otd-card-description">
                        <h5>No Order: {this.props.OrderProps.invoiceNumber} <Button onClick={(event) => { this.detailHandler(event) }} size="sm" style={{ fontSize: '7pt' }}>Detail</Button> </h5>
                        {this.state.isbackdropOpen ? (
                            <div className="backdrop" onClick={() => { this.setState({ isDetailOpen: false, isInputResiOpen: false, isbackdropOpen: false }) }}></div>
                        ) : null}
                        <div className={this.state.isDetailOpen ? "otd-dtail-order-wrapper otd-opened" : "otd-dtail-order-wrapper"}>
                            <div className='otd-dtail-inner'>
                                <div className="close-button" onClick={() => { this.setState({ isDetailOpen: false, isbackdropOpen: false }) }}><i className="nc-icon nc-simple-remove" /></div>

                                <div className="otd-header-product">{this.props.OrderProps.OrderProducts.length} jenis Produk </div>
                                {otdProduct}

                            </div>
                        </div>

                        <div className="otd-p-info">Nilai Total : <strong> Rp. {this.formatuang(this.props.OrderProps.subtotal)}</strong></div>
                        <div className="otd-p-info">Metode Pembayaran :<br></br> <strong> {this.props.OrderProps.Bank.bankname} a.n {this.props.OrderProps.Bank.an}</strong></div>
                        <div className="shipment-info-wrapper">
                            <div className="descri">Nomor Resi: <strong>{this.props.OrderProps.no_resi}</strong> </div>
                            <div className="descri">Shipping Service: <strong>{this.props.OrderProps.courier} ({this.props.OrderProps.etd})</strong></div>
                            <div className="descri">Ongkos Kirim: <strong>Rp 15.000</strong></div>
                            <Button onClick={(event) => { this.inputResiHandler(event) }} size="sm" style={{ fontSize: '7pt' }}><i className="nc-icon nc-send" /> Input Resi</Button>
                        </div>
                    </div>
                    <div className="otd-timeline-process">
                        <div className={this.state.isInputResiOpen ? "inpr-wrapper inpr-wrapper-open" : "inpr-wrapper"}>
                            <div className="descri">Shipping Service: <strong>{this.props.OrderProps.courier} ({this.props.OrderProps.etd})</strong></div>
                            <div className="descri">No Order: <strong>{this.props.OrderProps.invoiceNumber}</strong></div>
                            <Input size="bg" onChange={(event)=>{this.setState({noResi:event.target.value})}} autoComplete="off" placeholder="Nomor Resi"></Input>
                            <Button onClick={(event)=>this.onSubmitResi(event,this.props.OrderProps.transactionId,this.state.noResi)} color="danger">Update Resi Pengiriman</Button>
                        </div>

                        <div className={this.props.OrderProps.status >= 1 ? "chip red" : "chip"} ><strong>Pesanan dibuat</strong><br></br><small> {this.props.OrderProps.createdAt !== null ? (<Moment fromNow={true} locale="id" format="LLLL">{this.props.OrderProps.createdAt}</Moment>) : null} </small> </div>
                        <div className={this.props.OrderProps.status >= 1 ? "chip yellow" : "chip"} ><strong>Pembayaran dikonfirmasi</strong><br></br><small> {this.props.OrderProps.dateconfirm !== null ? (<Moment fromNow={true} locale="id" format="LLLL">{this.props.OrderProps.dateconfirm}</Moment>) : null} </small> </div>
                        <div className={this.props.OrderProps.status >= 2 ? "chip blue" : "chip"} ><strong>Pesanan diproses</strong><br></br><small> {this.props.OrderProps.dateproses !== null ? (<Moment fromNow={true} locale="id" format="LLLL">{this.props.OrderProps.dateproses}</Moment>) : null} </small> </div>
                        <div className={this.props.OrderProps.status >= 3 ? "chip green" : "chip"} ><strong>Pesanan dikirim</strong><br></br><small> {this.props.OrderProps.datesend !== null ? (<Moment fromNow={true} locale="id" format="LLLL">{this.props.OrderProps.datesend}</Moment>) : null} </small> </div>
                        <div className={this.props.OrderProps.status >= 4 ? "chip blue-light" : "chip"}><strong>Pesanan diterima</strong><br></br><small> {this.props.OrderProps.datereceived !== null ? (<Moment fromNow={true} locale="id" format="LLLL">{this.props.OrderProps.datereceived}</Moment>) : null} </small> </div>
                    </div>
                    <div className="otd-card-shipment">
                        <h4>Alamat Pengiriman</h4>
                        <strong>{this.props.OrderProps.Address_Customer.shipTo}</strong>
                        <p>{this.props.OrderProps.Address_Customer.address1+", "+this.props.OrderProps.Address_Customer.city+", "+this.props.OrderProps.Address_Customer.subdistrict+", "+this.props.OrderProps.Address_Customer.province}</p>
                    </div>
                </div>
            </>
        )
    }
}

export default OrderCard;