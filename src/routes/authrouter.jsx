import Dashboard from "../views/Dashboard/Dashboard.jsx";
import Notifications from "../views/Notifications/Notifications.jsx";
import Icons from "../views/Icons/Icons.jsx";
import Typography from "../views/Typography/Typography.jsx";
import TableList from "../views/TableList/TableList.jsx";
import Maps from "../views/Maps/Maps.jsx";
import UserPage from "../views/UserPage/UserPage.jsx";
import Login from '../layouts/Login/Login';


var authRoutes = [
  {
    path: "/",
    name: "Log In",
    icon: "nc-icon nc-bank",
    component: Login
  },
  
];
export default authRoutes;
