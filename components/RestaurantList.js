import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet,Button, AsyncStorage,Alert,Image } from 'react-native';
import { Link } from 'react-router-native';
import {connect} from "react-redux";
import {store} from "../store";
import firebase from "react-native-firebase";
import axios from "axios";
import { PlaceOrder } from "./Add/AddActionCreators";

class RestaurantList extends React.Component {
  constructor(props) {
    super(props);
    this.url = this.props.location.state.url;
    this.userid = this.props.location.state.userid;
    this.state = {
      load: false,
      loadeddata: [],
      globalstatechanged : false
    };

    // this.data = [
    //   {
    //     id: 1,
    //     token:[""],
    //     name: "Shantisagar",
    //     location:"Chamrajpete",
    //     isopen: false,
    //     rating:0.0,
    //     picture:"",
    //     geolocationX:0.0,
    //     geolocationY:0.0
    //   },
    //   {
    //     id: 2,
    //     token:[""],
    //     name: "Parijatha",
    //     location:"Kundapura",
    //     isopen: false,
    //     rating:0.0,
    //     picture:"",
    //     geolocationX:0.0,
    //     geolocationY:0.0
    //   },
    // ];
  }

  async componentDidMount() {
    firebase.initializeApp({
            apiKey: "AIzaSyAlxIX3RjcXw-ZD-W1Og7ufh2k-RandqF8",
            authDomain: "foodordering-f210f.firebaseapp.com",
            databaseURL: "https://foodordering-f210f.firebaseio.com",
            projectId: "foodordering-f210f",
            storageBucket: "foodordering-f210f.appspot.com",
            messagingSenderId: "1098214247308",
            appId: "1:1098214247308:web:82c94763351a16349364a9",
            measurementId: "G-GZHVKSHWYV"
        })

    fetch(this.url+"/user/restaurants/"+this.userid)
      .then(response => response.json())
      .then(data => {
        this.setState({
          load: true,
          loadeddata: data, //Used in future for Real Api
        });
      })
      .catch(() => {});

      await this.checkPermission()
      await this.messageListener()
  }

  checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        console.log(enabled)
        if (enabled) {
            this.getFcmToken();
        } else {
            this.requestPermission();
        }
    }
    getFcmToken = async () => {
        this.fcmToken = await firebase.messaging().getToken();
        
        if (this.fcmToken) {
            
            axios.put(this.url + "/user/addfcm/" + this.userid + "/" + this.fcmToken)
                .then((response) => {
                    console.log("response", response.data)
                    
                })
                .catch((error) => {
                    console.log("error", error)
                    alert(JSON.stringify(error))
                })
        } else {
            console.log('Failed No token received');
        }
    }
    requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission();
            console.log("Permission granted")
        } catch (error) {
            console.log("Permission rejected")
        }
    }
    messageListener = async () => {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            console.log(JSON.stringify(notification._data.message))
            alert(notification._data.message)
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            
        });

        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
             
        }

        this.messageListener = firebase.messaging().onMessage((message) => {
           
        });
    }

 removeData = async()=>{
            try{
                await AsyncStorage.setItem("enduser","")
                await AsyncStorage.setItem("id","")
            }
            catch(err){
                alert(err)
            }
  }
  onLogout = () =>{
        
        axios.post(this.url + "/user/logout/" + this.userid+"/"+this.fcmToken)
                .then((response) => {
                    if(response.data == 1){
                        this.removeData()
                        this.props.history.push("/")
                        alert("Logout Success")
                    }
                    else if(response.data == 0) {
                        this.removeData()
                        this.props.history.push("/")
                        alert("Logout Failed")
                    }
                    else{
                        alert("Some Technical issue! Try Again")
                    }
                })
                .catch((error) => {
                    // alert(error)
                    console.log("Error=", error)
                })
    }

    onViewProfile = () => {
        this.props.history.push({
            pathname: "/userprofile",
            state: {
                url: this.url,
                userid : this.userid
            }
        })
    }

  render() {
    var loadstate = this.state.load;
    return (
      <View style={{flex:1}}>

        <ScrollView>
        <View style={{margin:10}}>
            <Button title="View your Profile" onPress={this.onViewProfile}/>
        </View>
        {
            loadstate ? <FlatList
            data={this.state.loadeddata}
            renderItem={({ item })=><IndivItem itemrender={item} url={this.url} userid={this.userid}/>}/> : <Text style={{textAlign:"center",marginTop:10}}>Loading Restaurants for you</Text>
        }
        <Button title="Logout" onPress={this.onLogout}/>
        </ScrollView>
      </View>
    );
  }
}

function IndivItem(props) {
    const linkto = "/foodlist";
  return (
    <View style={styles.style1}>
      <Link to={{
        pathname: linkto,
        state: {
          url : props.url,
          userid : props.userid,
          rid: props.itemrender.id
        }}
        }>
        <View style={{width:'100%', backgroundColor:"lightgrey",padding:10}}>
            <Image  style={styles.logo} source={{uri: "https://firebasestorage.googleapis.com/v0/b/foodordering-f210f.appspot.com/o/Sun%20May%2003%202020%2008%3A03%3A07%20GMT%2B0530%20(IST)-IMG_20200427_175358.jpg?alt=media&token=b73b5cca-7438-4818-a329-bd3ab86b925a"}}
            />
          <View style={{flexDirection:"column",flex:1, padding:10, width:'100%'}}>
            <Text style={{width:'100%', fontWeight:"bold", fontSize:18, flex:1}}>{props.itemrender.name}</Text>
            <Text style={{fontSize:14, flex:1, paddingLeft:30}}>Location: {props.itemrender.location}</Text>
            <Text style={{fontSize:14, flex:1, paddingLeft:30}}>Availability: {props.itemrender.isopen?"Open":"Closed"}</Text>
            <Text style={{fontSize:14, flex:1, paddingLeft:30}}>Rating {props.itemrender.rating}</Text>
          </View>
        </View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  style1 : {
    padding:10,
    width:'100%'
  },
  logo: {
    width: 66,
    height: 58,
  }
})

function mapStateToProps(state) {
  return ({
    items : state.items,
    totalprice : state.totalprice,
    placed : state.placed
  })
}

export default connect(mapStateToProps)(RestaurantList);
