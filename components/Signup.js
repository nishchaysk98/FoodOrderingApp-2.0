import React from "react";
import {View, Picker, Text, TextInput, Animated, ScrollView,Button, StyleSheet, StatusBar, Image} from "react-native";
// import firebase from 'react-native-firebase';
import axios from "axios";
import {NativeRouter, Route, Link} from "react-router-native";
import Geolocation from '@react-native-community/geolocation';

class Signup extends React.Component{
  constructor(props){
    super(props);
    this.url = this.props.location.state.url;
    this.state = {
      endUser : "User",
      username : "",
      password : "",
      email : "",
      phonenumber: "",
      name : "",
      restaddress: "",
      geoLocationX:0.0,
      getLocationY:0.0,
      signupclicked: false
    }
  }
 

onEndUserChange = (val) => {
  this.setState({
    endUser : val,
    username : "",
    password : "",
    email : "",
    phonenumber: "",
    name : "",
    restaddress:"",
  })

}

onAddressChange = (val) => {
  this.setState({
    restaddress: val
  })
}

onUsernameChange = (val) =>{
  this.setState({
    username : val
  })
}
onPasswordChange = (val) =>{
  this.setState({
    password: val
  })
}
onEmailChange =(val) => {
  this.setState({
    email : val
  })
}
onPhonenumberChange =(val) =>{
  this.setState({
    phonenumber : val
  })
}
onNameChange =(val)=>{
  this.setState({
    name : val
  })
}

onSignupSuccess = () => {
  this.props.history.push("/")
}

onSubmit = () =>{

  this.setState({
    signupclicked: true
  })
  console.log("EndUser: "+ this.state.endUser+"; Username: "+this.state.username+"; Password: "+this.state.password +"; Email: "+this.state.email+"; Name :"+this.state.name+"; Phonenumber :"+this.state.phonenumber);
  
  var api=this.url+"/"+(this.state.endUser).toLowerCase()+'/signup';
  if((this.state.endUser).toLowerCase()=="user"){
    axios.post(api,{
      username:this.state.username,
      password:this.state.password,
      name:this.state.name,
      email:this.state.email,
      picture:""
    })
    .then((response) => {

      console.log(response.data)
      if(response.data==1){
        alert("Signup success")
        this.onSignupSuccess()
      }
      else{
        this.setState({
          signupclicked: false
        })
        alert("Failed hello")
      }
      
    })
    .catch((error) => {
      this.setState({
          signupclicked: false
        })
      alert(error)
    });
  }
  else if((this.state.endUser).toLowerCase()=="restaurant"){
      
      Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
               
                const currentLongitude = JSON.stringify(position.coords.longitude);
                //getting the Longitude from the location json
                const currentLatitude = JSON.stringify(position.coords.latitude);
                //getting the Latitude from the location json
                this.setState({
                  geoLocationY: currentLatitude,
                  geoLocationX: currentLongitude
                })
                  axios.post(api,{
                      username:this.state.username,
                      password:this.state.password,
                      name:this.state.name,
                      email:this.state.email,
                      picture:"",
                      location:this.state.restaddress,
                      geoLocationX: currentLongitude,
                      geoLocationY: currentLatitude
                    })
                    .then((response) => {

                      console.log(response.data)
                      if(response.data==1){
                        alert("Signup success")
                        this.onSignupSuccess();
                      }
                      else{
                        this.setState({
                          signupclicked: false
                        })
                        alert("Failed")
                      }
                      
                    })
                    .catch((error) => {
                      this.setState({
                          signupclicked: false
                        })
                      alert(error)
                    });
                
            },
            (error) => {
                this.setState({
                  signupclicked: false
                })
              alert(error.message)
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

  }else if((this.state.endUser).toLowerCase()=="deliveryboy"){
    axios.post(api,{
      username:this.state.username,
      password:this.state.password,
      name:this.state.name,
      email:this.state.email,
    })
    .then((response) => {

      console.log(response.data)
      if(response.data==1){
        alert("Signup success")
        this.onSignupSuccess();
      }
      else{
        this.setState({
          signupclicked: false
        })
        alert("Failed")
      }
      
    })
    .catch((error) => {
      this.setState({
          signupclicked: false
        })
      alert(error)
    });
  }

}


render(){

  if(this.state.endUser == "User"){

    return (    
      <View style={{flex:1}}>
      <View style={{ alignItems: "center", backgroundColor: "orange" }}>
          <StatusBar barStyle="dark-content" backgroundColor='#ffffff' />
          <Image source={{uri:"https://firebasestorage.googleapis.com/v0/b/foodordering-f210f.appspot.com/o/logo.png?alt=media&token=a8f47139-15b2-44e0-97e7-a4cc53ba39bd"}}  
           
          style={{width:120, height:120
          }}/>
      </View>
      <ScrollView style={styles.style_4 } contentContainerStyle={styles.contentContainer}>
      <View style={styles.style_5}>
        <Link to="/" style={{margin:20}}>
        <Text >Login</Text>
        </Link>
        <Text style={{fontWeight:"bold", margin:20}}>Signup</Text>
      </View>

      <ScrollView style={styles.style_3}>
        <View style={{alignItems:"center"}}>
        <Picker style={{width:'50%'}} onValueChange={this.onEndUserChange} selectedValue={this.state.endUser}>
          <Picker.Item label="Restaurant" value="Restaurant"/>
          <Picker.Item label="User" value="User" />
          <Picker.Item label="Delivery" value="Deliveryboy" />
        </Picker>
        </View>

        <View >
        <Text style={styles.style_1}>Name</Text>
        <TextInput style={styles.style_2} onChangeText={this.onNameChange} value={this.state.name}/>
        </View>
        <View >
        <Text style={styles.style_1}>Username</Text>
        <TextInput style={styles.style_2} onChangeText={this.onUsernameChange} value={this.state.username}/>
        </View>

        <View >
        <Text style={styles.style_1} >Email</Text>
        <TextInput style={styles.style_2} onChangeText={this.onEmailChange} value={this.state.email}/>
        </View>

        <View >
        <Text style={styles.style_1} >Set Password</Text>
        <TextInput style={styles.style_2} secureTextEntry={true} onChangeText={this.onPasswordChange} value={this.state.password}/>
        </View>

        <View style={styles.style_1}>
          <Button title={this.state.signupclicked?"Working on it..":"Signup"} onPress={this.onSubmit}/>
        </View>
      </ScrollView>
  </ScrollView>
</View>
  )
  }
  else if(this.state.endUser == "Restaurant"){
    return (
      <View style={{flex:1}}>
        <View style={{ alignItems: "center", backgroundColor: "orange" }}>
          <StatusBar barStyle="dark-content" backgroundColor='#ffffff' />
          <Image source={{uri:"https://firebasestorage.googleapis.com/v0/b/foodordering-f210f.appspot.com/o/logo.png?alt=media&token=a8f47139-15b2-44e0-97e7-a4cc53ba39bd"}}  
           
          style={{width:120, height:120
          }}/>
        </View>
      <ScrollView style={styles.style_4} contentContainerStyle={styles.contentContainer}>
        <View style={styles.style_5}>
          <Link to="/" style={{margin:20}}>
          <Text >Login</Text>
          </Link>
          <Text style={{fontWeight:"bold", margin:20}}>Signup</Text>
        </View>

        <ScrollView style={styles.style_3}>
          <View style={{alignItems:"center"}}>
          <Picker style={{width:'50%'}} onValueChange={this.onEndUserChange} selectedValue={this.state.endUser}>
            <Picker.Item label="Restaurant" value="Restaurant"/>
            <Picker.Item label="User" value="User" />
            <Picker.Item label="Delivery" value="Deliveryboy" />
          </Picker>
          </View>

          <View>
            <Text style={styles.style_1} >Name</Text>
            <TextInput style={styles.style_2} onChangeText={this.onNameChange} value={this.state.name}/>
          </View>


          <View>
            <Text style={styles.style_1}>Username</Text>
            <TextInput style={styles.style_2} onChangeText={this.onUsernameChange} value={this.state.username}/>
          </View>


          <View >
            <Text style={styles.style_1} >Email</Text>
            <TextInput style={styles.style_2} onChangeText={this.onEmailChange} value={this.state.email}/>
          </View>


          <View >
            <Text style={styles.style_1} >Set Password</Text>
            <TextInput style={styles.style_2} onChangeText={this.onPasswordChange} secureTextEntry={true} value={this.state.password}/>
          </View>


          <View >
            <Text style={styles.style_1}>Phone Number</Text>
            <TextInput style={styles.style_2} onChangeText={this.onPhonenumberChange} value={this.state.phonenumber}/>
          </View>
          
          <View >
            <Text style={styles.style_1}>Address</Text>
            <TextInput style={styles.style_2} onChangeText={this.onAddressChange} value={this.state.restaddress}/>
          </View>

          <View style={styles.style_1}>
            <Button title={this.state.signupclicked?"Working on it..":"Signup"} onPress={this.onSubmit}/>
          </View>
        </ScrollView>
  </ScrollView>
</View>
  )
}
else if(this.state.endUser == "Deliveryboy"){

    return (   
      <View style={{flex:1}}> 
      <View style={{ alignItems: "center", backgroundColor: "orange" }}>
          <StatusBar barStyle="dark-content" backgroundColor='#ffffff' />
          <Image source={{uri:"https://firebasestorage.googleapis.com/v0/b/foodordering-f210f.appspot.com/o/logo.png?alt=media&token=a8f47139-15b2-44e0-97e7-a4cc53ba39bd"}}  
           
          style={{width:120, height:120
          }}/>
        </View>
      <ScrollView style={styles.style_4 } contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.style_5}>
        <Link to="/" style={{margin:20}}>
        <Text >Login</Text>
        </Link>
        <Text style={{fontWeight:"bold", margin:20}}>Signup</Text>
      </View>

      <ScrollView style={styles.style_3}>
        <View style={{alignItems:"center"}}>
        <Picker style={{width:'50%'}} onValueChange={this.onEndUserChange} selectedValue={this.state.endUser}>
          <Picker.Item label="Restaurant" value="Restaurant"/>
          <Picker.Item label="User" value="User" />
          <Picker.Item label="Delivery" value="Deliveryboy" />
        </Picker>
        </View>

        <View >
        <Text style={styles.style_1}>Name</Text>
        <TextInput style={styles.style_2} onChangeText={this.onNameChange} value={this.state.name}/>
        </View>
        <View >
        <Text style={styles.style_1}>Username</Text>
        <TextInput style={styles.style_2} onChangeText={this.onUsernameChange} value={this.state.username}/>
        </View>

        <View >
        <Text style={styles.style_1} >Email</Text>
        <TextInput style={styles.style_2} onChangeText={this.onEmailChange} value={this.state.email}/>
        </View>

        <View >
        <Text style={styles.style_1} >Set Password</Text>
        <TextInput style={styles.style_2} secureTextEntry={true} onChangeText={this.onPasswordChange} value={this.state.password}/>
        </View>

        <View style={styles.style_1}>
          <Button title={this.state.signupclicked?"Working on it..":"Signup"} onPress={this.onSubmit}/>
        </View>
      </ScrollView>
</ScrollView>
</View>
  )
  }
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
    // alignItems:"center", 
    width:'100%'
  },
  style_5 : {
    padding:20, 
    textAlign:"center", 
    // alignItems:"center", 
    flexDirection:"row"
  },
  contentContainer: {
    paddingVertical: 20,
    alignItems:"center", 
    flex:1
  }
})

export default Signup;