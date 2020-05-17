import {createStackNavigator} from "react-navigation-stack";
import {createAppContainer} from "react-navigation";
import RestaurantList from "./components/RestaurantList"
import AddItemComponent from "./components/AddItem"
import FoodList from "./components/FoodList";

const screens = {
    RestaurantList : {
        screen : RestaurantList
    },
    FoodList : {
        screen : FoodList
    },
    AddItemComponent : {
        screen : AddItemComponent
    }
}

const AppScreens = createStackNavigator(screens);
export default createAppContainer(AppScreens);