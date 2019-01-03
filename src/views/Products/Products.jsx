import React, {Component} from "react";
import { Card, Button, Table, CardBody, Row, Col } from "reactstrap";
import Products from '../../components/Products/Product';
import { Link } from "react-router-dom";
import './Products.css';


import icons from "../../variables/icons";
import axios from "axios";

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
    axios.get('http://localhost:8080/product/index').then(result => {
      console.log(result)
    })
  }

  render() {
    let ProductList = <div className="product-null-wrapper">
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

    if (this.state.products.length > 0) {
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
               produk={res}
               key={key}
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

export default Product;
