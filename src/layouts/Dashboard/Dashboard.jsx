import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
// import FixedPlugin from "../../components/FixedPlugin/FixedPlugin.jsx";
import * as actionCreator from '../../store/action/index';


import dashboardRoutes from "../../routes/dashboard";




var ps;

class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "info",
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
       
    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          routes={dashboardRoutes}
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
        />
        <div className="main-panel" ref="mainPanel">
          <Header {...this.props} />
          
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
          </Switch>


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
    authRedirectPath: state.authsd.authRedirectPath
  }
};

const mapDispatchToProps = dispatch =>{  
  return {
    onTryAutoSignUp: () => dispatch(actionCreator.authCheckState()),
    onSetAuthRedirectPath:  (path) =>dispatch(actionCreator.setAuthRedirectPath(path)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);
