import React, {Component} from 'react';
import { Card, Button, Modal ,ModalHeader,ModalBody, ModalFooter ,Input, CardFooter, InputGroup,InputGroupAddon,InputGroupText, CardHeader, CardBody, Row, Col } from "reactstrap";

import ImageUploader from '../../components/Products/ImageUploader/ImageUploader.jsx';
import {Label} from '../../components/UI/Form/Label/Label';
import Select from 'react-select';
import { Prompt } from 'react-router-dom';
import ReactTooltip from 'react-tooltip'
import axios from 'axios';
import {connect} from 'react-redux';
import * as actionCreator from '../../store/action/index';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import {ProductList as ProductListAction, 
    ProductCategory, 
    ProductAdd,
    ProductCategoryGeneral,
    NewCategoryAction,
    AuthorIndex,
    AuthorCreate,
    MaterialIndex,
    MaterialCreate
} from '../../api/index';


class ProductEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name : '',
            categoryGeneral: [],
            category: [
                // { id: 1, value: 'Pertanian', label: 'Pertanian' },
                // { id: 2, value: 'Peternakan', label: 'Peternakan' },
                // { id: 3,value: 'Teknologi', label: 'Teknologi' }
            ],
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
            category_general_options :[],
            category_options :[
                // { id: 1, value: 'Pertanian', label: 'Pertanian' },
                // { id: 2, value: 'Peternakan', label: 'Peternakan' },
                // { id: 3,value: 'Teknologi', label: 'Teknologi' }
              ],
            materials: [
                // {id:1, value: 'Book Paper', label:'Book Paper'},
                // {id:2, value: 'Soft Cover', label:'Soft Cover'},
                // {id:3, value: 'Art Carton', label:'Art Carton'},
            ],
            authors_options: [
                // {id:1, value: 'Author 1', label:'Author 1'},
                // {id:2, value: 'Author 2', label:'Author 2'},
                // {id:3, value: 'Author 3', label:'Author 3'},
            ],
            addCategory : false,
            addAuthor : false,
            addMaterial: false,
            addMode: null,
            modal:false,
            newCategory: {
                name: '',
            },
            newAuthor: {
                name: '',
                occupation:'',
                phone:''
            },
            newMaterial: {
                name: '',
            },
            thumbnailFile: [],
            productImagesUrl: []
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
        this.setState({addAuthor:false, addMaterial:false, addCategory:false});
        this.setState({[name]:true,modal:true})
    }

    hideModal = () => {
        this.setState({
            modal:!this.state.modal
        })
    }

    onSubmit = (event) => {
        event.preventDefault();
        const content = this.state;
        ProductAdd(content).then(res => {
            console.log(res)
        })
    }

    // Image Processing 
    onDrop = (files) => {  
        const max_file_count = 4 - this.state.thumbnailFile.length;
        const array_images = this.state.thumbnailFile.concat(
            files.slice(0, max_file_count).map((file) => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        
        this.setState({thumbnailFile: array_images});        
        // uploading to cloudinary directly
        files.slice(0, max_file_count).map((file)=> {            
            this.handleUploadImages(file);
        })        
    }

    // This function does the uploading to cloudinary
    handleUploadImages = (image) => {        
        console.log(image);
        // uploads is an array that would hold all the post methods for each image to be uploaded, then we'd use axios.all()
              
        // our formdata
        const formData = new FormData();
        formData.append("file", image);
        formData.append("tags", 'product'); // Add tags for the images - {Array}
        formData.append("upload_preset", "blst_product"); // Replace the preset name with your own
        formData.append("api_key", "387685966233372"); // Replace API key with your own Cloudinary API key
        formData.append("folder","product");
        formData.append("quality","low");
        formData.append("timestamp", (Date.now() / 1000) | 0);
        
        // Replace cloudinary upload URL with yours
        return axios.post(
            "https://api.cloudinary.com/v1_1/blst/image/upload",
            formData, 
            { headers: { "X-Requested-With": "XMLHttpRequest" }})
            .then(response => {
                console.log(response.data)
                // const oldImages = this.state.productImagesUrl;
                const newImages = response.data;
                const newArrayofImages = this.state.productImagesUrl.concat(newImages);
                this.setState({productImagesUrl:newArrayofImages});
            })
    }


    deleteImageHandler = (event,index) => {
       event.preventDefault();       
       this.state.thumbnailFile.splice(index, 1);         
       this.setState({thumbnailFile: this.state.thumbnailFile});   
    }

    componentWillUnmount() {
        console.log("[Will Unmount]")
        // Make sure to revoke the data uris to avoid memory leaks
        this.state.thumbnailFile.forEach(file => URL.revokeObjectURL(file.preview))
      }
    
    // componentWillUpdate() {
    //     console.log("[WILL UPDATE] tes")
    // }

    componentWillMount() {
        console.log("[WILL MOUNT]")
    }
    
    componentDidMount() {
        console.log("[DIDMOUNT]")
        // call for CategoryGeneral
        this.props.setLoading(true)
        const categoryGeneral = [];
        const content = {}
        ProductCategoryGeneral(content).then(res => {
            res.map((value,key)=> {
                categoryGeneral.push({
                    id: value.id,
                    value: value.id,
                    label:value.name
                });
            });
            this.setState({category_general_options:categoryGeneral});
            this.props.setLoading(false)       
        }).catch(err => 
            toast.warn("Network Error, Can't get catogory data from server " + err) ); 
            this.props.setLoading(false);
            
        // call for Category
        const category = [];
        ProductCategory().then(res=> {
            res.map((value,key)=> {
                category.push({
                    id:value.id,
                    value:value.name,
                    label:value.name
                })
            })
            this.setState({category_options: category})
        })

        // call for Material
        const materials= [];
        MaterialIndex().then(res=> {
            res.map((value,key)=> {
                materials.push({
                    id:value.id,
                    value:value.id,
                    label:value.name
                })
            })                    
            this.setState({materials: materials})
        });

        // call for author
        const authorsnya = [];
        AuthorIndex().then(res => {
            
            res.map((value,key)=> {
                
                authorsnya.push({
                    id:value.id,
                    value:value.name,
                    label:value.name
                })
            })
            this.setState({authors_options:authorsnya})
        });            
    }
    

    // Handling untuk penambahan category, material, author
    AddButtonHandler = (event) => {
        event.preventDefault();
        const mode = this.state.addMode;
        
        if(mode === 'category'){
           const content = {
                name : this.state.newCategory.name
            }            
            NewCategoryAction(content).then(res => {                
                if(res.status === "success"){
                    toast.success("Material Added Successfully");
                    this.hideModal()                    
                    const addedCategory = {
                        id: res.data.id,
                        value:res.data.id,
                        label:res.data.name
                    }
                    const oldCategory = this.state.category;
                    const newCategory = oldCategory.concat(addedCategory);                    
                    this.setState({category:newCategory})
                }else{
                    toast.warning("Error Please Reload");                    
                }                
            }).then((res) => {                
                const category = [];
                ProductCategory().then(res=> {
                    res.map((value,key)=> {
                        category.push({
                            id:value.id,
                            value:value.id,
                            label:value.name
                        })
                    })
                    this.setState({category_options: category})
                });
            })
        }

        if(mode === 'author'){
            const content = {
                name : this.state.newAuthor.name,
                occupation: this.state.newAuthor.occupation,
                phone: this.state.newAuthor.phone
            }            
            AuthorCreate(content).then(res => {                
                if(res.status === "success"){
                    toast.success("Author Added Successfully");
                    this.hideModal()                    
                    const addedAuthor = {
                        id: res.data.id,
                        value:res.data.id,
                        label:res.data.name
                    }
                    console.log(addedAuthor)
                    const oldAuthor = this.state.author;
                    const newAuthor = oldAuthor.concat(addedAuthor);                    
                    this.setState({author:newAuthor})
                }else{
                    toast.warning("Error Please Reload");                    
                }                
            }).then((res) => {                
                const authors = [];
                AuthorIndex().then(res=> {
                    res.map((value,key)=> {
                        authors.push({
                            id:value.id,
                            value:value.id,
                            label:value.name
                        })
                    })
                    console.log(authors)
                    this.setState({authors_options: authors})
                });
            })
        }

        if(mode === 'material'){
            const content = {
                name : this.state.newMaterial.name,                
            }            
            MaterialCreate(content).then(res => {    
                console.log(res)            
                if(res.status === "success"){
                    toast.success("Material Added Successfully");
                    this.hideModal()                    
                    const addedMaterial = {
                        id: res.data.id,
                        value:res.data.id,
                        label:res.data.name
                    }
                    
                    const oldMaterial = this.state.material;
                    const newMaterial = oldMaterial.concat(addedMaterial);                    
                    this.setState({material:newMaterial})
                }else{
                    toast.warning("Error Please Reload");                    
                }                
            }).then((res) => {                
                const materials = [];
                MaterialIndex().then(res=> {
                    res.map((value,key)=> {
                        materials.push({
                            id:value.id,
                            value:value.id,
                            label:value.name
                        })
                    })                    
                    this.setState({materials: materials})
                });
            })
        }
        
    }

    showToaster = (message) => {
        const snackBarOption = {
              isOpen: true,
              text: message
            };              
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
                    <Input type="text" onChange={(event)=> this.setState({newCategory: {name:event.target.value},addMode:'category'})}></Input>
                    </Col>
                </Row>         
        }

        if(this.state.addAuthor){
            titlemodal = "Add Author"
            status = this.state.newAuthor.name === "" || this.state.newAuthor.phone !== "";
            console.log(status)
            modalform =      
                <Row>
                    <Col md={12}>
                    <Label for="name" required>Author Name <small>/ Nama Penulis</small></Label>   
                    <Input type="text" onChange={(event)=> this.setState({newAuthor: {name:event.target.value},addMode:'author'})}></Input>
                    <Label for="name" required>Phone Number <small>/ Nomor Telp</small></Label>   
                    <Input type="text" onChange={(event)=> this.setState({newAuthor: {phone:event.target.value},addMode:'author'})}></Input>
                    </Col>
                </Row>         
        }
        
        if(this.state.addMaterial){
            titlemodal = "Add Material"
            status = this.state.newMaterial.name === "";
            modalform =      
                <Row>
                    <Col md={12}>
                    <Label for="name" required>Material Name <small>/ Nama Bahan</small></Label>   
                    <Input type="text" onChange={(event)=> this.setState({newMaterial: {name:event.target.value},addMode:'material'})}></Input>
                    </Col>
                </Row>         
        }

       
        return (
            
        <div className="content">        
        <Prompt message="You have unsaved form data. Are you sure you want to leave?" />    
        {/* Modal Tambah */}
        <Modal isOpen={this.state.modal} fade={false} toggle={this.hideModal}>                    
            <form onSubmit={this.AddButtonHandler}>
            <ModalHeader>
                {titlemodal}
            </ModalHeader>
            <ModalBody>
                    {modalform}
                {status ? <Button disabled size="sm">Add</Button> : <Button onClick={(event) => this.AddButtonHandler(event)}  size="sm">Add</Button> } 
            </ModalBody>            
            </form>
        </Modal>         
        <form>
        <Row>
            <Col md={4} xs={12}>                                               
                <Card className="card-user">
                    <CardHeader>
                    <h6>Display Photos <small>Max 4</small></h6>
                    </CardHeader>    
                    <CardBody>
                        <ImageUploader onDrop={this.onDrop} deleted={this.deleteImageHandler} filepreview={this.state.thumbnailFile} maxUpload={4} />
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
                        <Label for="name" required>Product Name <small>/ Nama Produk</small></Label>                        
                        <Input type="text" name="name" onChange={(event)=> this.setState({name: event.target.value})}></Input>
                    </Col>
                    <Col md={12}>
                    <ReactTooltip />  
                        <Label for="name" required>Product Category <small data-tip="Hubungi tim IT untuk menambahan data jika tidak tersedia">/ Kategori Umum</small></Label>   
                        <Select
                            onChange={(val)=> this.setState({categoryGeneral: val})}                            
                            name="categoryGeneral"
                            className="basic-multi-select"
                            options={this.state.category_general_options}
                        />                                                                  
                    </Col>
                    <Col md={12}>
                        <Label for="name" required>Category <small>/ Kategori</small></Label>   
                        <Select
                            onChange={(val)=> this.setState({category: val})}
                            isMulti
                            name="category"
                            value={this.state.category}
                            className="basic-multi-select"
                            values={this.state.category}
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
                            value={this.state.author}
                            name="author"
                            className="basic-multi-select"
                            options={this.state.authors_options}
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
                <CardBody style={{minHeight:"0"}}>
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
                    {/* <Row>
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
                    </Row> */}
                </CardBody>
            </Card>
            <Card className="card-user">
                <CardHeader>
                    <h6>Product Detail <small>/ Detail Produk</small></h6>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md={12}>
                        <Label for="name" required>Description<small>/ Deskripsi</small><small style={{float:'right'}}>{500 - this.state.description.length} / 500</small></Label>                                            
                            <Input style={{padding:'10px'}}
                                type="textarea" 
                                value={this.state.description} 
                                onChange={(event)=> this.setState({description:event.target.value})}
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
                            value={this.state.material}
                            name="material"
                            className="basic-multi-select"
                            options={this.state.materials}
                            />  
                            <Button onClick={this.newFormHandler} name="addMaterial" color="primary" size="sm"> 
                            <i className="nc-icon nc-simple-add"></i> New Material
                            </Button> 
                        </Col>
                    </Row>
                    <Row>
                    <Col md={12}>
                        <Label for="name">Code <small>/ Kode Produk</small></Label>                        
                        <Input type="text" name="sku" onChange={(event)=> this.setState({sku: event.target.value})}></Input>
                    </Col>
                    </Row>
                </CardBody>
            </Card>
          </Col>
        </Row>
        <Row >
            <Col md={12} style={{textAlign:'right'}}>
                <Button type="submit" onClick={(event) => this.props.history.push('/dashboard/products')} value="Submit" color="secondary">Cancel</Button>
                <Button type="submit" value="Submit" color="secondary" >Save & Add New</Button>
                <Button type="submit" value="Submit" color="secondary" >Copy & Add New</Button>
                <Button type="submit" onClick={this.onSubmit} color="success" value="Submit">Save</Button>
            </Col>
        </Row>
        </form>
        <ToastContainer />
      </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ui: state.ui    
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
      toggleNotif: (message) => dispatch(actionCreator.toggleNotification(message)),
      setLoading: (data) => dispatch(actionCreator.toggleLoading(data))
    };
  }

export default connect(mapStateToProps,mapDispatchToProps)(ProductEditor);