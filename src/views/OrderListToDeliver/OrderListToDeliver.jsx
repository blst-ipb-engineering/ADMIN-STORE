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
    Col
} from "reactstrap";
import { Label } from '../../components/UI/Form/Label/Label';
import DatePicker from "react-datepicker";
import Select from 'react-select';

import Toaster from '../../components/UI/Toaster/Toaster';
import OrderCard from '../../components/OrderCard/OrderCard.jsx';
import { ToastContainer, toast } from 'react-toastify';
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    IconButton,
    TableRow,
    TableCell,
    Collapse,
    Paper
} from '@material-ui/core';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Moment from 'react-moment';



import { ListOrder, ConfirmSend, ListStatus, DeclineThisOrder } from '../../api/index';


class OrderListToDeliver extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching: false,
            selectBy: { id: 2, value: 'Jumlah Transfer', label: 'Jumlah Transfer' },
            selectByOptions: [
                { id: 1, value: 'Nomor Invoice', label: 'Nomor Invoice' },
                { id: 2, value: 'Jumlah Transfer', label: 'Jumlah Transfer' },
            ],
            // paymentDate: new Date(),
            value: null,
            startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            endDate: new Date(new Date().setHours(23, 59, 59, 999)),
            count: 0,
            dataListOrder: null,
            listStatus: [],
            currentStatus: {
                id: 2,
                statusName: "Menunggu pembayaran"
            }

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
            this.setState({ [key]: parseInt(values) })
        }
        else if (values.length <= 1) {
            this.setState({ [key]: parseInt(0) })
        }

    }

    fetchOrderCard = () => {
        this.setState({ isFetching: true })
        const content = {
            querysearch: this.state.value,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            statusId: [this.state.currentStatus.id],
            page: 1
        }

        ListOrder(content).then(result => {
            this.setState({ dataListOrder: result.result, isFetching: false, count: result.result.length });
        })
    }

    // status pengiriman
    fetchListStatus = () => {
        this.setState({ isFetching: true });
        const content = {
            querysearch: this.state.value,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
        };

        ListStatus(content).then(result => {
            this.setState({ listStatus: result.data });
        })
    }

    queryInputChangeHandler = (event) => {
        event.preventDefault();
        this.setState({ value: event.target.value, dataListOrder: null }, () => {
            this.fetchOrderCard();
            this.fetchListStatus();
        })

    }

    handleChangeStart = (val) => {
        this.setState({ startDate: val, dataListOrder: null }, () => {
            this.fetchOrderCard();
            this.fetchListStatus();
        })
    }

    handleChangeEnd = (val) => {
        this.setState({ endDate: val, dataListOrder: null }, () => {
            this.fetchOrderCard();
            this.fetchListStatus();
        })
    }

    handleStatusClick = (e, value) => {
        this.setState({ currentStatus: value, dataListOrder: null }, () => {
            this.fetchOrderCard();
            this.fetchListStatus();
        });
    }

    componentDidMount() {
        this.fetchOrderCard();
        this.fetchListStatus();
    }

    DeclineItHandler = (e, invNumber) => {
        e.stopPropagation();
        this.setState({ dataListOrder: null });
        const content = {
            invoiceNumber: invNumber
        }
        DeclineThisOrder(content).then(result => {
            toast.success("Order Dibatalkan 👍🏻" + result.data.prosesBy);
            this.fetchOrderCard();
            this.fetchListStatus();

        }).catch(err => {
            console.log(err)
        })
    }

    renderTable = () => {
        const Row = (props) => {
            const { data } = props;
            const [open, setOpen] = React.useState(false);
            let ButtonCondition = null;

            if (data.prosesBy !== null && data.no_resi == null) {
                ButtonCondition = <small><strong>Diproses : </strong>{data.prosesBy} <br></br> <Moment fromNow>{data.dateproses}</Moment></small>
            } else if (data.status > 1 && data.status < 5 && data.prosesBy == null && data.no_resi == null) {
                ButtonCondition = <Button onClick={(e) => this.takeItHandler(e, data.invoiceNumber)} style={{ margin: '0', width: '100%', borderRadius: '0px' }} size="lg" className="take-it-background">PROSES</Button>;
            } else if (data.status === 1 && new Date(data.expireDate) > new Date()) {
                ButtonCondition = <div style={{ marginLeft: '10px', textAlign: 'center' }}>Batas Pembayaran : <Moment fromNow>{data.expireDate}</Moment></div>;
            } else if (data.status === 1 && new Date(data.expireDate) < new Date()) {
                ButtonCondition = <Button onClick={(e) => this.DeclineItHandler(e, data.invoiceNumber)} style={{ margin: '0', borderRadius: '0px' }} size="lg" className="take-it-background">BATAL</Button>;
            } else if (data.status === 5) {
                ButtonCondition = <span>Waktu tenggat pembayaran sudah habis</span>
            }
            else {
                ButtonCondition = data.no_resi;
            }

            return <>
                <TableRow onClick={() => setOpen(!open)}>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell>{data.invoiceNumber}</TableCell>
                    <TableCell>{data.Customer.email}</TableCell>
                    <TableCell>{data.courier}</TableCell>
                    <TableCell> <Button size="sm" style={{ margin: '0', borderRadius: '23px', background: data.StatusOrder.color }}>{data.StatusOrder.statusName}</Button></TableCell>
                    <TableCell style={{textAlign:'right'}}>{this.formatuang(data.subtotal)}</TableCell>
                    <TableCell>{ButtonCondition}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                        <OrderCard DeclineItHandler={this.DeclineItHandler} history={this.props.history} OrderProps={data}></OrderCard>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        }
        const rows = this.state.dataListOrder.map((value, index) => {            
            return <Row key={index} data={value}></Row>
        })



        return (<TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Kode Order</TableCell>
                        <TableCell>Akun</TableCell>
                        <TableCell>Pengririman</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Nilai</TableCell>
                        <TableCell>Note</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </TableContainer>)
    }


    render() {
        let listorder = <>
            <div className="loading-background" style={{ width: '100%', height: '40px', marginTop: '10px' }}></div>
            <div className="loading-background" style={{ width: '100%', height: '40px', marginTop: '10px' }}></div>
            <div className="loading-background" style={{ width: '100%', height: '40px', marginTop: '10px' }}></div>
        </>

        if (this.state.dataListOrder !== null) {
            listorder = this.renderTable()
            // listorder = this.state.dataListOrder.map((value, index) =>
            //     ("")
            //     // (<OrderCard DeclineItHandler={this.DeclineItHandler} history={this.props.history} OrderProps={value} key={index}></OrderCard>)
            // )
        }

        let listStatus = this.state.listStatus.map((value, index) => (
            <div key={index} onClick={(e) => this.handleStatusClick(e, value)} className={this.state.currentStatus.id === value.id ? "card-status-btn active-status" : "card-status-btn"} >
                {value.statusName} <span className="card-count-wrapper" style={{ background: `${value.color}` }}>{value.OrderCount}</span>
            </div>
        ));

        return (
            <>
                <ToastContainer />
                <div className="content">
                    <div className="otd-wrapper">
                        <div className="otd-header-wrapper">
                            <div className="search-input-wrap">
                                <Input onChange={(event) => { this.queryInputChangeHandler(event) }} placeholder="Cari Order, masukkan email customer atau nomor order, misal: mbokde@gmail.com"></Input>
                            </div>
                            {/* <div className="count"><span className="count-title">Count :</span> {this.state.count}</div> */}
                            <div className="date-input-filter">
                                <label style={{ padding: '0px 10px' }}><i className="nc-icon nc-calendar-60" /></label>
                                <DatePicker
                                    className="form-control datepicker-input"
                                    selected={this.state.startDate}
                                    dateFormat="dd-MM-yyyy"
                                    selectsStart
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                    onChange={(val) => this.handleChangeStart(val)}
                                />
                                <span style={{ padding: '0px 10px' }}>-</span>
                                <DatePicker
                                    className="form-control datepicker-input"
                                    selected={this.state.endDate}
                                    dateFormat="dd-MM-yyyy"
                                    selectsEnd
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                    onChange={(val) => this.handleChangeEnd(val)}
                                />
                            </div>
                        </div>
                        <div className="list-status-class">
                            {listStatus}
                        </div>
                        {listorder}
                    </div>

                    {/* <Row className="payment-card-wrapper">
                        <Col xs={12} sm={12} md={10} lg={10}>
                            <Card className="card-stats" style={{boxShadow:'none'}}>
                                <CardBody className="loading-background" style={{height:'150px',borderRadius:'12px'}}>
                                    
                                </CardBody>                                
                            </Card>
                        </Col>
                    </Row> */}

                    {/* <Row className="payment-card-wrapper">
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
                                            <p className="card-category">Invoice Number: 2019228682</p>
                                            <CardTitle tag="p" style={{ fontWeight: '700',color:'grey' }}>Rp 141,318</CardTitle>                                            
                                        </div>
                                    </Col>
                                    <Col xs={12} md={5}>
                                        <Label for="date_publish">Payment Date</Label>
                                        <DatePicker
                                            className="form-control"
                                            selected={this.state.paymentDate}
                                            dateFormat="dd-MM-yyyy"
                                            onChange={(val) => this.setState({ paymentDate: val })}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <Row>
                                    <Col md={7} xs={12}>
                                        <Stats>
                                            {[
                                                {
                                                    i: "nc-icon nc-basket",
                                                    t: "24 February 2019 (Pukul 18:47 WIB) 1 week before"
                                                }
                                            ]}
                                        </Stats>
                                    </Col>
                                    <Col md={5} xs={12}>
                                        <Button className="conf-button" style={{ width: '100%' }} size="lg" color="primary">
                                            Konfirmasi Pembayaran
                                        </Button>
                                    </Col>
                                </Row>

                            </CardFooter>
                        </Card>
                    </Col>
                </Row> */}

                </div>
            </>
        )
    }
}

export default OrderListToDeliver;