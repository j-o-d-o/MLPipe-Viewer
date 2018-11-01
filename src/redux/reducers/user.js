import * as types from 'redux/actionTypes';
import { Map } from "immutable";


const initialState = Map({
    _id: '',
    token : '',
    email : '',
    name: '',
    role: 0
});

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case types.GET_USER:
            return state;
        case types.UPDATE_USER:
            return Map(action.user);
        case types.DELETE_USER:
            return initialState;
        default:
            return state;
    }
}