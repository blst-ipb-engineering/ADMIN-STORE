import React, {Component} from 'react';
import Header from "../../components/Header/Header.jsx";
import { Card, Button, Modal ,ModalHeader,ModalBody, ModalFooter ,Input, CardFooter, InputGroup,InputGroupAddon,InputGroupText, CardHeader, CardBody, Row, Col } from "reactstrap";

import ImageUploader from '../../components/Products/ImageUploader/ImageUploader.jsx';
import {RequireSpan, Label} from '../../components/UI/Form/Label/Label';
import Select from 'react-select';
import {StickyContainer, Sticky}from 'react-sticky';
// import Modal from '../../components/UI/Modal/Modal';



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
            is_preorder: false,
            pre_order_start: null,
            pre_order_end: null,
            sale_start: null,
            sale_end: null,
            weight: 0,
            minimum_order: 1,
            isbn : '',
            status: 'draft',
            language: '',
            height: 0,
            width: 0,
            thick: 0,
            stock_level: 0,
            version: 1,
            production_version: 1,
            sku: '',
            format: null,       
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
            material : [],
            percent_royalti: null,
            author:[],
            pages: 0,
            category_options :[
                { id: 1, value: 'Pertanian', label: 'Pertanian' },
                { id: 2, value: 'Peternakan', label: 'Peternakan' },
                { id: 3,value: 'Teknologi', label: 'Teknologi' }
              ],
            materials: [
                {id:1, value: 'Book Paper', label:'Book Paper'},
                {id:2, value: 'Soft Cover', label:'Soft Cover'},
                {id:3, value: 'Art Carton', label:'Art Carton'},
            ],
            authors: [
                {id:1, value: 'Author 1', label:'Author 1'},
                {id:2, value: 'Author 2', label:'Author 2'},
                {id:3, value: 'Author 3', label:'Author 3'},
            ],
            addCategory : false,
            addAuthor : false,
            addMaterial: false,
            modal:false,
            newCategory: {
                name: '',
            },
            newAuthor: {
                name: '',
            },
            newMaterial: {
                name: '',
            },
            thumbnailFile: []
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

    newFormHandler = (event) => {
        event.preventDefault();
        let name = event.target.name;
        this.setState({[name]:true,modal:true})
    }

    hideModal = () => {
        this.setState({
            modal:!this.state.modal
        })
    }

    // Image Processing 
    onDrop = (files) => {
        this.setState({thumbnailFile:
            files.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }) )
        })
    }

    componentWillUnmount() {
        // Make sure to revoke the data uris to avoid memory leaks
        this.state.thumbnailFile.forEach(file => URL.revokeObjectURL(file.preview))
      }




    render() {        
        let modalform = null;
        let titlemodal = null;
        let status = false;

        if(this.state.addCategory){
            titlemodal = "Add Category"
            status = this.state.newCategory.name === "";
            modalform =      
                <Row>
                    <Col md={12}>
                    <Label for="nasme" required>Category Name <small>/ Nama Kategori</small></Label>   
                    <Input type="text" onChange={(event)=> this.setState({newCategory: {name:event.target.value}})}></Input>
                    </Col>
                </Row>         
        }

        if(this.state.addAuthor){
            titlemodal = "Add Author"
            status = this.state.newAuthor.name === "";
            modalform =      
                <Row>
                    <Col md={12}>
                    <Label for="name" required>Author Name <small>/ Nama Penulis</small></Label>   
                    <Input type="text" onChange={(event)=> this.setState({newAuthor: {name:event.target.value}})}></Input>
                    </Col>
                </Row>         
        }
        
        if(this.state.addMaterial){
            titlemodal = "Add Category"
            status = this.state.newMaterial.name === "";
            modalform =      
                <Row>
                    <Col md={12}>
                    <Label for="name" required>Material Name <small>/ Nama Bahan</small></Label>   
                    <Input type="text" onChange={(event)=> this.setState({newMaterial: {name:event.target.value}})}></Input>
                    </Col>
                </Row>         
        }

       
        return (
        <div className="content">       
        {/* Tambah Kategori */}
        <Modal isOpen={this.state.modal} toggle={this.hideModal}>                    
            <form>
            <ModalHeader>
                {titlemodal}
            </ModalHeader>
            <ModalBody>
                    {modalform}
                {status ? <Button disabled size="sm">Add</Button>  : <Button size="sm">Add</Button> } 
            </ModalBody>            
            </form>
        </Modal>         
        <form>
        <Row>
            <Col md={4} xs={12}>                                               
                <Card className="card-user">
                    <CardHeader>
                    <h6>Display Photo</h6>
                    </CardHeader>    
                    <CardBody>
                        <ImageUploader onDrop={this.onDrop} filepreview={this.state.thumbnailFile} maxUpload={2} />
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
                        <Button onClick={this.newFormHandler} name="addCategory" color="primary" size="sm"> 
                            <i className="nc-icon nc-simple-add"></i> New Category
                        </Button>                                          
                    </Col>
                    <Col md={12}>
                        <Label for="name" required>Author <small>/ Penulis</small></Label>   
                        <Select
                            onChange={(val)=> this.setState({author: val})}
                            isMulti
                            name="author"
                            className="basic-multi-select"
                            options={this.state.authors}
                        />   
                        <Button onClick={this.newFormHandler} color="primary" size="sm" name="addAuthor"> 
                            <i className="nc-icon nc-simple-add"></i> New Author
                        </Button>                                          
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
                    <h6>Product Detail <small>/ Detail Produk</small></h6>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md={12}>
                        <Label for="name" required>Description<small>/ Deskripsi</small></Label>                                            
                            <Input style={{padding:'10px'}}
                                type="textarea" 
                                value={this.state.description} 
                                name="description"       
                                rows="10"
                                cols="30">
                            </Input>                            
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                                <Label for="name" required>Weight <small>/ Berat</small></Label>                        
                                <InputGroup>                                    
                                    <Input 
                                        type="text" 
                                        value={this.formatuang(this.state.weight)} 
                                        name="weight"                             
                                        onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                    </Input>
                                    <InputGroupAddon addonType="append">
                                            <InputGroupText>gram</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>   
                        </Col>
                        <Col md={3}>
                                <Label for="name" required>Width <small>/ Lebar</small></Label>                        
                                <InputGroup>                                    
                                    <Input 
                                        type="text" 
                                        value={this.formatuang(this.state.width)} 
                                        name="width"                             
                                        onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                    </Input>
                                    <InputGroupAddon addonType="append">
                                            <InputGroupText>cm</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>   
                        </Col>
                        <Col md={3}>
                                <Label for="name" required>Height <small>/ Tinggi</small></Label>                        
                                <InputGroup>                                    
                                    <Input 
                                        type="text" 
                                        value={this.formatuang(this.state.height)} 
                                        name="height"                             
                                        onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                    </Input>
                                    <InputGroupAddon addonType="append">
                                            <InputGroupText>cm</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>   
                        </Col>
                        <Col md={3}>
                                <Label for="name" required>Thick <small>/ Tebal</small></Label>                        
                                <InputGroup>                                    
                                    <Input 
                                        type="text" 
                                        value={this.formatuang(this.state.thick)} 
                                        name="thick"                             
                                        onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                    </Input>
                                    <InputGroupAddon addonType="append">
                                            <InputGroupText>cm</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>   
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                                <Label for="name" required>Product Edition <small>/ Edisi Buku</small></Label>                        
                                                                    
                                    <Input 
                                        type="text" 
                                        value={this.formatuang(this.state.version)} 
                                        name="version"                             
                                        onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                    </Input>                                   
                                  
                        </Col>
                        <Col md={4}>
                                <Label for="name" required>Print Version <small>/ Cetakan ke</small></Label>                        
                                                                    
                                    <Input 
                                        type="text" 
                                        value={this.formatuang(this.state.production_version)} 
                                        name="production_version"                             
                                        onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                    </Input>                                   
                                  
                        </Col>                        
                        <Col md={4}>
                                <Label for="name">Product Pages <small>/ Total Halaman</small></Label>                        
                                                                    
                                    <Input 
                                        type="text" 
                                        value={this.formatuang(this.state.pages)} 
                                        name="pages"                             
                                        onChange={(event)=> this.onChangeMoneyHandler(event)}>
                                    </Input>                                   
                                  
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Label> ISBN</Label>
                            <Input 
                                type="text" 
                                value={this.state.isbn} 
                                name="isbn"                             
                                onChange={(event)=> this.setState({isbn:event.target.value})}>
                            </Input>    
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Label required> Material</Label>
                            <Select
                            onChange={(val)=> this.setState({material: val})}
                            isMulti
                            name="material"
                            className="basic-multi-select"
                            options={this.state.materials}
                            />  
                            <Button onClick={this.newFormHandler} name="addMaterial" style={{float:'right'}} color="primary" size="sm"> 
                            <i className="nc-icon nc-simple-add"></i> New Material
                            </Button> 
                        </Col>
                    </Row>
                </CardBody>
            </Card>
          </Col>
        </Row>
        <Input size="lg" type="submit" value="Submit" />
        </form>
      </div>
        );
    }
}

export default ProductEditor;