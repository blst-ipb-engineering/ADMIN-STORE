import axios from 'axios';
import querystring from 'querystring';
import { createStore } from 'redux';
import authreducers from "../store/reducer/auth";
// import { connect } from 'react-redux';
import jwt from 'jsonwebtoken'
import { logout } from '../store/action/auth';



const store = createStore(authreducers); // redux api for get store without using connect

const token = localStorage.getItem('token');
const exptime = new Date(localStorage.getItem('expireIn'));
const now = new Date();

// // validasi jika token expired
const condition = now.getTime() > exptime.getTime();
let data_user = null;

if (condition) {
  store.dispatch(logout());
}

function getToken() {
  const JWT_DECODE = jwt.verify(localStorage.getItem('token'), 'secretmasojodibukak');
  const COMPANY = JSON.parse(localStorage.getItem('company')); 
  
  return data_user = {
    userId: JWT_DECODE.userId,
    nameUser: JWT_DECODE.nameUser,
    name_company: JWT_DECODE.name_company,
    companyId: JWT_DECODE.companyId,
    branchId: COMPANY !== null  ? COMPANY.branch : null,
    createdBy: JWT_DECODE.nameUser + ' (' + JWT_DECODE.userId + ')',
    updatedBy: JWT_DECODE.nameUser + ' (' + JWT_DECODE.userId + ')',
  }
}




// console.log(object)

// membuat middleware agar bisa akses state store redux di non connectfunction

// const data_user = {
// userId: store.userId,
// nameUser: store.nameUser,
// name_company: store.name_company,
// companyId: store.companyId,
// createdBy: store.nameUser + ' (' + store.userId + ')',
// updatedBy: store.nameUser + ' (' + store.userId + ')',
// }

const HOSTNAME = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const API_SERVICES = {
  Login: `${HOSTNAME}/auth/login`,
  CheckEmail: `${HOSTNAME}/auth/checkemail`,
  SignUp: `${HOSTNAME}/auth/signup`,
  ListEmployee: `${HOSTNAME}/auth/listem`,

  ProductIndex: `${HOSTNAME}/product/index`,
  ProductAdd: `${HOSTNAME}/product/add`,
  ProductEdit: `${HOSTNAME}/product/edit`,
  ProductUpdate: `${HOSTNAME}/product/update`,
  ProductDelete: `${HOSTNAME}/product/delete`,
  ProductCategoryGeneral: `${HOSTNAME}/category/general`,
  ProductCategory: `${HOSTNAME}/category`,
  CategoryProductLocalAdd: `${HOSTNAME}/category/add`,
  AuthorIndex: `${HOSTNAME}/author`,
  AuthorCreate: `${HOSTNAME}/author/add`,
  MaterialIndex: `${HOSTNAME}/material`,
  MaterialCreate: `${HOSTNAME}/material/add`,
  SlideBarCreate: `${HOSTNAME}/slidebar/add`,
  SlideBarGet: `${HOSTNAME}/slidebar/index`,
  SlideBarUpdate: `${HOSTNAME}/slidebar/update`,
  SlideBarDelete: `${HOSTNAME}/slidebar/delete`,
  ListPayment: `${HOSTNAME}/orderproduct/subtotal`,
  WaitingPayment: `${HOSTNAME}/orderproduct/waiting`,

  ConfirmPayment: `${HOSTNAME}/order/updatepayment`,
  RejurnalPayment:`${HOSTNAME}/order/rejurnalpayment`,
  // modul ADMIN STORE untuk search Order yang sudah dikonfirmasi
  ListStatus: `${HOSTNAME}/order/list-status`,
  ListOrder: `${HOSTNAME}/orderproduct/searchorder`,
  ListOrderDetail: `${HOSTNAME}/orderproduct/searchorderdetail`,
  UpdateResi: `${HOSTNAME}/order/updateSending`,
  TakeThisOrder: `${HOSTNAME}/orderproduct/take-this-order`,
  DeclineThisOrder: `${HOSTNAME}/orderproduct/decline-this-order`,
  TrackingShip: `${HOSTNAME}/district-recomendation/tracking`,
  DashboardStat: `${HOSTNAME}/dashboard/index`,
  CategoryListCompany: `${HOSTNAME}/category/company`,
  BranchList: `${HOSTNAME}/auth/list-branch`,
  SetBranchSetting: `${HOSTNAME}/auth/set-branch-setting`,
  CheckBranchChosen: `${HOSTNAME}/auth/is-company-model-exsist`,
  CheckAccountFinance: `${HOSTNAME}/product/check-account-finance`,
}

const configFetch = (url, method, body, isJSON = false, extraHeaders = {}) => ({
  method,
  url,
  data: isJSON ? body : querystring.stringify(body),
  headers: {
    'Content-Type': isJSON ? 'application/json' : 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    ...extraHeaders
  }
});


// API PRODUCT
const ProductList = (contents) => {

  getToken();

  const content = {
    ...contents,
    ...data_user
  }

  const page = contents.page ? contents.page : 1;
  const limit = contents.limit ? contents.limit : 10;
  const sortby = contents.sortby ? contents.sortby : "name";
  const order = contents.order ? contents.order : "ASC";
  const name = contents.name ? contents.name : "";

  const url = API_SERVICES.ProductIndex + "/?page=" + page + "&limit=" + limit + "&sortby=" + sortby + "&name=" + name + "&orderby=" + order;
  return axios(configFetch(url, 'get', content)).then(result => result.data).catch(err => console.log(err))
}

