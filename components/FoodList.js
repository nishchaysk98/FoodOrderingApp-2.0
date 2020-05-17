import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, SafeAreaView, Button, Image, StatusBar } from 'react-native';
import { Link } from 'react-router-native';
import {connect} from "react-redux";
import {store} from "../store";
import { PlaceOrder, GetLocation, GetLocationSuccess, GetLocationFailure } from "./Add/AddActionCreators";
import axios from "axios";
import Geolocation from '@react-native-community/geolocation';

class FoodList extends React.Component {
  constructor(props) {
    super(props);
    this.url = this.props.location.state.url;
    this.userid = this.props.location.state.userid;
    this.rid = this.props.location.state.rid;
    this.state = {
      load: false,
      loadeddata: [],
      globalstatechanged : false,
      geoLocationX:12.5,
      geoLocationY:25.76
    };

    // this.data = [
    //   {
    //     id: 5,
    //     rid: 1,
    //     name: 'Idly',
    //     description: 'Rice pudding',

    //     addOnQsnsDetails: {
    //       false: [],
    //       true: [],
    //     },
    //     picture: 'Idly',
    //     price: 25.0,
    //   },
    //   {
    //     id: 8,
    //     rid: 1,
    //     name: 'South Meals',
    //     description: 'Meal with cup of rice, sambaar, rasam, curd',
    //     addOnQsnsDetails: {
    //       false: [
    //         {
    //           id: 1,
    //           question: 'Gulab jamoon',
    //           exclusive: false,
    //           addOnPrice: 20.0,
    //         },
    //         {
    //           id: 2,
    //           question: 'Mysore Pak',
    //           exclusive: false,
    //           addOnPrice: 15.0,
    //         },
    //       ],
    //       true: [
    //         {
    //           id: 5,
    //           question: 'Ghee rice',
    //           exclusive: true,
    //           addOnPrice: 40.0,
    //         },
    //         {
    //           id: 6,
    //           question: 'Veg Pulao',
    //           exclusive: true,
    //           addOnPrice: 60.0,
    //         },
    //       ],
    //     },
    //     picture: 'Meal pictures',
    //     price: 150.0,
    //   },
    // ];
  }

  componentDidMount() {
    fetch(this.url+"/food/listfoods/"+this.rid)
      .then(response => response.json())
      .then(data => {
        this.setState({
          load: true,
          loadeddata: data, //Used in future for Real Api
        });
      })
      .catch(() => {});
  }

  getAddress = () => {
    
  }
  onPlaceOrder = async() => {
        var orderjson = store.getState().items;
        store.dispatch(GetLocation());
        
        await Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                store.dispatch(GetLocationSuccess());
                const currentLongitude = JSON.stringify(position.coords.longitude);
                //getting the Longitude from the location json
                const currentLatitude = JSON.stringify(position.coords.latitude);
                //getting the Latitude from the location json
                  var objtoSend = {
                        geoLocationX : currentLongitude,
                        geoLocationY : currentLatitude,
                        orderDetails : orderjson
                      }
              
                axios.post(this.url+"/food/placeorder/"+this.userid+"/"+this.props.rid, objtoSend)
                .then((response) => {
                  console.log(response.data);
                      store.dispatch(PlaceOrder())    
                    })
                .catch((error) => {
                    alert(error)
                });
        
                //that.setState({ currentLongitude: currentLongitude });
                //Setting state Longitude to re re-render the Longitude Text
                //that.setState({ currentLatitude: currentLatitude });
                //Setting state Latitude to re re-render the Longitude Text
            },
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 1000 }
        );
        
    }

  render() {
    var loadstate = this.state.load;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View>
            <View style={{ alignItems: "center", backgroundColor: "orange" }}>
            <StatusBar barStyle="dark-content" backgroundColor='#ffffff' />
            <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodordering-f210f.appspot.com/o/logo.png?alt=media&token=a8f47139-15b2-44e0-97e7-a4cc53ba39bd" }}

              style={{
                width: 120, height: 120
              }} />
          </View>
      

            <View style={{ alignItems: "center", margin: 20 }}>
              {
            this.props.items.length != 0 ? <View style={{backgroundColor:"lightgreen" , width:'100%', alignItems:"center", padding:20}}><Text style={{fontWeight:"bold"}}>Number of items in Cart: {this.props.items.length}</Text><Text style={{fontWeight:"bold", marginTop:10, marginBottom:10}}>Total Price: {this.props.totalprice}</Text>
            { this.props.placed ?<Button title="Order Requested" disabled/>:<Button title="Place Order" onPress={this.onPlaceOrder}/>}</View>: <Text></Text>
            
           }
           {this.props.getlocation == 0?<Text>Getting Location</Text>:<Text></Text>}
            </View>

            {
              loadstate ? <FlatList
              data={this.state.loadeddata}
              renderItem={({ item }) => <IndivItem itemrender={item} url={this.url} userid={this.userid} rid={this.rid} />} /> : <Text style={{ textAlign: "center", marginTop: 10 }}>Loading Food Items</Text>
            }

            <Link to={{
              pathname: "/restaurantlist",
              state: {
                url: this.url,
                userid: this.userid
              }
            }} style={{ marginTop: 20 }}>
              <View>
                <Text style={{ fontWeight: "bold", backgroundColor: "lightgrey", padding: 10 }}>Back</Text>
              </View>
            </Link>

          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function IndivItem(props) {
  return (
    <View style={styles.style1}>
      <Link to={{ pathname: '/add', state: { itemdetails: props.itemrender, url:props.url, userid:props.userid, rid:props.rid  }}}>
      <ScrollView>
        <View style={{width:'100%', backgroundColor:"lightgrey",padding:10}}>
          <View style={{flexDirection:"column",flex:1, padding:10, width:'100%'}}>
            <Text style={{width:'90%', fontWeight:"bold", fontSize:18, flex:1}}>{props.itemrender.name}</Text>
            <Text style={{fontSize:14, flex:1}}>{props.itemrender.description}</Text>
            <Text style={{fontSize:14, flex:1}}>Price: {props.itemrender.price}/-</Text>
          </View>
        </View>
        </ScrollView>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  style1 : {
    padding:10,
    width:'100%'
  }
})

function mapStateToProps(state) {
  return ({
    items : state.items,
    totalprice : state.totalprice,
    placed : state.placed,
    rid: state.rid,
    getlocation: state.getlocation
  })
}

export default connect(mapStateToProps)(FoodList);
