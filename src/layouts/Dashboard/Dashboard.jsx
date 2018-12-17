import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
// import FixedPlugin from "../../components/FixedPlugin/FixedPlugin.jsx";

import dashboardRoutes from "../../routes/dashboard";

// View
import Dashboards from "../../views/Dashboard/Dashboard.jsx";
import Notifications from "../../views/Notifications/Notifications.jsx";
import Icons from "../../views/Icons/Icons.jsx";
import Typography from "../../views/Typography/Typography.jsx";
import TableList from "../../views/TableList/TableList.jsx";
import Maps from "../../views/Maps/Maps.jsx";
import UserPage from "../../views/UserPage/UserPage.jsx";
import Logout from "../Logout/Logout";


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
    let routes = <Redirect to="/login" />;    
    if (this.props.isAuth) {   
      routes = (
        <Switch>
          <Route path="/dashboard" exact component={Dashboards} />
          <Route path="/dashboard/icons" exact component={Icons} />
          <Route path="/dashboard/maps" exact component={Maps} />
          <Route path="/dashboard/notifications" exact component={Notifications} />
          <Route path="/dashboard/user-page" exact component={UserPage} />
          <Route path="/dashboard/tables" exact component={TableList} />
          <Route path="/dashboard/typography" exact component={Typography} />          
        </Switch>
      );
     
    }

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
          {routes}   
          
          
          
          {/* <Switch>                      
            {dashboardRoutes.map((prop, key) => {              
              if (prop.pro) {
                return null;
              }              
              if (prop.redirect) {
                return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
              }
              return (
                <Route path={prop.path} exact component={prop.component} key={key} />
              );
            })}
          </Switch> */}


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
    isAuth : state.authsd.token !== null
  }
};

export default connect(mapStateToProps)(Dashboard);
