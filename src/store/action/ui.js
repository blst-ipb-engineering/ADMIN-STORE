import * as actionTypes from './actionTypes';

export const toggleNotification = (payload) => {
    return {
        type:actionTypes.TOGGLE_NOTIFICATION,
        payload
    }
}