import React from "react";
import { View, Picker, Text, TextInput, Animated, Button, StyleSheet, AsyncStorage, Image, PermissionsAndroid, FlatList, ScrollView, Modal, Dimensions } from "react-native";
import { NativeRouter, Route, Link } from "react-router-native";
import Signup from "./Signup";
import axios from "axios";
import Geolocation from '@react-native-community/geolocation';
import MapView, { PROVIDER_GOOGLE, Marker, Circle, Polyline } from 'react-native-maps'
import Carousel from 'react-native-snap-carousel';

class DeliveryBoyHomePage extends React.Component {
    constructor(props) {
        super(props);
        this.url = this.props.location.state.url;
        this.dId = 1
        this.state = {
            currentLongitude: 74.6918207,//Initial Longitude
            currentLatitude: 13.6294105,//Initial Latitude
            pendingRequests: [
                // {
                //     "title": "ABCD"
                // },
                // {
                //     "title": "XYZ"
                // },
                // {
                //     "title": "pqrs"
                // }
            ],
            showingOrderDetails: false,
            restaurant: [],
            user: [],
            dstatus: 0,
            isSniped: false,
            orderLocation: { "geoLocationX": '', "geoLocationY": '' },

        }
        this._carousel = {};
    }
    callLocation(that) {
        //alert("callLocation Called");
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                const currentLongitude = JSON.stringify(position.coords.longitude);
                //getting the Longitude from the location json
                const currentLatitude = JSON.stringify(position.coords.latitude);
                //getting the Latitude from the location json
                that.setState({ currentLongitude: currentLongitude });
                //Setting state Longitude to re re-render the Longitude Text
                that.setState({ currentLatitude: currentLatitude });
                //Setting state Latitude to re re-render the Longitude Text
            },
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
            //Will give you the location on location change
            console.log(position);
            const currentLongitude = JSON.stringify(position.coords.longitude);
            //getting the Longitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);
            //getting the Latitude from the location json
            that.setState({ currentLongitude: currentLongitude });
            //Setting state Longitude to re re-render the Longitude Text
            that.setState({ currentLatitude: currentLatitude });
            //Setting state Latitude to re re-render the Longitude Text
        });
    }
    componentWillUnmount = () => {
        //   Geolocation.clearWatch(this.watchID);
    }
    componentDidMount() {
        var that = this;

        //Checking for the permission just after component loaded
        // if (Platform.OS === 'ios') {
        //     this.callLocation(that);
        // } else {
        //     async function requestLocationPermission() {
        //         try {
        //             const granted = await PermissionsAndroid.request(
        //                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        //                 'title': 'Location Access Required',
        //                 'message': 'This App needs to Access your location'
        //             }
        //             )
        //             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //                 //To Check, If Permission is granted
        //                 that.callLocation(that);
        //             } else {
        //                 alert("Permission Denied");
        //             }
        //         } catch (err) {
        //             alert("err", err);
        //             console.warn("Erororor",err)
        //         }
        //     }
        //     requestLocationPermission();
        // }
        this.callLocation(this)

        axios.get(this.url + "/deliveryboy/request/" + this.dId)
            .then((response) => {
                response = response.data;

                console.log("Data", response)
                this.setState({
                    pendingRequests: response.payload,
                    dstatus: response.dstatus
                })

            })
            .catch((error) => {
                console.log("Error", error)
            })
    }
    renderAddOns(addOns) {
        addOns = addOns.item
        return (<View>
            <Text style={styles.text}>{addOns.question}(Rs.{addOns.addOnPrice})</Text>
        </View>)
    }
    calculateFoodPrice(food) {

        var fAddOns = food.addOnQsnsDetails.false
        var fAddOnsPrice = 0
        for (var i in fAddOns) {
            console.log(fAddOns[i].addOnPrice)
            fAddOnsPrice += fAddOns[i].addOnPrice
        }
        var tAddOns = (food.addOnQsnsDetails.true)
        var tAddOnsPrice = 0
        for (var i in tAddOns) {
            console.log(tAddOns[i].addOnPrice)
            tAddOnsPrice += tAddOns[i].addOnPrice
        }
        var price = (food.quantity * food.price) + fAddOnsPrice + tAddOnsPrice
        var updatedCurrentOrderPrice = this.currentOrderPrice + price
        this.currentOrderPrice = updatedCurrentOrderPrice
        return price
    }
    renderFoods(food) {
        food = food.item
        return <View>
            {/* <Text>{Object.keys(food)}</Text> */}

            <Text style={styles.text}>{food.name}</Text>
            <Text>Qty:{food.quantity}(Each costs {food.price})</Text>

            {/* <View><FlatList data={food.addOnQsnsDetails.false} renderItem={this.renderAddOns.bind(this)} listKey={(item, index) => index.toString()} /></View>
            <View><FlatList data={food.addOnQsnsDetails.true} renderItem={this.renderAddOns.bind(this)} listKey={(item, index) => index.toString()} /></View> */}

            {((food.addOnQsnsDetails.false === undefined) && (food.addOnQsnsDetails.true === undefined)) ? <View></View> : <Text>And some add ons</Text>}
            <Text style={styles.text}>Price for the above:{
                this.calculateFoodPrice(food)
            }</Text>

        </View>
    }
    showOrderDetails(item) {
        this.currentOrderPrice = 0
        this.setState({
            showingOrderDetails: false,

        })
        this.setState({
            foods: item.Order.foods,
            restaurant: item.Order.restaurant,
            user: item.Order.user,
            showingOrderDetails: true
        })
    }
    acceptOrRejectDeliverRequest(oId, decision) {
        axios.put(this.url + "/deliverboy/" + this.dId + "/" + oId + "/" + decision)
            .then((response) => {
                console.log("response", response.data)
                response = response.data
                console.log(response)
                if (response == 1) {
                    alert("Order is waiting for you to deliver")
                }
                else if (response == 0) {
                    alert("Rejected")
                }
                else if (response == 2) {
                    alert("Sorry accepted by someone :(")
                }
                else {
                    alert("Something went wrong")
                }
            })
            .catch((error) => {
                console.log("error", error)
            })
    }
    renderEachPendingOrder(item, index) {
        item = item.item
        return (<View style={styles.cardContainer}>
            {/* <Text>{JSON.stringify(item)}</Text> */}
            <Text>From:{item.Order.restaurant.location}</Text>
            <Text>To:({(item.Order.geoLocationX)},{(item.Order.geoLocationY)})</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 }}>
                <Button title="View food details" color="black" onPress={() => {
                    this.showOrderDetails(item)
                }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 10 }}>
                <Button title="Accept" color="green" onPress={() => {
                    console.log("Accepting")
                    this.acceptOrRejectDeliverRequest(item.Order.orderId, 1)
                }} />
                <Button title="Reject" color="red" onPress={() => {
                    console.log("Rejecting")
                    this.acceptOrRejectDeliverRequest(item.Order.orderId, 0)
                }} />
            </View>
        </View>)
    }
    _renderItem = ({ item, index }) => {
        return (
            <View style={styles.cardContainer}>
                <Text style={styles.title}> {item.title}</Text>
            </View>
        );
    }

    onCarouselItemChange(index) {
        var orderLocation = {
            "geoLocationX": this.state.pendingRequests[index].Order.geoLocationX,
            "geoLocationY": this.state.pendingRequests[index].Order.geoLocationY
        }
        var restaurantLocation = {
            "geoLocationX": this.state.pendingRequests[index].Order.restaurant.geoLocationX,
            "geoLocationY": this.state.pendingRequests[index].Order.restaurant.geoLocationY
        }

        this.setState({
            isSniped: true,
            restaurant: this.state.pendingRequests[index].Order.restaurant,
            orderLocation: orderLocation
        })

        console.log(JSON.stringify(this.state.pendingRequests[index].Order))
        var Order = this.state.pendingRequests[index].Order
        this._map.animateToRegion({
            latitude: Order.restaurant.geoLocationX,
            longitude: Order.restaurant.geoLocationY,
            latitudeDelta: 0.09,
            longitudeDelta: 0.035
        })
        this._map.animateToRegion({
            latitude: orderLocation.geoLocationX,
            longitude: orderLocation.geoLocationY,
            latitudeDelta: 0.09,
            longitudeDelta: 0.035
        })
    }
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <MapView provider={PROVIDER_GOOGLE}
                    style={styles.map}

                    ref={map => this._map = map}
                    initialRegion={{
                        latitude: parseFloat(this.state.currentLatitude),
                        longitude: parseFloat(this.state.currentLongitude),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    <Circle center={{ latitude: parseFloat(this.state.currentLatitude), longitude: parseFloat(this.state.currentLongitude) }}
                        radius={1000}
                        fillColor={'rgba(100,100,200,0.3)'}
                    />
                    <Marker
                        coordinate={{ latitude: parseFloat(this.state.currentLatitude), longitude: parseFloat(this.state.currentLongitude) }}
                        title="You are here">
                    </Marker>
                    {this.state.isSniped && <Marker
                        coordinate={{
                            latitude: parseFloat(this.state.restaurant.geoLocationX),
                            longitude: parseFloat(this.state.restaurant.geoLocationY)

                        }}
                        title="From this restaurant"></Marker>}
                    {this.state.isSniped && <Marker coordinate={{
                        latitude: parseFloat(this.state.orderLocation.geoLocationX),
                        longitude: parseFloat(this.state.orderLocation.geoLocationY)
                    }}
                        title="From this user"></Marker>}


                </MapView>
                
                <Modal style={styles.modal}
                    animationType={"slide"}
                    transparent={false} visible={this.state.showingOrderDetails} onRequestClose={() => { console.log("Modal has been closed.") }}>
                    <View style={styles.modalView}>
                        <Text>Restaurant details</Text>
                        <View style={{ flexDirection: "row", marginLeft: 40, marginRight: 40 }}>

                            <Image style={{ width: 66, height: 58, marginTop: 5 }}
                                source={{ uri: "https://firebasestorage.googleapis.com/v0/b/foodordering-f210f.appspot.com/o/Sun%20May%2003%202020%2008%3A03%3A07%20GMT%2B0530%20(IST)-IMG_20200427_175358.jpg?alt=media&token=b73b5cca-7438-4818-a329-bd3ab86b925a" }} />
                            <View>
                                <Text>{(this.state.restaurant.name)}</Text>
                                <Text>{this.state.restaurant.location}</Text>
                                <Text>{this.state.restaurant.geoLocationX},{this.state.restaurant.geoLocationY}</Text>
                            </View>
                        </View>
                        <View>
                            <Text>Customer:{this.state.user.name}</Text>
                        </View>
                        <View>
                            <Text>Foods and addons</Text>
                            <View style={{ backgroundColor: "tomato", height: 100, width: 250 }} >
                                <FlatList data={this.state.foods} renderItem={this.renderFoods.bind(this)}
                                    keyExtractor={(item, index) => index.toString()} />
                            </View>
                            <Text>Total Price=</Text>

                            <Button
                                title="Close"
                                onPress={() => { this.setState({ showingOrderDetails: false }) }}
                            />
                        </View>
                    </View>
                </Modal>
                <Carousel
                    containerCustomStyle={styles.Carousel}
                    ref={(c) => { this._carousel = c; }}

                    removeClippedSubviews={false}
                    data={this.state.pendingRequests}
                    renderItem={this.renderEachPendingOrder.bind(this)}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={300}
                    layout={'default'} layoutCardOffset={`9`}
                    onSnapToItem={(index) => this.onCarouselItemChange(index)}
                />



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
        width: '100%',
        flex: 1
    },
    style_5: {
        padding: 20,
        textAlign: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    container: {
        ...StyleSheet.absoluteFillObject
    },
    CarouselView: {
        backgroundColor: "pink",
        // height: 200,
        width: '100%',
        position: 'absolute',
        bottom: 0
    },
    Carousel: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 48
    },
    modal: {
        backgroundColor: 'rgba(52, 52, 52, 0.2)',
    }, modalView: {
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#00BCD4",
        height: 400,
        width: '80%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        marginTop: 80,
        marginLeft: 40,

    },
    logo: {
        width: 66,
        height: 58,
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    cardContainer: {
        backgroundColor: 'rgba(256, 256, 256, 1)',
        height: 200,
        width: 300,
        padding: 24,
        borderRadius: 24
    },
})


export default DeliveryBoyHomePage;