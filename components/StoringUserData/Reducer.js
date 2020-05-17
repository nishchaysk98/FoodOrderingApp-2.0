import {ADDUSER} from "./Constants"
import {initialState} from "./InitialState"


const Reducer = (state=initialState, action) =>{
    if(action.type == ADDUSER){
        return {
            userid : action.userid
        }
    }
    else
    {
        return state
    }
}