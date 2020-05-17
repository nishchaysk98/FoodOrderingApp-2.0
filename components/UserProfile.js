import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import axios from 'axios';

export default class UserProfile extends React.Component{
    constructor(props){
        super(props);
        this.url = this.props.location.state.url;
        this.userid = this.props.location.state.userid;
        this.state = {
            name:"Loading",
            email:"Loading",
            username:"Loading",
            
        }
    }

    componentDidMount(){
        axios.get(this.url+"/user/profile/"+this.userid)
        .then((response)=>{
            this.setState({
                name: response.data.user.name,
                email: response.data.user.email,
                username: response.data.user.username,
            });
        })
        .catch(error => alert(error));
    }
    goBack = () =>{
        this.props.history.push({
            pathname:"/restaurantlist",
            state: {
                url: this.url,
                userid: this.userid
            }
        })
    }
    render(){
        return (
            <View>
                <Text style={styles.heading}>User Profile</Text>
                <Text style={styles.default}>Name: {this.state.name}</Text>
                <Text style={styles.default}>UserName: {this.state.username}</Text>
                <Text style={styles.default}>Email: {this.state.email}</Text>
                <Button title="Back" onPress={this.goBack}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    default:{
        padding:20,
        margin:20,
        backgroundColor:"lightgrey",
        textAlign:"center"
    },
    heading:{
        padding:20,
        fontWeight:"bold",
        textAlign:"center"
    }
})