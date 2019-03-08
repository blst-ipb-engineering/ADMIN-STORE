import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actionCreator from '../../store/action/index';

import Spinner from '../../components/Spinner/Spinner';
import { Card, CardHeader, CardBody, Input, CardTitle, Row, Col } from "reactstrap";
// import kelas from './Login.css';
// import FormInputs from '../../components/FormInputs/FormInputs';
import Button from "../../components/CustomButton/CustomButton.jsx";
import { Redirect } from 'react-router-dom';


// Auth
// import * as actions from '../../store/action/index';


class Login extends Component {

    state ={
        controls: {
            email: {value: ''},
            password: {value: ''}
        },
        isSignUp:false,
        emailValid:false,
    }

    componentDidMount () {       
        this.props.onTryAutoSignUp();
      }
    

    submitHandler = (event) => {                
        event.preventDefault();
        
        //triger action untuk check email
        if(this.props.email === null){
            this.props.onCheckEmail(this.state.controls.email.value,this.state.controls.password.value);
        }
        
        // jika email benar maka handling ke password
        if(this.props.emailVal){
            this.props.onCheckPassword(this.state.controls.email.value,this.state.controls.password.value);
        }
    };

    inputChangeHandler = (event, controlName) => {             
        const updatedControl = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value:event.target.value
            }
        }; 

        this.setState({controls:updatedControl})
    }

    swithchHandler= () => {
        this.setState(oldState =>{
            return {isSignUp: !oldState.isSignUp}
        })
    }
   
    render() {
        let password = null;
        if(this.props.emailVal) {
            password = <Input 
            style={{textAlign:'center',padding:'20px'}} 
            type='password' 
            name='password' 
            placeholder='Password'
            onChange={(event) => {this.inputChangeHandler(event, 'password')}}
            ></Input>
        }

        let notifError = null;
        if(this.props.error !== null){
            notifError = <p>{this.props.error}</p>
        }

        let loading = null;
        
        if(this.props.loading){
            loading = <Spinner></Spinner>;
        }
        
        let loginForm = null;
        if(this.props.email == null && !this.props.loading ){
            loginForm = <Input style={{textAlign:'center',padding:'20px'}}
            type="text"
            name="email"                                           
            placeholder="Enter Username"
            onChange={(event) => {this.inputChangeHandler(event, 'email')}}
            />  
        }

        let authRedirect = null;        
        if (this.props.isAuth){
            authRedirect = <Redirect to="/dashboard/index" />;
        }

        return(            
            <div>
                {authRedirect}
                <div style={{background:'grey', position:'absolute', width:'100%', height:'100%'}}></div>      
                    <Col md={4} style={{margin:'auto',paddingTop:'100px'}}>
                        <Card className="card-user text-center">
                    {loading}
                        <CardHeader>
                            <CardTitle tag="h4">{this.props.email !== null ? 'Password' : 'Log In'}</CardTitle>                       
                        </CardHeader>
                        <CardBody style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
                            <form style={{width:'100%'}} onSubmit={this.submitHandler}>  
                                {loginForm}                              
                                {password}
                                {notifError}                     
                                <Row>
                                    <div className="update ml-auto mr-auto">
                                    <Button color="primary" round>Sign {this.state.isSignUp ? 'Up' : 'In'}</Button>
                                    </div>
                                </Row>
                            </form>
                        </CardBody>                                                
                        </Card>
                    </Col>                 
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        emailVal : state.authsd.emailValid,
        error : state.authsd.error,
        loading : state.authsd.loading,
        email: state.authsd.email,
        isAdmin : state.authsd.inst,
        isAuth: state.authsd.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onCheckEmail: (email) => dispatch(actionCreator.auth(email)),
        onCheckPassword: (email, password)=>dispatch(actionCreator.authPassword(email, password)),
        onTryAutoSignUp: () => dispatch(actionCreator.authCheckState()),
        onSetAuthRedirectPath:  (path) =>dispatch(actionCreator.setAuthRedirectPath(path))
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Login);