import React, {Component} from "react";
import { Card, Table, CardBody, Row, Col } from "reactstrap";
import Products from '../../components/Products/Product';

import icons from "../../variables/icons";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [{
        name: "Bedah Rumah ala ala",
        author: "Bagus Dwi Utama"        
      },
      {
        name: "Bedah Rumah ala ihum Gambreng",
        author: "Aruna Fauqiyya Hasna"        
      }
    ]
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
                      <th>Price </th>
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
