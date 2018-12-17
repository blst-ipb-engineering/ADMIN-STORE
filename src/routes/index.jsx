import Dashboard from "../layouts/Dashboard/Dashboard.jsx";
import Login from '../layouts/Login/Login';


var indexRoutes = [
    { path: "/dashboard", name: "Home", component: Dashboard },
    { path: "/", name: "Login", component: Login }
];

export default indexRoutes;
