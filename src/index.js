import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from "react-redux";
import thunk from 'redux-thunk';

import "bootstrap/dist/css/bootstrap.css";
import "./assets/scss/paper-dashboard.scss";
import "./assets/demo/demo.css";

import indexRoutes from "./routes/index.jsx";

import Dashboard from "./layouts/Dashboard/Dashboard.jsx";
import Login from './layouts/Login/Login';
import Logout from './layouts/Logout/Logout';


// reducer 
import  authReducer from './store/reducer/auth';
import  uiReducer from './store/reducer/ui-reducer';
import { loadingBarReducer } from 'react-redux-loading-bar'


const hist = createBrowserHistory();
const rootReducer = combineReducers({
  authsd: authReducer,
  ui:uiReducer,
  loadingBar: loadingBarReducer,
});


// membuat middleware
const logger = store => {
  return next => {
    return action => {
      const result = next(action);
      return result;
    }
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__|| compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger, thunk)));


ReactDOM.render(
  <Provider store={store}>
    <Router history={hist}>
      <Switch>
        <Route path="/dashboard" component={Dashboard}></Route>
        <Route path="/login" exact component={Login}></Route>
        <Route path="/" exact component={Login}></Route>
        <Route path="/logout" exact component={Logout} />
        

        {/* {indexRoutes.map((prop, key) => {
          return <Route path={prop.path} key={key} component={prop.component} />;
        })} */}



        
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
