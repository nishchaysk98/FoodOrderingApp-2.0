import React from "react";
import {View, Picker, Text, TextInput, Animated, Button, StyleSheet, AsyncStorage, ScrollView, StatusBar, Image} from "react-native";
import {NativeRouter, Route, Link} from "react-router-native";
import Signup from "./Signup";
import axios from "axios";

class Login extends React.Component{
  constructor(props){
    super(props);
    this.url = this.props.location.state.url;
    this.state = {
      endUser : "User",
      username : "",
      password : "",
    }
  }

  onEndUserChange = (evt) => {
    this.setState({
      endUser : evt,
      username : "",
      password : ""
    })
  }

  onUsernameChange = (evt) =>{
    this.setState({
      username : evt
    })
  }
  onPasswordChange = (evt) =>{
    this.setState({
      password: evt
    })
  }
  storeData = async(enduser, id)=>{
    
    try{
      await AsyncStorage.setItem("enduser",enduser)
      await AsyncStorage.setItem("id",id+"")
      
    }
    catch(err){
      alert(err)
    }
  }

  onLoginSuccess = (link, uid) => {
     this.storeData("user",uid)
     this.props.history.push({
      pathname : link,
      state:{ 
        url : this.url,
        userid : uid
       }
    });
  }
  onRestLoginSuccess = (id)=>{
    this.storeData("restaurant",id)
    axios.put(this.url + "/restaurant/availability/"+id+"/1").then((response)=>{
      this.props.history.push({
      pathname: "/restauranthomepage",
      state: {
        url : this.url,
        rid: id
      } 
    })
    }).catch(error => alert(error));  
  }
  onDeliveryLoginSuccess = (id) => {
    this.storeData("delivery",id)
    this.props.history.push({
      pathname: "/deliveryhomepage",
      state: {
        url : this.url,
        did: id
      } 
    })
        
  }

  onSubmit = () =>{

  var api=this.url+"/"+(this.state.endUser).toLowerCase()+'/login';
  
  axios.post(api,{
    username:this.state.username,
    password:this.state.password
  })
  .then((json) => {
    console.log(json.data.length)
    if(json.data.length!=0){
      
      if(this.state.endUser.toLowerCase() == "user"){
        this.onLoginSuccess("/restaurantlist", json.data.id);
        
      }
      else if(this.state.endUser.toLowerCase() == "restaurant"){
        this.onRestLoginSuccess(json.data.id);
      }
      else if(this.state.endUser.toLowerCase() == "deliveryboy"){
        this.onDeliveryLoginSuccess(json.data.id);
      }
    }
    else{
      alert("Login failed:(")
    }
  })
  .catch((error) => {
    alert(error)
  });
}

render(){
  return (    
    <ScrollView>
        <View style={{ alignItems: "center", backgroundColor: "orange" }}>
          <StatusBar barStyle="dark-content" backgroundColor='#ffffff' />
          <Image source={{uri:"https://firebasestorage.googleapis.com/v0/b/foodordering-f210f.appspot.com/o/logo.png?alt=media&token=a8f47139-15b2-44e0-97e7-a4cc53ba39bd"}}  
           
          style={{width:120, height:120
          }}/>
        </View>
      <View style={styles.style_4}> 
        <View style={styles.style_5}>
          <Text style={{fontWeight:"bold", margin:20}}>Login</Text>
          <Link to={{pathname:"/signup",state:{url: this.url}}} style={{margin:20}}>
            <Text>Signup</Text>
          </Link>
        </View>
        <View style={styles.style_3}>
          <View style={{alignItems:"center"}}>
          <Picker style={{width:'50%'}} onValueChange={this.onEndUserChange} selectedValue={this.state.endUser} >
            <Picker.Item label="Restaurant" value="Restaurant"/>
            <Picker.Item label="User" value="User" />
            <Picker.Item label="Delivery" value="Deliveryboy" />
          </Picker>
          </View>
          <View >
        <Text style={styles.style_1}>Username</Text>
        <TextInput style={styles.style_2} 
        returnKeyType="next"
        value={this.state.username} 
        onSubmitEditing={()=>this.passwordInput.focus()}
        autoCapitalize='none'
        onChangeText={this.onUsernameChange}/>
        </View>
        <View >
        <Text style={styles.style_1}>Password</Text>
        <TextInput style={styles.style_2}
         value={this.state.password} 
         returnKeyType="go"
         ref={(input)=>this.passwordInput=input}
         onChangeText={this.onPasswordChange} secureTextEntry={true}/>
        </View>
        <View style={styles.style_1}>
          <Button title="Login" onPress={this.onSubmit}/>
        </View>
        </View>
      </View>
    </ScrollView>
  )
}
}

const styles = StyleSheet.create({
  style_1 : {
    width: '100%',
    marginTop: 10
  },
  style_2 : {
    width:'100%',
    backgroundColor:"lightgrey", 
    marginTop:10
  },
  style_3 : {
    width:'80%', 
    textAlign:"center"
  },
  style_4:{
    alignItems:"center", 
    width:'100%'
  },
  style_5 : {
    padding:20, 
    textAlign:"center", 
    alignItems:"center", 
    flexDirection:"row"
  }
})


export default Login;