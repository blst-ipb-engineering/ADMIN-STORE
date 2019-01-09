import * as actionType from '../action/actionTypes';
import {updateObject} from '../uitlity';

const initialState = {
    snackBarOption: {
        isOpen: false,
        text: '',
        autoHideDuration: 100000000
    },
    isLoading: false
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
        
            default:       
        return state;
    }
}


export default ui;