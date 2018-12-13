import React, {Component} from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardFooter, Row, Col } from "reactstrap";
import classes from './Login.css';

class Login extends Component {
   
    render() {
        return(
            <div>
                <div style={{background:'grey', position:'absolute', width:'100%', height:'100%'}}></div>      
                    <Col md={6} style={{margin:'auto',padding:'100px'}}>
                        <Card className="card-user text-center">
                        <CardHeader>
                            <CardTitle tag="h4">Log In</CardTitle>
                        </CardHeader>
                        <CardBody>

                        </CardBody>                            
                        </Card>
                    </Col>                 
            </div>
        )
    }
}

export default Login;