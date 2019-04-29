import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import InfiniteScroll from 'react-infinite-scroller';

// import FixedPlugin from "../../components/FixedPlugin/FixedPlugin.jsx";
import * as actionCreator from '../../store/action/index';

//View
import ProductEditor from '../../views/Input/ProductEditor';

import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoadingBar from 'react-redux-loading-bar';

import dashboardRoutes from "../../routes/dashboard";

var ps;

class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "warning",
    }
  }


  componentDidMount() {    
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel);
      document.body.classList.toggle("perfect-scrollbar-on");      
    }    
    
    this.props.onTryAutoSignUp();
    this.props.onSetAuthRedirectPath();
    
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.refs.mainPanel.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  }
  handleBgClick = (color) => {
    this.setState({ backgroundColor: color });
  }
  render() {        
    // console.log(this.props.ui.snackBarOption.text)
    // console.log(this.props.ui.snackBarOption.isOpen)
    // console.log(this.props.ui.toaster.isOpenToast)
    return (
      <div className="wrapper">             
        <Sidebar
          {...this.props}
          routes={dashboardRoutes}
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
        />
        
        <div className="main-panel" ref="mainPanel">  
          <LoadingBar />         
          <Header {...this.props} /> 
          
          {/* <Toaster isOpen={true} message={"Warning"}/>            */}
          <Switch>                      
            {dashboardRoutes.map((prop, key) => {              
              if (prop.pro) {
                return null;
              }              
              if (prop.redirect) {
                return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
              }
             
              if (!localStorage.getItem('token')) {
                return <Redirect to='/login' />;    
              }
              return (
                <Route path={prop.path} exact component={prop.component} key={key} />
              );
            })}
            <Route path="/dashboard/products/:status" exact component={ProductEditor} />
            <Route name='product-edit' path="/dashboard/products/:id/:status" exact component={ProductEditor} />

            <Route path="/dashboard/slider"></Route>
          </Switch>

          <ToastContainer />
          <Footer fluid />
        </div>
        {/* <FixedPlugin
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
          handleActiveClick={this.handleActiveClick}
          handleBgClick={this.handleBgClick}
        /> */}
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

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);
