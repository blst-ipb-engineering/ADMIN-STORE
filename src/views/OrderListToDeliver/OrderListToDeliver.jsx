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

import { ListOrder,ConfirmSend } from '../../api/index';


class OrderListToDeliver extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFetching:false,
            selectBy: { id: 2, value: 'Jumlah Transfer', label: 'Jumlah Transfer' },
            selectByOptions: [
                { id: 1, value: 'Nomor Invoice', label: 'Nomor Invoice' },
                { id: 2, value: 'Jumlah Transfer', label: 'Jumlah Transfer' },
            ],
            // paymentDate: new Date(),
            value: null,
            startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            endDate: new Date(),
            count:0,
            dataListOrder:null            

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
        this.setState({isFetching:true})  
        const content = {
            querysearch: this.state.value,
            startDate: this.state.startDate,
            endDate:this.state.endDate,
            statusId:[2,3],
	        page: 1
        }

        ListOrder(content).then(result => {
            console.log(result.result)
            this.setState({dataListOrder:result.result,isFetching:false});
        })
    }

    queryInputChangeHandler = (event)=> {
        event.preventDefault();
        this.setState({value:event.target.value})

    }

    handleChangeStart = (val) => {
       
        this.setState({startDate:val})

    }

    handleChangeEnd = (val) => {
        
        this.setState({endDate:val})
    }

    componentDidMount(){
        this.fetchOrderCard()
    }


    render() {
        let listorder = <>
        <div className="loading-background" style={{width:'100%',height:'40px',marginTop:'10px'}}></div>
        <div className="loading-background" style={{width:'100%',height:'40px',marginTop:'10px'}}></div>
        <div className="loading-background" style={{width:'100%',height:'40px',marginTop:'10px'}}></div>
        </>

        if(this.state.dataListOrder !== null ){
            listorder = this.state.dataListOrder.map((value,index)=>
                (<OrderCard OrderProps={value} key={index}></OrderCard>            )        
            )
        }

        return (
            <div className="content">
                <div className="otd-wrapper">
                    <div className="otd-header-wrapper">
                        <div className="search-input-wrap">
                            <label>Cari Order</label>
                            <Input onChange={(event)=>{this.queryInputChangeHandler(event)}} placeholder="masukkan email customer atau nomor order, misal: mbokde@gmail.com"></Input>
                        </div>
                        <div className="date-input-filter">
                            <label className="count">Count : {this.state.count}</label>
                            <label>Date Filter</label>
                            <DatePicker
                                className="form-control"
                                selected={this.state.startDate}
                                dateFormat="dd-MM-yyyy"
                                selectsStart
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onChange={(val)=>this.handleChangeStart(val)}
                            />

                            <DatePicker
                                className="form-control"
                                selected={this.state.endDate}
                                dateFormat="dd-MM-yyyy"
                                selectsEnd
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onChange={(val)=>this.handleChangeEnd(val)}
                            />
                        </div>
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
        )
    }
}

export default OrderListToDeliver;