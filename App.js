import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Login from './components/Login';
import Signup from "./components/Signup";
import LoginSignup from "./components/LoginSignup";
import FoodList from "./components/FoodList";
import { Provider } from "react-redux";
import AddItemComponent from "./components/AddItem"
import { store } from "./store";
import { NativeRouter, Route, Link } from "react-router-native";
import RestaurantList from "./components/RestaurantList";
import RestaurantAddFood from "./components/RestaurantAddFood";
import RestaurantHomePage from './components/RestaurantHomePage';
import LoadingPage from "./components/LoadingPage";
import DeliveryHomePage from "./components/DeliveryHomePage";
import UserProfile from "./components/UserProfile";
import RestaurantProfile from "./components/RestaurantProfile";
// import Navigator from "./ScreenStack";
import firebase from "react-native-firebase";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.url = "http://192.168.43.195:8080";
    // this.state = {
    //   endUser: "User",
    //   username: "Shantisagar@Chamarajpete",
    //   password: "Shantisagar123",
    // }
  }
   componentDidMount() {
    // alert("mounting")
    // firebase.initializeApp({
    //   apiKey: "AIzaSyAlxIX3RjcXw-ZD-W1Og7ufh2k-RandqF8",
    //   authDomain: "foodordering-f210f.firebaseapp.com",
    //   databaseURL: "https://foodordering-f210f.firebaseio.com",
    //   projectId: "foodordering-f210f",
    //   storageBucket: "foodordering-f210f.appspot.com",
    //   messagingSenderId: "1098214247308",
    //   appId: "1:1098214247308:web:82c94763351a16349364a9",
    //   measurementId: "G-GZHVKSHWYV"
    // })
    // await this.messageListener()
  }

  // messageListener = async () => {
  //   this.notificationListener = firebase.notifications().onNotification((notification) => {
  //     // this.getPendingRequests();
  //     console.log("1")
  //   });

  //   this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
  //     // axios.get(this.url + "/restaurant/foods/pending/" + this.rid)
  //     //     .then((response) => {
  //     //         // this.props.history.push({
  //     //         //     pathname: "/restauranthomepage",
  //     //         //     state: {
  //     //         //       rid: id
  //     //         //     } 
  //     //         //   })
  //     //         console.log("Response Open=", response)
  //     //     })
  //     //     .catch((error) => {
  //     //         console.log("Error=", error)
  //     //     })
  //     // this.setState({
  //     //     array: [...this.state.array, notificationOpen.notification.data.message]
  //     // })
  //     // console.log("Array=", this.state.array)
  //     console.log("2")
  //   });

  //   const notificationOpen = await firebase.notifications().getInitialNotification();
  //   if (notificationOpen) {
  //     // this.setState({
  //     //     array: [...this.state.array, notification.data.message]
  //     // })
  //     // console.log("Array=", this.state.array)
  //     this.props.history.push({
  //       pathname: "/restauranthomepage",
  //       state: {
  //         url : this.url,
  //         rid: id
  //       } 
  //     })
  //     console.log("3")

  //   }

  //   this.messageListener = firebase.messaging().onMessage((message) => {
  //     // this.setState({
  //     //     array: [...this.state.array, message]
  //     // })
  //     // // this.array.push(notificationOpen.notification.data.message)
  //     // console.log("Array=", this.state.array)
  //     console.log("4")
  //   });
  // }


    render() {
      return (
        <Provider store={store}>
          <View style={{ alignItems: "center", backgroundColor: "orange" }}><Text style={{ fontWeight: "bold", padding: 20 }}>Food Ordering App</Text></View>
          <NativeRouter>
            <Route exact path="/" component={LoadingPage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/restaurantlist" component={RestaurantList} />
            <Route exact path="/foodlist" component={FoodList} />
            <Route exact path="/add" component={AddItemComponent} />
            <Route exact path="/restaurantaddfood" component={RestaurantAddFood} />
            <Route exact path="/restauranthomepage" component={RestaurantHomePage} />
            <Route exact path="/deliveryhomepage" component={DeliveryHomePage} />
            <Route exact path="/userprofile" component={UserProfile} />
            <Route exact path="/restaurantprofile" component={RestaurantProfile} />
            
          </NativeRouter>
        </Provider>
      );
    }


  }