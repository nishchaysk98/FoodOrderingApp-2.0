import {createStore} from "redux";
import {Reducer} from "./components/Add/AddReducer";

export const store = createStore(Reducer);