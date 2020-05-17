import {ADDUSER} from "./Constant"

export const AddUser = (uid) =>{
    return {
        type: ADDUSER,
        userid : uid
    }
}