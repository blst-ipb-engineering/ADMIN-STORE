import React, {Component} from "react";
import { Card, Button, Table, CardBody, Row, Col } from "reactstrap";
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

import {ProductList,   
} from '../../api/index';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [
      //   {
      //   id:1,
      //   name:"Product 1 Paijo bin paimin",
      //   price: 100000,
      // },{
      //   id:1,
      //   name:"Product 1 Paijo bin paimin",
      //   price: 100000,
      // },{
      //   id:1,
      //   name:"Product 1 Paijo bin paimin",
      //   price: 100000,
      // }
    ],
      loadingdata:true
    }
  }

  componentDidMount() {
    const products =[];
    const content = {}
    ProductList(content).then(res=> {      
      console.log(res)
      res.map((value,index)=> {
        
        products.push({
          id:value.id,
          name:value.name,
          price:value.base_price,
          picture_url:value.Pictures[0].url ? value.Pictures[0].url : null,
          category_general:value.category_general.name
        })
      });
    }).then(res => {
      this.setState({products:products,loadingdata:false},()=> {
        // if(this.props.ui.toaster.isOpenToast){
        //   toast.warning("Toast DidMount Dashboard");
        //   const toaster = {
        //     isOpenToast: false,
        //     toastMessage: null,
        //     toastType:'success',
        // }      
        //   this.props.toggleToaster(toaster)
        //   console.log("toast from Dashboard")
        // }
      });
      this.props.setLoading(false)       
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
         {          
           this.state.products.map((res, key) =>                                             
               <Products
               id={res.id}
               produk={res}
               key={key}
               images={res.picture_url}    
                          
               />                                            
           )
         }                    
       </tbody>
     </Table>;
    }

    return (
      <div className="content">
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>                
                {ProductList}
              </CardBody>
            </Card>
          </Col>
        </Row>
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
