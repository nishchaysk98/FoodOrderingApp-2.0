import React from 'react';
import {View, Text, Button, StyleSheet, ScrollView} from 'react-native';
import axios from 'axios';

export default class RestaurantProfile extends React.Component{
    constructor(props){
        super(props);
        this.url = this.props.location.state.url;
        this.rid = this.props.location.state.rid;
        this.state = {
            name: "Loading",
            email:"Loading",
            GeoLocationX:0.0,
            GeoLocationY:0.0,
            address:"Loading",
            acceptedOrder: []
        }
    }

    componentDidMount = () => {
        axios.get(this.url+"/restaurant/profile/"+this.rid)
        .then((response)=>{
            this.setState({
                name: response.data.restaurant.name,
                email:response.data.restaurant.email,
                address:response.data.restaurant.location,
                GeoLocationX:response.data.restaurant.geoLocationX,
                GeoLocationY:response.data.restaurant.geoLocationY
            })
        })
        .catch(error => alert(error));

        axios.get(this.url+"/restaurant/acceptedorders/"+this.rid)
        .then((response)=>{
            console.log(response.data);
            if(response.data.length!=0){
                console.log(response.data[0]);
            }
            this.setState({
                acceptedOrder : response.data
            })
        })
        .catch(error => alert(error));
    }
    goBack = () =>{
        this.props.history.push({
            pathname:"/restauranthomepage",
            state: {
                url: this.url,
                rid: this.rid
            }
        })
    }

    displayAcceptedOrder = () =>{
        const data = this.state.acceptedOrder.map((val)=>{
            return (
                <View style={{backgroundColor:"lightgrey", padding:20, margin:10}}>
                    <Text>Order Id: {val.orderId}</Text>
                    <Text>Food Details:</Text>
                    {
                        val.foods.map((val_1, pos)=>{
                            return (<Text>{pos+1+")"} {val_1.name}</Text>)
                        })
                    }
                    
                    <Text>User: {val.user.name}</Text>
                </View>
            )
        });
        return data;
    }
    render(){
        return (
            
                <ScrollView >
                    <View style={{flex:1}}>
                        <Text style={styles.heading}>Restaurant Profile</Text>
                        <Text style={styles.default}>Name: {this.state.name}</Text>
                        <Text style={styles.default}>Email: {this.state.email}</Text>
                        <Text style={styles.default}>Location: {this.state.address}</Text>
                        <Text style={styles.default}>GeoLocation: {this.state.GeoLocationX +"   "+ this.state.GeoLocationY}</Text>

                        <Text style={styles.heading}>Accepted Orders</Text>
                        {
                            this.state.acceptedOrder.length == 0?<Text style={{textAlign:"center"}}>No Orders Accepted</Text>:
                            <View>
                                {this.displayAcceptedOrder()}
                            </View>
                        }
                    <Button title="Back" onPress={this.goBack} />    
                </View>
                </ScrollView>
                
            
        )
    }
}

const styles = StyleSheet.create({
    default:{
        padding:20,
        margin:20,
        marginTop:10,
        backgroundColor:"lightgrey",
        textAlign:"center"
    },
    heading:{
        padding:20,
        fontWeight:"bold",
        textAlign:"center"
    }
})