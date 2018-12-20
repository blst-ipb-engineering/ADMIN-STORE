import React, {Component} from "react";
import { Card, Button, Table, CardBody, Row, Col } from "reactstrap";
import Products from '../../components/Products/Product';
import { Link } from "react-router-dom";


import icons from "../../variables/icons";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [{
        id:102,
        name: "SILVER NEEDLE TEA SERAMBI BOTANI HEALTHY & NATURAL PRODUCTS IPB STORE",
        author: "Bagus Dwi Utama",
        price: 1120000       
      },
      {
        id:103,
        name: "Bedah Rumah ala ihum Gambreng",
        author: "Aruna Fauqiyya Hasna",
        price: 12000     
      },{
        id:103,
        name: "Bedah Rumah ala ihum Gambreng",
        author: "Aruna Fauqiyya Hasna",
        price: 12000     
      },{
        id:103,
        name: "Bedah Rumah ala ihum Gambreng",
        author: "Aruna Fauqiyya Hasna",
        price: 12000     
      },{
        id:103,
        name: "Bedah Rumah ala ihum Gambreng",
        author: "Aruna Fauqiyya Hasna",
        price: 12000     
      }
    
    ],
      loadingdata:true
    }
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <Table responsive>
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
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Product;
