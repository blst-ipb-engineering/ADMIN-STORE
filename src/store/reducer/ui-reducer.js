import * as actionType from '../action/actionTypes';
import {updateObject} from '../uitlity';

const initialState = {
    snackBarOption: {
        isOpen: false,
        text: '',
        autoHideDuration: 100000000
    },
    isLoading: false,
    toaster: {  isOpenToast: false,
                toastMessage: null,
                toastType:'success', 
            }
}

const ui = (state = initialState, action) => {    
    switch(action.type){
        case (actionType.TOGGLE_NOTIFICATION) :
            return updateObject(state, {
                snackBarOption:{                
                    ...action.payload
                },                 
            });
        case (actionType.TOGGLE_LOADING) :
            return updateObject(state, {
                isLoading:action.data                 
            });
        case (actionType.TOGGLE_TOASTER) :
            return updateObject(state, {
                toaster:{
                    ...action.payload
                }                 
            });
        
            default:       
        return state;
    }
}


export default ui;