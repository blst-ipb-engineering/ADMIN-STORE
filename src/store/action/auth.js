import * as actionTypes from './actionTypes';
import axios from 'axios';
// import { Redirect } from 'react-router-dom';


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const emailValid = (email) => {
    return {
        type: actionTypes.EMAIL_VALID,
        email: email
    };
}

export const emailInValid = () => {
    return {
        type: actionTypes.EMAIL_INVALID,       
    };
}

export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    }
}

export const passStart = () => {
    return {
        type: actionTypes.PASS_START
    }
}

export const passWrong = (email) => {
    return {
        type: actionTypes.PASS_INVALID,
        email:email
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error : error
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}


export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expireIn');
    localStorage.removeItem('user');
    localStorage.removeItem('comp');
    localStorage.removeItem('inst');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}





// action jika token kadaluarsa
export const checkAuthTimeout = (expireTime) => {      
    return dispatch => {
        setTimeout(() => { 
            dispatch(logout());
        }, expireTime.getTime() /1000);
    };
};

export const auth = (email) => {
    const data = {
        email : email
    }

    return dispatch => {
        dispatch(authStart());
        axios.post('http://localhost:8080/auth/checkemail', data).then(result => {            
            if(result.data.message === "E-mail found"){
                dispatch(emailValid(result.data))
            }else{
                dispatch(emailInValid())
            }

        }).catch(err => {           
            dispatch(authFail(err));
        });
    }
}

export const authPassword = (email,password) =>{
    const data= {
        email:email,
        password :password
    }
  

    return dispatch => {          
        dispatch(passStart());     
        axios.post('http://localhost:8080/auth/login', data).then(result => {                        
            if(result.data.code === 401){
                dispatch(passWrong(email));
            }else{                
                const expDate = new Date(new Date().getTime() + 1000*60*60*10) // 10 Jam dari backend node expressnya                            
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('expireIn', expDate);
                localStorage.setItem('user', result.data.userId);
                localStorage.setItem('comp', result.data.data.companyId);
                localStorage.setItem('inst', result.data.data.userlevel);
                dispatch(authSuccess(result));                 
                dispatch(checkAuthTimeout(expDate));    

            }
        }).catch(err => {
            console.log(err);
            dispatch(authFail(err));
        });
    }
};

export const authCheckState = () => {
    return dispatch => {        
        const token = localStorage.getItem('token');           
        if(!token) {
            dispatch(logout());
        }else {
            const expireTime = new Date(localStorage.getItem('expireIn'));                   
            if (expireTime.getTime() < new Date().getTime()){
                dispatch(logout());
            }

            const data = {
                data: {
                    token:localStorage.getItem('token'),
                    userId:localStorage.getItem('user'),
                    userlevel:localStorage.getItem('inst')
                }
            }            
            dispatch(authSuccess(data));            
            // dispatch(checkAuthTimeout((expireTime.getTime()) - (new Date().getTime())));
        }
    }
}


// harus install redux-thunk