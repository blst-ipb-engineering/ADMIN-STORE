import React, { Component } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    CardFooter,
    CardTitle,
    Row,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Col
} from "reactstrap";
import Stats from "../../components/Stats/Stats.jsx";
import { Label } from '../../components/UI/Form/Label/Label';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { ListPayment, ConfirmPayment } from '../../api/index'
import { toast } from 'react-toastify';
import Moment from 'react-moment';
import 'moment/locale/id';



class PaymentConfrimation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectBy: { id: 1, value: 'Jumlah Transfer', label: 'Jumlah Transfer' },
            selectByOptions: [
                { id: 1, value: 'Jumlah Transfer', label: 'Jumlah Transfer' },
                { id: 2, value: 'Nomor Invoice', label: 'Nomor Invoice' },
            ],
            paymentDate: new Date(),
            value: null,
            isFetching: false,
            data: null,
            modal: false,
            SelectedData: null,
        }
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

    onChangeMoneyHandler = (event) => {

        // validasi input tidak boleh huruf
        let values = event.target.value.toString().replace(/\,/g, '');

        // let isNum = /^\d+$/.test(values); // tanpakoma
        let isNum = /^[0-9]+\.?[0-9]*$/.test(values); // dengan koma output true or false                 

        let key = event.target.name;
        if (isNum || event.target.value === null) {
            this.setState({ [key]: parseInt(values) }, () => { this.fetchOrderCard() })
        }
        else if (values.length <= 1) {
            this.setState({ [key]: parseInt(0) })
        }

    }

    fetchOrderCard = () => {
       
        const content = {
            searchby: this.state.selectBy.id,
            value: this.state.value
        }

        if (this.state.value !== null && this.state.value > 1) {
            this.setState({ isFetching: true })
            ListPayment(content).then(res => {
                this.setState({ data: res, isFetching: false })
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    onConfirmationButton = (event, value) => {
        event.preventDefault();

        this.setState({
            modal: true,
            SelectedData: value
        })
    }

    confirmAction = (event, data) => {
        event.preventDefault();
        const content = {
            transactionId: this.state.SelectedData.transactionId,
            invoiceNumber: this.state.SelectedData.invoiceNumber
        }

        ConfirmPayment(content).then(res => {
            if (res.status !== undefined) {
                toast.success("Berhasil mengkonfirmasi " + res.data.transactionId + " " + res.data.invoiceNumber);
                this.setState({ data: null, modal: false })
            }
        }).catch(err => {
            toast.danger("Gagal Mengkonfirmasi " + err);
        })
    }

    render() {

        let listOrder = <Row>
            <Col md={12}>
                <div className="icon-big text-center">
                    <i className="nc-icon nc-money-coins icon-background-paymen-conf" />
                    <h4 style={{ margin: '0px' }}>Hai Gaes, Ini adalah halaman konfirmasi pembayaran</h4>
                    <p>Kamu bisa mencari berdasarkan jumlah transfer atau nomor invoice. <br />Pastikan data yang ada disesuaikan dengan kenyataan yang ada. <br></br> Ciyee ada yang order...</p>
                </div>
            </Col>
        </Row>
            ;

        if (this.state.isFetching) {
            listOrder = <Row className="payment-card-wrapper">
                <Col xs={12} sm={12} md={10} lg={10}>
                    <Card className="card-stats" style={{ boxShadow: 'none' }}>
                        <CardBody className="loading-background" style={{ height: '150px', borderRadius: '12px' }}>

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        }

        if (this.state.data !== null && !this.state.isFetching && this.state.data.length == 0) {
            listOrder = <Row>
                <Col md={12}>
                    <div className="icon-big text-center">
                        <i className="nc-icon nc-money-coins icon-background-paymen-conf" />
                        <h4 style={{ margin: '0px' }}>Not Found</h4>
                        <p>Hasil pencarian tidak ditemukan. <br />Pastikan data kamu masukkan benar. <br></br> Ciyee ada yang order...</p>
                    </div>
                </Col>
            </Row>
        }

        if (this.state.data !== null && !this.state.isFetching && this.state.data.length > 0) {
            listOrder = this.state.data.map((value, index) => {
                let btn = null;
                let dateInput = null
                let time = <Moment fromNow={true} locale="id" format="LLLL">{value.createdAt}</Moment>;
                if (value.status == 1) {
                    dateInput = <><Label for="date_publish">Payment Date</Label>
                        <DatePicker
                            className="form-control"
                            selected={this.state.paymentDate}
                            dateFormat="dd-MM-yyyy"
                            onChange={(val) => this.setState({ paymentDate: val })}
                        /></>
                    btn = <Button onClick={(event) => this.onConfirmationButton(event, value)} className="conf-button" style={{ width: '100%' }} size="lg" color="primary">
                        Konfirmasi Pembayaran
                        </Button>
                } else {
                    dateInput = <>
                        <label style={{ fontSize: '10pt' }}>Dikonfirmasi oleh:</label><br></br>
                        <span style={{ fontSize: '10pt' }}>{value.confirmBy}</span><br></br>
                        <span><Moment fromNow={true} locale="id" format="LLLL">{value.dateconfirm}</Moment> </span>
                    </>
                    btn = <Button className="conf-button" style={{ width: '100%' }} size="lg" color="success">
                        Confirmed
                    </Button>
                }
                
                console.log(time)
                return <Row className="payment-card-wrapper">
                    <Col xs={12} sm={12} md={10} lg={10}>
                        <Card className="card-stats">
                            <CardBody>
                                <Row>
                                    <Col xs={3} md={2}>
                                        <div className="icon-big text-center">
                                            <i className="nc-icon nc-money-coins text-warning" />
                                        </div>
                                    </Col>
                                    <Col xs={9} md={5}>
                                        <div className="numbers" style={{ textAlign: 'left' }}>
                                            <p className="card-category">Invoice Number: {value.invoiceNumber}</p>
                                            <CardTitle tag="p" style={{ fontWeight: '700', color: 'grey' }}>
                                                Rp {this.formatuang(value.subtotal)}
                                            </CardTitle>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={5}>
                                        {dateInput}
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <Row>
                                    <Col md={7} xs={12}>
                                        Tanggal Order : {time}
                                        {/* <Stats>
                                            {[
                                                {
                                                    i: "nc-icon nc-basket",
                                                    t: `${time}`
                                                }
                                            ]}
                                        </Stats> */}
                                    </Col>
                                    <Col md={5} xs={12}>
                                        {btn}
                                    </Col>
                                </Row>

                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            })
        }


        return (

            <div className="content">
                <Modal isOpen={this.state.modal} style={{ display: 'flex', alignItems: 'center', textAlign: 'center', height: '90%' }} fade={false} toggle={this.hideModal}>
                    <ModalHeader>
                        Apakah kamu mengkonfirmasi pesanan ini sudah membayarkan tagihannya ?
                    </ModalHeader>
                    <ModalBody>
                        <CardTitle tag="p" style={{ fontWeight: '700', color: 'grey', textAlign: 'center', fontSize: '18pt' }}>
                            <p className="card-category">Invoice Number: {this.state.SelectedData !== null ? this.state.SelectedData.invoiceNumber : null}</p>

                            {this.state.SelectedData !== null ? `Rp ${this.formatuang(this.state.SelectedData.subtotal)}` : null}
                        </CardTitle>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.setState({ modal: false })}>Tidak</Button>
                        <Button color="success" onClick={(event) => this.confirmAction(event, this.state.SelectedData)}>Ya</Button>
                    </ModalFooter>
                </Modal>


                <Row className="payment-card-wrapper input-data">
                    <Col md={3} xs={12}>
                        <div className="input-by">Cari berdasarkan</div>
                        <Select
                            onChange={(val) => this.setState({ selectBy: val },()=>{this.fetchOrderCard()})}
                            name="findby"
                            value={this.state.selectBy}
                            className="basic-multi-select"
                            options={this.state.selectByOptions}
                        />

                    </Col>
                    <Col md={7} xs={12}>
                        <Input
                            // value={this.formatuang(this.state.value)}
                            name="value"
                            onChange={(event) => this.onChangeMoneyHandler(event)}
                            placeholder="Masukkan Angka" size="lg"
                        ></Input>
                    </Col>
                </Row>


                {listOrder}



            </div>
        )
    }
}

export default PaymentConfrimation;