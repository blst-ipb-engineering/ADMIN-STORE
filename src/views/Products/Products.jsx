import React, {Component} from "react";
import { Card, Table, CardBody, Row, Col } from "reactstrap";
import Products from '../../components/Products/Product';

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
      }],
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
                      <th>Product</th>
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
