import axios from 'axios';
import querystring from 'querystring';
import jwt from 'jsonwebtoken';

const JWT_DECODE = jwt.verify(localStorage.getItem('token'),'secretmasojodibukak'); 

const data_user = {
  userId:JWT_DECODE.userId,
  companyId:JWT_DECODE.companyId
}

const HOSTNAME = 'http://localhost:8080';

const API_SERVICES = {
    Login : `${HOSTNAME}/auth/login`,
    CheckEmail : `${HOSTNAME}/auth/checkemail`,
    SignUp : `${HOSTNAME}/auth/signup`,
    ProductIndex : `${HOSTNAME}/product/index`,
    ProductAdd:`${HOSTNAME}/product/add`,
    ProductEdit:`${HOSTNAME}/product/edit`,
    ProductUpdate: `${HOSTNAME}/product/update`,
    ProductDelete: `${HOSTNAME}/product/delete`,
    ProductCategoryGeneral : `${HOSTNAME}/category/general`,
    ProductCategory : `${HOSTNAME}/category`,
    CategoryProductLocalAdd: `${HOSTNAME}/category/add`,
    AuthorIndex: `${HOSTNAME}/author`,
    AuthorCreate: `${HOSTNAME}/author/add`,
    MaterialIndex: `${HOSTNAME}/material`,
    MaterialCreate: `${HOSTNAME}/material/add`
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
  const ProductList =(contents) => {

      const content = {
        ...contents,
        ...data_user
      }

      console.log(content)
      const url = API_SERVICES.ProductIndex;
      return axios(configFetch(url, 'get', content)).then(result => result.data.result).catch(err=>console.log(err))
  }

  const ProductAdd = (contents) => {

    const content = {
      ...contents,
      ...data_user
    }

    const url = API_SERVICES.ProductAdd;
    const extraHeaders = {
      Authorization: `Bearer `+localStorage.getItem('token')
    }

    return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err=>console.log(err))
  }

  const ProductEdit = (contents) => {

    const content = {
      ...contents,
      ...data_user
    }

    const url = API_SERVICES.ProductEdit;
    const extraHeaders = {
      Authorization: `Bearer `+localStorage.getItem('token')
    }

    return axios(configFetch(url, 'post', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err=>console.log(err))
  }

  const ProductUpdate = (contents) => {

    const content = {
      ...contents,
      ...data_user
    }

    const url = API_SERVICES.ProductUpdate;
    const extraHeaders = {
      Authorization: `Bearer `+localStorage.getItem('token')
    }

    return axios(configFetch(url, 'put', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err=>console.log(err))
  }

  const ProductDelete = (contents) => {

    const content = {
      ...contents,
      ...data_user
    }

    const url = API_SERVICES.ProductDelete;
    const extraHeaders = {
      Authorization: `Bearer `+localStorage.getItem('token')
    }

    return axios(configFetch(url, 'delete', content, true, extraHeaders))
    .then(result => result.data)
    .catch(err=>console.log(err))
  }
  

  const ProductCategoryGeneral =(contents) => {

    const content = {
      ...contents,
      ...data_user
    }

    const url = API_SERVICES.ProductCategoryGeneral;
    const extraHeaders = {
        Authorization: `Bearer `+localStorage.getItem('token')
      }
          
    return axios(configFetch(url, 'get', content, true, extraHeaders)).then(result => result.data).catch(err=>console.log(err))
    }
  
  const ProductCategory = () => {
    const url = API_SERVICES.ProductCategory;
    const extraHeaders = {
      Authorization: `Bearer `+localStorage.getItem('token')
    }
    return axios(configFetch(url, 'get', null, true, extraHeaders)).then(result => result.data).catch(err=>console.log(err))
  }

  // WRITE NEW PRODUCT LOCAL CATEGORY
  const NewCategoryAction = (contents) => {

    const content = {
      ...contents,
      ...data_user
    }

      const url = API_SERVICES.CategoryProductLocalAdd;
      const extraHeaders = {
        Authorization: `Bearer `+localStorage.getItem('token')
      }

      return axios(configFetch(url, 'post', content, true, extraHeaders))
      .then(result => result.data)
      .catch(err=>console.log(err))
  } 

  // AUTHOR    
  const AuthorIndex = (contents) => {

    const content = {
      ...contents,
      ...data_user
    }

    const url = API_SERVICES.AuthorIndex;
    const extraHeaders = {
      Authorization: `Bearer ` +localStorage.getItem('token')
    }   

    return axios(configFetch(url,'get',content,true,extraHeaders))
    .then(result => result.data).catch(err=>console.log(err));
  }

  const AuthorCreate = (contents) => {
    const content = {
      ...contents,
      ...data_user
    }

    const url = API_SERVICES.AuthorCreate;
    const extraHeaders = {
      Authorization: `Bearer ` +localStorage.getItem('token')
    }

    return axios(configFetch(url,'post',content,true,extraHeaders))
    .then(result=>result.data)
    .catch(err=>console.log(err))
  }

  // MATERIAL    
  const MaterialIndex = (contents) => {
    const content = {
      ...contents,
      ...data_user
    }

    const url = API_SERVICES.MaterialIndex;
    const extraHeaders = {
      Authorization: `Bearer ` +localStorage.getItem('token')
    }   

    return axios(configFetch(url,'get',content,true,extraHeaders))
    .then(result => result.data).catch(err=>console.log(err));
  }

  const MaterialCreate = (contents) => {

    const content = {
      ...contents,
      ...data_user
    }

    const url = API_SERVICES.MaterialCreate;
    const extraHeaders = {
      Authorization: `Bearer ` +localStorage.getItem('token')
    }

    return axios(configFetch(url,'post',content,true,extraHeaders))
    .then(result=>result.data)
    .catch(err=>console.log(err))
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
  AuthorCreate
}