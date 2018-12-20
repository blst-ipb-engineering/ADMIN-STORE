import React, {Component} from 'react';
import Header from "../../components/Header/Header.jsx";
import { Card, Button ,Input, CardFooter, InputGroup,InputGroupAddon,InputGroupText, CardHeader, CardBody, Row, Col } from "reactstrap";

import ImageUploader from '../../components/Products/ImageUploader/ImageUploader.jsx';
import {RequireSpan, Label} from '../../components/UI/Form/Label/Label';
import Select from 'react-select';



class ProductEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            category: [],
            description: '',
            create_price: 0,
            published_price: 0,
            base_price: 0,
            promo_price: 0,
            promo_percentage: 0,
            is_preorder: false,
            pre_order_start: null,
            pre_order_end: null,
            sale_start: null,
            sale_end: null,
            weight: 0,
            minimum_order: 1,
            isbn : null,
            status: 'draft',
            language: 'Indonesia',
            height: 0,
            width: 0,
            stock_level: 0,
            version: 1,
            sku: null,
            format: null,
            is_extrapacking: false,
            is_allowinsurance: false,
            pict_1 : null,
            pict_2 : null,
            pict_3 : null,
            pict_4 : null,
            pict_5 : null,
            video_1 : null,
            video_2 : null,
            video_3 : null,
            video_4 : null,
            video_5 : null,
            percent_royalti: null,
            pages: 0,
            category_options :[
                { id: 1, value: 'Pertanian', label: 'Pertanian' },
                { id: 2, value: 'Peternakan', label: 'Peternakan' },
                { id: 3,value: 'Teknologi', label: 'Teknologi' }
              ]
        }
    }

    formatuang(amount) {
        if(amount === null){
            amount = 0;
        }
        // deletecomma
        let comadel = amount.toString().replace(/\,/g,'');        
        let price = comadel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
		return price;
    }

    onChangeMoneyHandler= (event) => { 
        
        // validasi input tidak boleh huruf
        let values = event.target.value.toString().replace(/\,/g,'');
        
        let isNum = /^\d+$/.test(values);
        let key = event.target.name;        
        if(isNum || event.target.value === null) {
            this.setState({[key]:parseInt(values)})  
        }
        else if (values.length <= 1){
            this.setState({[key]:0})  
        }             
    }


    render() {        
        return (
        <div className="content">        
        <Row>
          <Col md={4} xs={12}>     
            <Card className="card-user">
              <CardHeader>
              <h6>Display Photo</h6>
              </CardHeader>    
              <CardBody>
                <ImageUploader />
              </CardBody>
            </Card>
          </Col>
          <Col md={8} xs={12}>
            {/* General Information */}
            <Card className="card-user">
                <CardHeader>
                    <h6>Product Information</h6>
                </CardHeader>
                <CardBody>
                    <Col md={12}>
                        <Label for="name" required>Code <small>/ Kode Produk</small></Label>                        
                        <Input type="text" name="sku" onChange={(event)=> this.setState({sku: event.target.value})}></Input>
                    </Col>
                    <Col md={12}>
                        <Label for="name" required>Product Name <small>/ Nama Produk</small></Label>                        
                        <Input type="text" name="name" onChange={(event)=> this.setState({name: event.target.value})}></Input>
                    </Col>
                    <Col md={12}>
                        <Label for="name" required>Category <small>/ Kategori</small></Label>   
                        <Select
                            onChange={(val)=> this.setState({category: val})}
                            isMulti
                            name="category"
                            className="basic-multi-select"
                            options={this.state.category_options}
                        />                                            
                    </Col>
                </CardBody>
                <CardFooter>

                </CardFooter>
            </Card>
            <Card className="card-user">
                <CardHeader>
                    <h6>Price <small>/ Harga</small></h6>
                </CardHeader>
                <CardBody>
                <Row>
                        <Col md={12}>
                            <Label for="name" required><strong>Price</strong><small>/ Harga Jual</small></Label>                        
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>Rp</InputGroupText>
                                </InputGroupAddon>
                                <Input style={{fontWeight:'700', fontSize:'20pt'}}
                                    type="text" 
                                    value={this.formatuang(this.state.base_price)} 
                                    name="base_price"                             
                                    onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                </Input>
                            </InputGroup>                            
                        </Col>  
                        {/* <Col md={6}>
                            <Label for="name" required>Promo Price <small>/ Harga Promo</small></Label>                        
                            <Input 
                                type="text" 
                                value={this.formatuang(this.state.promo_price)} 
                                name="promo_price"                             
                                onChange={(event)=> this.onChangeMoneyHandler(event)}>
                            </Input>
                        </Col>                                                             */}
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Label for="name" required>Production Price <small>/ HPP</small></Label>                        
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>Rp</InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                    type="text" 
                                    value={this.formatuang(this.state.create_price)} 
                                    name="create_price"                             
                                    onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                </Input>
                            </InputGroup>
                        </Col>  
                        <Col md={6}>
                            <Label for="name" required>Release Price <small>/ Harga Terbit</small></Label>                        
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                        <InputGroupText>Rp</InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                    type="text" 
                                    value={this.formatuang(this.state.published_price)} 
                                    name="published_price"                             
                                    onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                </Input>
                            </InputGroup>
                            
                        </Col>                                                            
                    </Row>
                </CardBody>
            </Card>
            <Card className="card-user">
                <CardHeader>
                    <h6>Product Description <small>/ Deskripsi Produk</small></h6>
                </CardHeader>
                <CardBody>
                
                </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
        );
    }
}

export default ProductEditor;