import * as actionTypes from './actionTypes';

export const toggleNotification = (payload) => {
    return {
        type:actionTypes.TOGGLE_NOTIFICATION,
        payload
    };
}

export const toggleLoading = (data) => {
    return {
        type:actionTypes.TOGGLE_LOADING,
        data: data
    };
}

export const toggleToaster = (payload) => {
    return {
        type: actionTypes.TOGGLE_TOASTER,
        payload
    };
}