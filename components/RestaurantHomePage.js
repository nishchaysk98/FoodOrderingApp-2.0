import React from "react";
import { View, Picker, Text, TextInput, Animated, Button, StyleSheet, FlatList, ScrollView, BackHandler, TouchableOpacity, TouchableWithoutFeedback, AsyncStorage, Modal, Image, StatusBar } from "react-native";
import axios from "axios";

import firebase from "react-native-firebase";
import { BackButton } from "react-router-native";


class RestaurantHomePage extends React.Component {
    constructor(props) {
        super(props);

        this.url = this.props.location.state.url;
        this.rid = this.props.location.state.rid;
        this.state = {
            array: [],
            showingOrderDetails: false,
            foods: []
        }
        this.currentOrderPrice = 0;
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
        this.getPendingRequests()
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
            console.log(this.fcmToken);
            console.log("Id", this.rid)
            axios.put(this.url + "/restaurant/addfcm/" + this.rid + "/" + this.fcmToken)

                .then((response) => {
                    console.log("response", response.data)
                })
                .catch((error) => {
                    console.log("error", error)
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
    getPendingRequests() {
        axios.get(this.url + "/restaurant/foods/pending/" + this.rid)
            .then((response) => {
                response = response.data
                this.setState({
                    array: (response)
                })
            })
            .catch((error) => {
                console.log("Error=", error)
            })
    }
    messageListener = async () => {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            console.log(notification.data.message)
            this.setState({
                array: [...this.state.array, JSON.parse(notification.data.message)]
            })
          //  this.getPendingRequests();
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {

            axios.get(this.url + "/restaurant/foods/pending/" + this.rid)
                .then((response) => {
                    // this.props.history.push({
                    //     pathname: "/restauranthomepage",
                    //     state: {
                    //       rid: id
                    //     } 
                    //   })

                })
                .catch((error) => {
                    console.log("Error=", error)
                })
            this.setState({
                array: [...this.state.array, notificationOpen.notification.data.message]
            })

        });

        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            this.setState({
                array: [...this.state.array, notification.data.message]
            })
        }

        this.messageListener = firebase.messaging().onMessage((message) => {
            this.setState({
                array: [...this.state.array, message]
            })
            // this.array.push(notificationOpen.notification.data.message)

        });
    }

    FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={{ margin: 5, height: 0, width: '100%', backgroundColor: '#C8C8C8' }} />
        );
    };

    showAlert = (title, body, message) => {

    }

    showOrderDetails(item) {
        this.currentOrderPrice = 0
        this.setState({
            showingOrderDetails: false,

        })
        console.log(JSON.stringify(item.foods[0]))
        this.setState({
            foods: item.foods,
            showingOrderDetails: true
        })
        for (var i in item.foods) {
            let f = item.foods[i]
            console.log("Foods", f)

        }
    }

    renderRow(item) {
        var that = this;
        item = item.item
        // console.log("Item=", item)

        return (<View style={styles.individualRow} >
            <TouchableOpacity onPress={() => {
                this.showOrderDetails(item)
            }}>
                <Text style={styles.item}>#{item.orderId} by {item.user.name}</Text>
                <Text style={{ color: "#a9a9a9", padding: 10 }}>{item.foods[0].name}...</Text>
            </TouchableOpacity>
            <View style={styles.fixToText}>
                <Button
                    title="Accept"
                    color="orange"
                    onPress={() => {
                        axios.post(this.url + "/food/order/" + item.orderId + "/" + 1)
                            .then((response) => {
                                console.log("success")
                                const index = that.state.array.indexOf(item);
                                if (index > -1) {
                                    let a = [...this.state.array];
                                    a.splice(index, 1);
                                    this.setState({
                                        array: a
                                    })
                                }
                                console.log("Index", index)
                            })
                            .catch((error) => {
                                console.log("Error=", error)
                            })
                    }}
                />
                <Button
                    title="Reject"
                    color="#D3D3D3"
                    onPress={() => {
                        console.log("Rejecting")
                        axios.post(this.url + "/food/order/" + item.orderId + "/" + 0)
                            .then((response) => {
                                console.log("success")
                                const index = that.state.array.indexOf(item);
                                if (index > -1) {
                                    let a = [...this.state.array];
                                    a.splice(index, 1);
                                    this.setState({
                                        array: a
                                    })

                                }
                                console.log("Index", index)
                            })
                            .catch((error) => {
                                console.log("Error=", error)

                            })
                    }}
                />
            </View>
        </View>)
    }

