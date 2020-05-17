import {ADDITEM, REMOVEITEM, PLACEORDER, GETLOCATION, GETLOCATIONFAILURE, GETLOCATIONSUCCESS} from "./AddConstants";

export function AddItem(item, price_1, rid_1){
  return {
    type : ADDITEM,
    addItem : item,
    price: price_1,
    rid : rid_1
  }
}
export function RemoveItem(){
  return {
    type : REMOVEITEM
  }
}
export function PlaceOrder(){
  return {
    type : PLACEORDER
  }
}
export function GetLocation(){
  return {
    type: GETLOCATION
  }
}
export function GetLocationSuccess(){
  return {
    type: GETLOCATIONSUCCESS
  }
}

export function GetLocationFailure(){
  return {
    type: GETLOCATIONFAILURE
  }
}
