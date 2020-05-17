import React from "react";
import {AsyncStorage} from "react-native";
import { Text, View, StyleSheet, Button, PermissionsAndroid } from 'react-native';
import firebase from "react-native-firebase";

export default class LoadingPage extends React.Component{
    constructor(props){
        super(props)
        this.url="http://192.168.43.195:8080"
    }

     componentDidMount() {
        
        // firebase.initializeApp({
        //     apiKey: "AIzaSyAlxIX3RjcXw-ZD-W1Og7ufh2k-RandqF8",
        //     authDomain: "foodordering-f210f.firebaseapp.com",
        //     databaseURL: "https://foodordering-f210f.firebaseio.com",
        //     projectId: "foodordering-f210f",
        //     storageBucket: "foodordering-f210f.appspot.com",
        //     messagingSenderId: "1098214247308",
        //     appId: "1:1098214247308:web:82c94763351a16349364a9",
        //     measurementId: "G-GZHVKSHWYV"
        // })
        this.retrieveData();
        // this.messageListener();
  }

 //   messageListener = async () => {

 //   this.notificationListener = firebase.notifications().onNotification((notification) => {
      // this.getPendingRequests();
    //   console.log("1")
    //   alert("1")
    //   console.log(notification + "1")
    //   alert(JSON.stringify(notification))
//    });

 //   this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    //   console.log("2")
    //   alert("2")
    //   console.log(notificationOpen + "2")
    //   alert(JSON.stringify(notification))
      // axios.get(this.url + "/restaurant/foods/pending/" + this.rid)
      //     .then((response) => {
      //         // this.props.history.push({
      //         //     pathname: "/restauranthomepage",
      //         //     state: {
      //         //       rid: id
      //         //     } 
      //         //   })
      //         console.log("Response Open=", response)
      //     })
      //     .catch((error) => {
      //         console.log("Error=", error)
      //     })
      // this.setState({
      //     array: [...this.state.array, notificationOpen.notification.data.message]
      // })
      // console.log("Array=", this.state.array)
      
 //   });

//    const notificationOpen = await firebase.notifications().getInitialNotification();
//    if (notificationOpen) {
        // console.log("3")
        // alert("3")
        // console.log(notificationOpen+" ")
        // alert(notificationOpen+" ")
      // this.setState({
      //     array: [...this.state.array, notification.data.message]
      // })
      // console.log("Array=", this.state.array)
    //   this.props.history.push({
    //     pathname: "/restauranthomepage",
    //     state: {
    //       url : this.url,
    //       rid: id
    //     } 
    //   })
      
//    }

//    this.messageListener = firebase.messaging().onMessage((message) => {
        // console.log("4")
        // alert("4"+message)
        // alert(message)
      // this.setState({
      //     array: [...this.state.array, message]
      // })
      // // this.array.push(notificationOpen.notification.data.message)
      // console.log("Array=", this.state.array)
      
      
//    });
//  }

  retrieveData = async() => {
        try{
            const enduser = await AsyncStorage.getItem("enduser");
            const id = await AsyncStorage.getItem("id");
            if(enduser == null || enduser ==""){
                alert("Not logged in yet")
                this.props.history.push({
                    pathname:"/login",
                    state:{
                        url : this.url
                    }});
            }
            else if((enduser!=null || enduser=="") && (id!=null || id=="")){
                
                if(enduser == "restaurant"){
                    this.props.history.push({
                    pathname:"/restauranthomepage",
                    state:{
                        url : this.url,
                        rid : Number(id)
                    }});
                    
                }
                else if(enduser == "user"){
                    this.props.history.push({
                        pathname:"/restaurantlist",
                        state:{
                            url:this.url,
                            userid: Number(id)
                        }
                        });
                    alert("User Logged In")
                }
                else if(enduser == "delivery"){
                    this.props.history.push({
                        pathname:"/deliveryhomepage",
                        state:{
                            url:this.url,
                            did: Number(id)
                        }
                        });
                    alert("Delivery Logged In")
                }
            }
        }
        catch(error){

        }
    }

    render(){
        return (
            
            <Button title="Loading" />
        )
    }

}
    