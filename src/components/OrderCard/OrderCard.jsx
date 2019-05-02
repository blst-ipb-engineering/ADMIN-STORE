import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Input,
    Button,
} from "reactstrap";
import Moment from 'react-moment';
import 'moment/locale/id';
import { ConfirmSend, ListOrderDetail, TakeThisOrder, TrackingShip } from '../../api/index';
import { ToastContainer, toast } from 'react-toastify';
import Popup from '../Popup/Popup';
import TrackingShipping from '../TrackingShipping/TrackingShipping';




class OrderCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isCollapse: false,
            isDetailOpen: false,
            isInputResiOpen: false,
            isbackdropOpen: false,
            noResi: null,
            data: null,
            isPopUpOpen: false,
            tracking: null,
            isTracking: false
        }
    }

    fetchData() {
        const content = {
            transactionId: this.props.OrderProps.transactionId
        }

        ListOrderDetail(content).then(res => {
            if (res) {
                this.setState({ data: res.result })
            }
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
        let comadel = amount.toString().replace(/,/g, '');
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
                this.setState({ isInputResiOpen: false, isbackdropOpen: false }, () => { this.fetchData() })
            }
        }).catch(err => { console.log(err) })
    }

    takeItHandler = (e, invNumber) => {
        e.stopPropagation();
        const content = {
            invoiceNumber: invNumber
        }
        TakeThisOrder(content).then(result => {
            this.setState((prevState) => ({
                data: {
                    ...prevState.data,
                    prosesBy: result.data.prosesBy,
                    dateproses: result.data.dateproses
                }
            }))
            toast.success("Selamat bertugas 👍🏻" + result.data.prosesBy + " Segera input nomor resi jika sudah mengirimkannya");

            console.log(result);
        }).catch(err => {
            console.log(err)
        })
    }


    handleTrackingClick(e) {
        e.preventDefault();
        this.setState({ isPopUpOpen: true, isTracking: true })
        const content = {
            id: this.state.data.id
        }

        TrackingShip(content).then(res => {
            this.setState({ tracking: res }, () => {
                this.setState({ isTracking: false })
            })
        })

    }

    togglePopup = (event) => {
        event.preventDefault();
        this.setState({ isPopUpOpen: false })
    }


    render() {

        let otdProduct = null;
        let ButtonCondition = null;


        if (this.state.data !== null) {
            // console.log(this.state.data)
            otdProduct = this.state.data.OrderProducts.map((value, index) => (
                <div className="otd-product" key={index}>
                    <div className="pict">
                        <img src={value.Product !== null ? value.Product.Pictures[0].url_small : null} alt="" />
                    </div>
                    <div className="desc">
                        {value.Product.name} <strong>x {value.qty} pcs</strong>
                    </div>
                    <div className="totalPrice">Rp {this.formatuang(value.subtotal)}</div>
                </div>
            ))
        }

        // untuk menampilkan logic pada sebelah kanan (Button Take It, Process By, Nomor Resi)
        if (this.state.data !== null) {
            if (this.state.data.prosesBy !== null && this.state.data.no_resi == null) {
                ButtonCondition = <small><strong>Diproses : </strong>{this.state.data.prosesBy} <br></br> <Moment fromNow>{this.state.data.dateproses}</Moment></small>
            } else if (this.state.data.status > 1 && this.state.data.status < 5 && this.state.data.prosesBy == null && this.state.data.no_resi == null) {
                ButtonCondition = <Button onClick={(e) => this.takeItHandler(e, this.state.data.invoiceNumber)} style={{ margin: '0', width: '100%', borderRadius: '0px' }} size="lg" className="take-it-background">PROSES</Button>;
            } else if (this.state.data.status == 1 && new Date(this.state.data.expireDate) > new Date()) {
                ButtonCondition = <div style={{ marginLeft: '10px', textAlign: 'center' }}>Batas Pembayaran : <Moment fromNow>{this.state.data.expireDate}</Moment></div>;
            } else if (this.state.data.status == 1 && new Date(this.state.data.expireDate) < new Date()) {
                ButtonCondition = <Button onClick={(e) => this.props.DeclineItHandler(e, this.state.data.invoiceNumber)} style={{ margin: '0', borderRadius: '0px' }} size="lg" className="take-it-background">BATAL</Button>;
            } else if (this.state.data.status == 5){
                ButtonCondition = <span>Waktu tenggat pembayaran sudah habis</span>
            } 
            else {
                ButtonCondition = this.state.data.no_resi;
            }
        }

        let tracking_body = <>
            <TrackingShipping
                isTracking={this.state.isTracking}
                data={this.state.tracking} />
        </>


        return (
            <>                
                <Popup 
                    onClosePopupHandler={this.togglePopup}
                    isOpen={this.state.isPopUpOpen}
                    headerTitle={"Lacak Pengiriman"}
                    body={tracking_body}
                    isLacak={true}
                />
                {this.state.data !== null ? (
                    <>

                        <div className={this.state.isCollapse ? "otd-dard-header-short yellow" : "otd-dard-header-short"} onClick={() => { this.setState({ isCollapse: !this.state.isCollapse }) }}>
                            <div className="col1">{this.state.data.invoiceNumber}</div>
                            <div className="col2">{this.state.data.Customer.email}</div>
                            <div className="col3"><strong>{this.state.data.courier} ({this.state.data.etd})</strong></div>
                            <div className="col4"><Button size="sm" style={{ margin: '0', borderRadius: '23px', background: this.state.data.StatusOrder.color }}>{this.state.data.StatusOrder.statusName}</Button></div>
                            <div className="col5" style={{ textAlign: 'center' }}>
                                {ButtonCondition}
                            </div>
                            <div className="col6"></div>
                        </div>
                        <div className={this.state.isCollapse ? "otd-card otd-open" : "otd-card"}>
                            <div className="otd-card-description">
                                <h5>No Order: {this.state.data.invoiceNumber} <Button onClick={(event) => { this.detailHandler(event) }} size="sm" style={{ fontSize: '7pt' }}>Detail</Button> </h5>
                                {this.state.isbackdropOpen ? (
                                    <div className="backdrop" onClick={() => { this.setState({ isDetailOpen: false, isInputResiOpen: false, isPopUpOpen: false, isbackdropOpen: false }) }}></div>
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
                                    <div className="descri">Ongkos Kirim: <strong>Rp {this.formatuang(this.state.data.value)}</strong></div>

                                    {this.props.auth.companyId == this.state.data.companyId ? (
                                        <Button onClick={(event) => { this.inputResiHandler(event) }} size="sm" style={{ fontSize: '7pt' }}> {this.state.data.no_resi == null ? "Input Resi" : "Update Resi"}</Button>
                                    ) : null}

                                    {this.state.data.no_resi !== null ? (
                                        <Button onClick={(e) => this.handleTrackingClick(e)} size="sm" style={{ fontSize: '7pt' }}><i className="nc-icon nc-send" /> Lacak </Button>
                                    ) : null}

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
                                <h5 style={{ margin: '0px' }}><strong>{this.state.data.Address_Customer.shipTo}</strong><br /></h5>
                                <strong>{this.state.data.Address_Customer.phone}</strong>
                                <p>{this.state.data.Address_Customer.address1 + ", " + this.state.data.Address_Customer.city + ", " + this.state.data.Address_Customer.subdistrict + ", " + this.state.data.Address_Customer.province}</p>
                            </div>
                        </div>
                    </>

                ) : null}
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.authsd
    }
};

export default connect(mapStateToProps)(OrderCard);