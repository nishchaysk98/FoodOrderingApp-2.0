import {ADDITEM, REMOVEITEM, PLACEORDER, GETLOCATION, GETLOCATIONFAILURE, GETLOCATIONSUCCESS} from "./AddConstants";
import {initialState} from "./AddInitialState";

export function Reducer(state = initialState, action){

    if(action.type == ADDITEM)
    {
      if(state.rid != action.rid){
        return {
          items:[action.addItem],
          totalprice: action.price,
          rid: action.rid
        }
      }
      return {
        ...state,
        items : [...state.items, action.addItem],
        totalprice : (state.totalprice + action.price),
        rid: action.rid
        }
    }
    else if(action.type == REMOVEITEM){
      return state;
    }
    else if(action.type == PLACEORDER){
      return {
        ...state,
        placed : true
      }
    }
    else if(action.type == GETLOCATION){
      return {
        ...state,
        getlocation: 0
      }
    }
    else if(action.type == GETLOCATIONSUCCESS){
      return {
        ...state,
        getlocation: 1
      }
    }
    else if(action.type == GETLOCATIONFAILURE){
      return {
        ...state,
        getlocation: -1
      }
    }
    else{
      return state
    }
}