onViewProfile = () => {
        this.props.history.push({
            pathname: "/restaurantprofile",
            state: {
                url: this.url,
                rid : this.rid
            }
        })
    }
    removeData = async () => {
        try {
            await AsyncStorage.setItem("enduser", "")
            await AsyncStorage.setItem("id", "")
        }
        catch (err) {
            alert(err)
        }
    }
    onLogout = () => {

        axios.post(this.url + "/restaurant/logout/" + this.rid + "/" + this.fcmToken)
            .then((response) => {
                if (response.data == 1) {
                    this.removeData()
                    this.props.history.push("/")
                    alert("Logout Success")
                }
                else if (response.data == 0) {
                    this.removeData()
                    this.props.history.push("/")
                    alert("Logout Failed")
                }
                else {
                    alert("Some Technical issue!")
                }
            })
            .catch((error) => {
                // alert(error)
                console.log("Error=", error)
            })
    }
    onGoToAddFoodPage = () => {
        this.props.history.push({
            pathname: "/restaurantaddfood",
            state: {
                url: this.url,
                rid: this.rid
            }
        })
    }
    renderAddOns(addOns) {
        addOns = addOns.item
        return (
            <Text style={{width:100}}>{addOns.question} {"\b"}</Text>
    )
    }
    calculateFoodPrice(food) {

        var fAddOns = food.addOnQsnsDetails.false
        var fAddOnsPrice = 0
        for (var i in fAddOns) {
            console.log(fAddOns[i].addOnPrice)
            fAddOnsPrice += fAddOns[i].addOnPrice*food.quantity
        }
        var tAddOns = (food.addOnQsnsDetails.true)
        var tAddOnsPrice = 0
        for (var i in tAddOns) {
            console.log(tAddOns[i].addOnPrice)
            tAddOnsPrice += tAddOns[i].addOnPrice*food.quantity
        }
        var price = (food.quantity * food.price) + fAddOnsPrice + tAddOnsPrice
        var updatedCurrentOrderPrice = this.currentOrderPrice + price
        this.currentOrderPrice = updatedCurrentOrderPrice

        return price
    }
    renderFoods(food) {
        food = food.item
        return <View style={{
            backgroundColor: "rgba(231,63,83,0.9)", borderRadius:10,padding:10,margin:4
        }}>
            <Text style={{fontWeight:'bold'}}>{food.quantity}*{food.name}-{food.price}</Text>
            {/* <Text style={styles.text}>{food.name}({food.description})
            Qty:{food.quantity}(Each costs {food.price})</Text> */}

            <View
            style={{width:100}}
            ><Text>And..</Text><FlatList
            style={{width:100}}
            data={food.addOnQsnsDetails.false} renderItem={this.renderAddOns.bind(this)} listKey={(item, index) => index.toString()} /></View>
            <View
            style={{width:100}}
            ><FlatList 
            style={{width:100}}
            data={food.addOnQsnsDetails.true} renderItem={this.renderAddOns.bind(this)} listKey={(item, index) => index.toString()} /></View>
            
            <Text style={styles.text}>Price for the above:{
                this.calculateFoodPrice(food)
            }</Text>

        </View>
    }

    render() {
        return (

            <View style={{
                flex: 1

            }}>
                <View style={{ alignItems: "center", backgroundColor: "orange" }}>
                    <StatusBar barStyle="dark-content" backgroundColor='#ffffff' />
                    <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodordering-f210f.appspot.com/o/logo.png?alt=media&token=a8f47139-15b2-44e0-97e7-a4cc53ba39bd" }}
                        style={{
                            width: 120, height: 120
                        }} />
                   <View style={{margin:10}}>
                    <Button title="View Profile and Accepted Orders" onPress={this.onViewProfile}/>
                   </View>

                </View>
                <View style={{
                    flex: 1,
                    backgroundColor: '#ecf0f1',
                }}>

                    <Text style={{ textAlign: "center", padding: 5 }}>Pending Orders</Text>
                    <Modal style={styles.modal}
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.showingOrderDetails}
                        onRequestClose={() => { console.log("Modal has been closed.") }}>
                        <View style={styles.modalView}>
                            <Text style={{ margin: 10, padding: 10, height: 40 }}>Foods and addons</Text>
                            <FlatList data={this.state.foods} renderItem={this.renderFoods.bind(this)}
                                keyExtractor={(item, index) => index.toString()} 
                                style={{ width:"100%"}} 
                                />
                            <Text>Total Price={this.currentOrderPrice}</Text>
                            <Text>User details</Text>
                            <Button
                                title="Close"
                                color="black"
                                onPress={() => { this.setState({ showingOrderDetails: false }) }}
                            />
                        </View>
                    </Modal>

                    <ScrollView style={{
                        flex: 1
                    }}>
                        <FlatList data={this.state.array} renderItem={this.renderRow.bind(this)}
                            //   ItemSeparatorComponent={this.FlatListItemSeparator}
                            keyExtractor={(item, index) => index.toString()}
                        />

                        {/* <Button title="Add Food" style={{padding:10}} onPress={this.onGoToAddFoodPage}/> */}
                         
                    </ScrollView>
                </View>
                <TouchableOpacity onPress={this.onGoToAddFoodPage} style={{
                    width: 50,
                    height: 50,
                    borderRadius: 15,
                    backgroundColor: 'orange',
                    position: 'absolute',
                    bottom: 60,

                    right: 0,
                }}
                >
                    <Image source={require("../images/AddFood.png")} style={{ width: 50, height: 50 }}
                    />
                </TouchableOpacity>
                <View style={{margin:10}}>
                            <Button title="Logout" style={{margin:10}} onPress={this.onLogout}/>
                        </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    style_1: {
        width: '100%',
        marginTop: 10
    },
    style_2: {
        width: '100%',
        backgroundColor: "lightgrey",
        marginTop: 10
    },
    style_3: {
        width: '80%',
        textAlign: "center"
    },
    style_4: {
        alignItems: "center",
        width: '100%'
    },
    style_5: {
        padding: 20,
        textAlign: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: "#000000"
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10

    },
    individualRow: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        margin: 10,
        height: 150,
        shadowColor: "orange",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0,
        borderColor: "orange",
        padding: 10,
        shadowRadius: 30,
        borderWidth: 1,

        elevation: 10,
    },
    modalView: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#f0f0f0",
        // height:"80%",
        width: '80%',
        borderRadius: 25,
        borderWidth: 1,
        // borderColor: '#000000',
        // marginTop: 80,
        // marginLeft: 40,
        margin: 40,
        shadowColor: "gray",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        // borderColor:"orange",
        // borderBottomWidth: 0,
        // shadowRadius: 3,
        borderWidth: 1,
        // padding:10

    },
    modal: {
        color: '#000000',

    },
    text: {
        color: '#3f2949',
        marginTop: 10
    },
})

export default RestaurantHomePage;