const ProductAdd = (contents) => {

  getToken();

  const content = {
    ...contents,
    ...data_user
  }

  console.log(content)

  const url = API_SERVICES.ProductAdd;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const ProductEdit = (contents) => {

  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.ProductEdit;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const ProductUpdate = (contents) => {

  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  console.log(content)

  const url = API_SERVICES.ProductUpdate;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'put', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const ProductDelete = (contents) => {

  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.ProductDelete;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'delete', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}


const ProductCategoryGeneral = (contents) => {

  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.ProductCategoryGeneral;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'get', content, true, extraHeaders)).then(result => result.data).catch(err => console.log(err))
}

const ProductCategory = () => {

  getToken();
  const url = API_SERVICES.ProductCategory;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }
  return axios(configFetch(url, 'get', null, true, extraHeaders)).then(result => result.data).catch(err => console.log(err))
}

// WRITE NEW PRODUCT LOCAL CATEGORY
const NewCategoryAction = (contents) => {

  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.CategoryProductLocalAdd;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

// AUTHOR    
const AuthorIndex = (contents) => {

  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.AuthorIndex;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'get', content, true, extraHeaders))
    .then(result => result.data).catch(err => console.log(err));
}

const AuthorCreate = (contents) => {

  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.AuthorCreate;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

//SLIDEBAR

const getSlidebar = (contents) => {
  getToken()
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.SlideBarGet;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const CreateSlidebar = (contents) => {
  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.SlideBarCreate;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const updateSlidebar = (contents) => {
  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.SlideBarUpdate;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'put', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const deleteSlidebar = (contents) => {
  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.SlideBarDelete;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'delete', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}


// MATERIAL    
const MaterialIndex = (contents) => {

  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.MaterialIndex;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'get', content, true, extraHeaders))
    .then(result => result.data).catch(err => console.log(err));
}

const MaterialCreate = (contents) => {

  getToken();

  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.MaterialCreate;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const ListPayment = (contents) => {

  getToken();

  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.ListPayment;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const WaitingPayment = (contents) => {

  getToken();

  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.WaitingPayment;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const ConfirmPayment = (contents) => {

  getToken();

  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.ConfirmPayment;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'put', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const RejurnalPayment = (contents) => {

  getToken();

  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.RejurnalPayment;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'put', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const ListOrder = (contents) => {

  getToken();

  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.ListOrder;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => {
      return result.data
    }
    )
    .catch(err => console.log(err))
}

const ListOrderDetail = (contents) => {

  getToken();

  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.ListOrderDetail;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const ConfirmSend = (contents) => {

  getToken();

  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.UpdateResi;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'put', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const ListEmployee = (contents) => {

  getToken();

  const content = {
    ...contents,
    ...data_user,
  }

  // const id = data_user.companyId;
  const url = API_SERVICES.ListEmployee;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }

  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data.data)
    .catch(err => console.log(err))
}

const TakeThisOrder = (contents) => {
  getToken();
  const content = {
    ...contents,
    ...data_user,
  }
  // const id = data_user.companyId;
  const url = API_SERVICES.TakeThisOrder;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }
  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const DeclineThisOrder = (contents) => {
  getToken();
  const content = {
    ...contents,
    ...data_user,
  }
  // const id = data_user.companyId;
  const url = API_SERVICES.DeclineThisOrder;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }
  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const TrackingShip = (contents) => {
  getToken();
  const content = {
    ...contents,
    ...data_user
  }
  const url = API_SERVICES.TrackingShip;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }
  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const ListStatus = (contents) => {
  getToken();
  const content = {
    ...contents,
    ...data_user
  }
  const url = API_SERVICES.ListStatus;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }
  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const DashboardStat = (contents) => {
  getToken();
  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.DashboardStat;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }
  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const CategoryListCompany = (contents) => {
  getToken();
  const content = {
    ...contents,
    ...data_user
  }
  const url = API_SERVICES.CategoryListCompany;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }
  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const ListBranch = (contents) => {
  getToken();
  const content = {
    ...contents,
    ...data_user
  }
  const url = API_SERVICES.BranchList;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }
  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

// mengarahkan untuk produk diletakkan di branch yang mana
const CheckBranchChosen = (contents) => {
  getToken();
  const content = {
    ...contents,
    ...data_user
  }
  const url = API_SERVICES.CheckBranchChosen;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }
  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const SetBranchSetting = async (contents) => {
  await getToken();

  const content = {
    ...contents,
    ...data_user
  }

  const url = API_SERVICES.SetBranchSetting;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }
  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}

const CheckAccountFinance = (contents) => {
  getToken();

  const content = {
    ...contents
  }

  const url = API_SERVICES.CheckAccountFinance;
  const extraHeaders = {
    Authorization: `Bearer ` + localStorage.getItem('token')
  }
  return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err => console.log(err))
}






export {
  ProductList,
  ProductAdd,
  ProductEdit,
  ProductUpdate,
  ProductDelete,
  ProductCategoryGeneral,

  NewCategoryAction,
  ProductCategory,

  AuthorIndex,

  MaterialIndex,
  MaterialCreate,
  AuthorCreate,
  data_user,

  CreateSlidebar,
  getSlidebar,
  updateSlidebar,
  deleteSlidebar,

  // Payment Confirmation
  ListStatus,
  ListPayment,
  WaitingPayment,
  ConfirmPayment,
  RejurnalPayment,
  ListOrder,
  ConfirmSend,
  ListOrderDetail,

  ListEmployee,
  TakeThisOrder,
  DeclineThisOrder,
  TrackingShip,

  DashboardStat,
  CategoryListCompany,
  ListBranch,
  CheckBranchChosen,
  SetBranchSetting,
  // cek integrasi ke tblAccount,
  CheckAccountFinance
}