import React from "react";
import {Text, View, StyleSheet} from "react-native";
import {NativeRouter, Route, Link} from "react-router-native";
import Login from "./Login";
import Signup from "./Signup";

const styles = StyleSheet.create({
  changeLook:{
    fontWeight: "bold",
    padding:"5px"
  },
  defaultLook: {
    padding:"5px"
  }
})

class LoginSignup extends React.Component{

  constructor(){
    super();
    this.state = {
      first : true,
      second: false
    }
  }
  
    render(){
      return(
        <NativeRouter>
          <View >
            <View>
              {/*<Link  to="/login" underlayColor="#f0f4f7" onClick={()=>{ this.setState({first:true, second:false})}}>
                {this.state.first? <Text style={styles.changeLook}>Login</Text> : <Text style={styles.defaultLook}>Login</Text>}
              </Link>
            </View>
            <View >
              <Link to="/signup" underlayColor="#f0f4f7" onClick={()=>{ this.setState({first:false, second:true})}}>
                {this.state.second? <Text style={styles.changeLook}>Signup</Text> : <Text style={styles.defaultLook}>Signup</Text>}
              </Link>*/}
            </View>
          </View>

          {/*<Route exact path="/login" component={Login} />
          <Route path="/signup" component={Signup} />*/}

        </NativeRouter>    
      )
    }
}




export default LoginSignup;