import * as actionTypes from './actionTypes';
import axios from 'axios';
import jwt from 'jsonwebtoken';

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
        email: email
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
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
    localStorage.removeItem('company');
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
        }, expireTime.getTime() / 1000);
    };
};

export const auth = (email) => {
    const data = {
        email: email
    }

    return dispatch => {
        dispatch(authStart());
        axios.post(`${process.env.REACT_APP_API_URL}/auth/checkemail`, data).then(result => {

            if (result.data.message === "E-mail found") {
                dispatch(emailValid(result.data))
            } else {
                dispatch(emailInValid())
            }

        }).catch(err => {
            dispatch(authFail(err));
        });
    }
}

export const authPassword = (email, password) => {
    const data = {
        email: email,
        password: password
    }

    return dispatch => {
        dispatch(passStart());
        axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data).then(result => {            
            if (result.data.code === 401) {
                dispatch(passWrong(email));
            } else {                
                const expDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 10) // 10 Jam dari backend node expressnya                            
                const setToken = localStorage.setItem('token', result.data.token);
                const companyId = localStorage.setItem('company',JSON.stringify({branch:result.data.branchId,company:result.data.companyId}));
                const setExpireTime = localStorage.setItem('expireIn', expDate);
                // localStorage.setItem('user', result.data.userId);
                // localStorage.setItem('comp', result.data.companyId);
                // localStorage.setItem('inst', result.data.data.userlevel);
                Promise.all([setToken,setExpireTime,companyId]).then(()=> {
                    dispatch(authSuccess(result));
                    dispatch(checkAuthTimeout(expDate));
                })
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
        const companyId = localStorage.getItem('company');
        

        if (!token || companyId == null) {
            dispatch(logout());
        } else {
            
            const exptime = new Date(localStorage.getItem('expireIn'));
            const now = new Date();
            const condition = now.getTime() > exptime.getTime();
            
            // const expireTime = new Date(localStorage.getItem('expireIn'));
            if (condition) {
                dispatch(logout());
            }

            let data_user = null;
            const JWT_DECODE = jwt.verify(localStorage.getItem('token'), 'secretmasojodibukak');
            const data = {
                data: {
                    token: localStorage.getItem('token'),                                        
                    userId: JWT_DECODE.userId,
                    nameUser: JWT_DECODE.nameUser,
                    name_company: JWT_DECODE.name_company,
                    companyId: JWT_DECODE.companyId,
                    branchId: companyId !== null ? companyId.branch :null,
                    createdBy: JWT_DECODE.nameUser + ' (' + JWT_DECODE.userId + ')',
                    updatedBy: JWT_DECODE.nameUser + ' (' + JWT_DECODE.userId + ')',
                }
            }
            dispatch(authSuccess(data));
            // dispatch(checkAuthTimeout((expireTime.getTime()) - (new Date().getTime())));
        }
    }
}


// harus install redux-thunk