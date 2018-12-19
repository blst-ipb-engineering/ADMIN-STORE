import * as actionType from '../action/actionTypes';
import {updateObject} from '../uitlity';

const initialState = {
    email: null,
    emailValid: false,
    password:null,
    token: null,
    userId: null,
    loading: false,
    error: null,
    inst:null, // is admin,
    authRedirectPath: '/dashboard'
    
};

const auth = (state = initialState, action ) =>  {
    
    switch(action.type) {
        case (actionType.AUTH_START):
            return updateObject(state, {
                loading:true, 
                error:null, 
                email: null
            });

        case (actionType.AUTH_LOGOUT):
            return updateObject(state, {
                loading:false, 
                error:null, 
                email: null,
                emailValid:false               
            });
            
        case (actionType.EMAIL_VALID):
            return updateObject( state, {
                emailValid:true, 
                loading:false,
                error: null, 
                email:action.email.data
            });

        case (actionType.EMAIL_INVALID):
            return updateObject( state, {
                emailValid:false, 
                loading:false, 
                error: "E-Mail Account Not Found",
                email: null
            });
        
        
        case (actionType.PASS_START):
            return updateObject(state, {
                loading:true,                 
            });

        case (actionType.PASS_INVALID):            
            return updateObject( state, {                            
                emailValid:true, 
                loading:false, 
                error: "Wrong Password",                
            });

        case (actionType.AUTH_SUCCESS):        
            return updateObject( state, {
                token:action.authData.data.token,
                userId: action.authData.data.userId,
                loading:true,
                inst:action.authData.data.userlevel
            });
        case (actionType.SET_AUTH_REDIRECT_PATH):        
            return updateObject( state, {
                authRedirectPath:action.path,                
            });
        default:       
        return state;
    }
    
}

export default auth; 