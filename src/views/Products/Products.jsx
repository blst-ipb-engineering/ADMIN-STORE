import React, {Component} from "react";
import { Card, Button,Modal,ModalHeader,ModalBody,ModalFooter, Table, CardBody, Row, Col } from "reactstrap";
import Products from '../../components/Products/Product';
import { Link } from "react-router-dom";
import './Products.css';
import * as actionCreator from '../../store/action/index';
import { connect } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import Spinner from '../../components/Spinner/Spinner';
import LoadingProductAdmin from '../../components/UI/LoadingData/ProductList/Loadingdata';




import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import icons from "../../variables/icons";
import axios from "axios";

import {
  ProductList,
  ProductDelete   
} from '../../api/index';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loadingdata:true,
      modal:false,
      delete_product:{
        id: null,
        name:null,
        price:null,
        picture_url:null,
        category_general:null
      }
    }
  }

  loadProduct = () => {
    const products =[];
    const content = {}
    ProductList(content).then(res=> {      
     
      res.map((value,index)=> {           
        products.push({
          id:value.id,
          name:value.name,
          price:value.base_price,
          picture_url:typeof value.Pictures[0] !== 'undefined' ? value.Pictures[0].url_small : 'https://www.bukalapak.com/images/jual_barang/upload-image-v4.png',
          category_general:value.CategoryGeneral.name
        })
      });
    }).then(res => {
      this.setState({products:products,loadingdata:false},()=> {       
      });
      this.props.setLoading(false)       
    });
  }

  componentDidMount() {
    this.loadProduct();
    console.log(this.props.ui.toaster.isOpenToast)
    if(this.props.ui.toaster.isOpenToast){
      toast.success(this.props.ui.toaster.toastMessage);
    }
  }

  hideModal = () => {
    this.setState({
        modal:!this.state.modal
    })
  }

  deleteHandler =(event,product)=> {
    this.setState({delete_product:{
      id: product.id,
      name:product.name,
      price:product.price,
      picture_url:product.picture_url,
      category_general:product.category_general
    }},() => {
      this.setState({modal:true})
    })
  }

  deleteAction = (event,product) =>{
    const content= {
      id: product.id
    }
    ProductDelete(content).then((res) => {
      if(res.status === "Deleted"){
        this.hideModal();       
        const load1 = this.loadProduct();   
        Promise.all([load1]).then(()=> {
          console.log("halo")
          toast.success("Product Deleted");
        })
      }
      
    })
  }
  
  render() {    
    let ProductList = null;
    if (this.state.loadingdata){
      ProductList = <Table responsive>
       <thead>
         <tr>
           <th></th>
           <th>Product 
             <Link to="/dashboard/products/new" style={{marginLeft:'10px'}} href="http://google.com">
               <Button color="primary" size="sm"> 
                 <i className="nc-icon nc-simple-add"></i> Add Product
               </Button>
             </Link>
           </th>
           <th>Price <small>Per PCS</small></th>
           <th>Stock </th>
           <th></th>
         </tr>
       </thead>
       <tbody>                   
           <LoadingProductAdmin/>
           <LoadingProductAdmin/>
           <LoadingProductAdmin/>                                        
       </tbody>
     </Table>;
    }

    if (this.state.products.length === 0 && !this.state.loadingdata) {
      ProductList = <div className="product-null-wrapper">
        <div className="image-wrapper">
          <img src="/box.svg" alt=""/>
        </div>
        <h2 style={{marginBottom: '12px'}}>Belum ada Barang dijual</h2>
        <p >Barang jualan kamu akan muncul di halaman ini. Ayo mulai berjualan sekarang!</p>
        <Link to="/dashboard/products/new" style={{marginLeft:'10px'}} href="http://google.com">
               <Button color="primary" style={{marginBottom: '90px'}} size="bg"> 
                 <i className="nc-icon nc-simple-add"></i> Add Product
               </Button>
        </Link>
        </div>
    }

    else if (this.state.products.length > 0) {
       ProductList = <Table responsive>
       <thead>
         <tr>
           <th></th>
           <th>Product 
             <Link to="/dashboard/products/new" style={{marginLeft:'10px'}} >
               <Button color="primary" size="sm"> 
                 <i className="nc-icon nc-simple-add"></i> Add Product
               </Button>
             </Link>
           </th>
           <th>Price <small>Per PCS</small></th>
           <th>Stock </th>
           <th></th>
         </tr>
       </thead>
       <tbody>
         {          
           this.state.products.map((res, key) =>                                             
               <Products
               id={res.id}
               produk={res}
               key={key}
               images={res.picture_url}    
               deleteHandler={this.deleteHandler} 
               />                                            
           )
         }                    
       </tbody>
     </Table>;
    }

    return (
      
      <div className="content">
        <Modal isOpen={this.state.modal} fade={false} toggle={this.hideModal}>
          <ModalHeader>
            Apakah kamu yakin akan menghapus produk ini ?
          </ModalHeader>
          <ModalBody>
            <div className="products-display-container">
                <div className="box-media">
                    <div className="product-pict" style={{background:`url(${this.state.delete_product.picture_url})`}}></div>
                </div>
                <div className="box-short-desc">                    
                    <a href="#">{this.state.delete_product.name}</a>                    
                    <small>Cetakan ke 2</small>
                    <div className="ellipsis">{this.state.delete_product.category_general}</div> 
                </div>                
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={()=>this.setState({modal:false})}>No</Button>
            <Button color="success" onClick={(event) => this.deleteAction(event,this.state.delete_product)}>Yes</Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>                
                {ProductList}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer />
      </div>
    );
  }
}

const mapStateToProps = state => {  
  return {
    isAuth : state.authsd.token !== null,
    authRedirectPath: state.authsd.authRedirectPath,
    ui:state.ui
  }
};

const mapDispatchToProps = dispatch =>{  
  return {
    onTryAutoSignUp: () => dispatch(actionCreator.authCheckState()),
    onSetAuthRedirectPath:  (path) =>dispatch(actionCreator.setAuthRedirectPath(path)),
    setLoading: (data) => dispatch(actionCreator.toggleLoading(data)),
    toggleToaster: (payload) => dispatch(actionCreator.toggleToaster(payload))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Product);
