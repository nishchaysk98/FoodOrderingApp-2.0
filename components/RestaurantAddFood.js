import React from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Button, StatusBar, Image, TouchableOpacity } from "react-native"
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker'
import axios from "axios";

export default class RestaurantAddFood extends React.Component {
  constructor(props) {
    super(props)
    this.url = this.props.location.state.url;
    this.rid = this.props.location.state.rid;
    this.state = {
      json: {
        rid: this.props.location.state.rid,
        name: "",
        description: "",
        addOnQsnsDetails: {
          false: [],
          true: []
        },
        picture: "",
        price: 0.0
      },
      questioni: "",
      pricei: "0.0",
      questione: "",
      pricee: "0.0",
      imageFile: ""
    }
  }
  onNameChange = (evt) => {
    if (evt.length == 0) {
      this.nameText.setNativeProps({
        style: {
          color: "red"
        }
      })
    }
    else {
      this.nameText.setNativeProps({
        style: {
          color: "black"
        }
      })
    }
    this.setState(prevState => ({
      json: {
        ...prevState.json,
        name: evt
      }
    }))
  }
  onDescriptionChange = (evt) => {
    if (evt.length == 0) {
      this.descriptionText.setNativeProps({
        style: {
          color: "red"
        }
      })
    }
    else {
      this.descriptionText.setNativeProps({
        style: {
          color: "black"
        }
      })
    }
    this.setState(prevState => ({
      json: {
        ...prevState.json,
        description: evt
      }
    }))
  }
  onPictureChange = (evt) => {
    this.setState(prevState => ({
      json: {
        ...prevState.json,
        picture: evt
      }
    }))
  }
  onPriceChange = (evt) => {
    if (evt.length == 0) {
      this.priceText.setNativeProps({
        style: {
          color: "red"
        }
      })
    }
    else {
      this.priceText.setNativeProps({
        style: {
          color: "black"
        }
      })
    }
    this.setState(prevState => ({
      json: {
        ...prevState.json,
        price: parseFloat(evt)
      }
    }))
  }
  onQuestionChangeI = (evt) => {
    if (evt.length == 0) {
      this.iQsnText.setNativeProps({
        style: {
          color: "red"
        }
      })
    }
    else {
      this.iQsnText.setNativeProps({
        style: {
          color: "black"
        }
      })
    }
    this.setState({
      questioni: evt
    })
  }
  onaddPriceChangeI = (evt) => {
    if (evt.length == 0) {
      this.iPriceText.setNativeProps({
        style: {
          color: "red"
        }
      })
    }
    else {
      this.iPriceText.setNativeProps({
        style: {
          color: "black"
        }
      })
    }
    this.setState({
      pricei: (evt)
    })

  }
  onQuestionChangeE = (evt) => {
    if (evt.length == 0) {
      this.eQsnText.setNativeProps({
        style: {
          color: "red"
        }
      })
    }
    else {
      this.eQsnText.setNativeProps({
        style: {
          color: "black"
        }
      })
    }
    this.setState({
      questione: evt
    })
  }
  onaddPriceChangeE = (evt) => {
    if (evt.length == 0) {
      this.ePriceText.setNativeProps({
        style: {
          color: "red"
        }
      })
    }
    else {
      this.ePriceText.setNativeProps({
        style: {
          color: "black"
        }
      })
    }
    this.setState({
      pricee: (evt)
    })
  }
  onSaveInclusive = (evt) => {

    if (this.state.questioni != "" && !isNaN(parseFloat(this.state.pricei))) {
      this.setState(prevState => ({
        json: {
          ...prevState.json,
          addOnQsnsDetails: {
            ...prevState.json.addOnQsnsDetails,
            false: [...prevState.json.addOnQsnsDetails.false, {
              exclusive: false,
              question: this.state.questioni,
              addOnPrice: parseFloat(this.state.pricei)
            }]
          }
        }
      }), alert("Inclusive Added"))
      this.setState({
        questioni: "",
        pricei: "0.0"
      })
    }
    else {
      alert("Invalid Data")
    }


  }
  onSaveExclusive = (evt) => {

    if (this.state.questione != "" && !isNaN(parseFloat(this.state.pricee))) {
      this.setState(prevState => ({
        json: {
          ...prevState.json,
          addOnQsnsDetails: {
            ...prevState.json.addOnQsnsDetails,
            true: [...prevState.json.addOnQsnsDetails.true, {
              exclusive: true,
              question: this.state.questione,
              addOnPrice: parseFloat(this.state.pricee)
            }]
          }
        }
      }), alert("Exclusive Added"))
      this.setState({
        questione: "",
        pricee: "0.0"
      })
    }
    else {
      alert("Invalid Data")
    }
  }
  onSubmit = () => {
    var fName = this.state.json.name;
    var fDescription = this.state.json.description;
    var fPrice = this.state.json.price;
    console.log(typeof (fPrice), fPrice, isNaN(fPrice))
    if (fName.length == 0) {
      alert("Name is required")
      this.onNameChange("")
      this.nameInput.focus()
    }
    else if (fDescription.length == 0) {
      alert("Description is required")
      this.onDescriptionChange("")
      this.descriptionInput.focus()
    }
    else if (fPrice == 0 || isNaN(fPrice)) {
      alert("Price cannot be 0")
      this.onPriceChange("")
      this.priceInput.focus()
    }
    else {
      axios.put(this.url + "/restaurant/addfood", this.state.json)
        .then((response) => {
          console.log(Object.keys(response))
          console.log(response.data)
          if (response.data != -1) {
            const fId = response.data
            const ref = firebase.storage().ref();
            const name = new Date() + '-' + this.state.imageFile.name;
            const metadata = {
              contentType: this.state.imageFile.type
            }
            console.log(Object.keys(response))
            const task = ref.child(name).putFile(this.state.imageFile.path, metadata)
            task
              .then(response => {
                console.log(response.downloadURL)
                const downloadURL = response.downloadURL
                axios.put(this.url + "/restaurant/food/updatepic/" + fId, {
                  downloadURL
                })
                  .then((response) => {
                    if (response.data == 1)
                      alert("Image added successfully")
                    console.log(response)
                  })
                  .catch((error) => {
                    alert("Something went wrong")
                    console.log(error)
                  })

              })
              .catch((error) => {
                //  alert(error)
              })
            alert("Food added successfuly. Please wait till we finish image upload")
          }
          else {
            // alert("Something went wrong")
          }
        })
        .catch((error) => {
          //   alert(error)
          console.log(error)
        })
    }
    //take url as this.url
    //this.state.json has the required json
  }

  async componentDidMount() {

    // fetch('https://dummy.restapiexample.com/api/v1/employees')
    //   .then(response => response.json())
    //   .then(data => {
    //     this.setState({
    //       load: true,
    //       loadeddata: data, //Used in future for Real Api
    //     });

    //   })
    //   .catch(() => {});

    //   firebase.initializeApp({
    //     apiKey: "AIzaSyAlxIX3RjcXw-ZD-W1Og7ufh2k-RandqF8",
    //     authDomain: "foodordering-f210f.firebaseapp.com",
    //     databaseURL: "https://foodordering-f210f.firebaseio.com",
    //     projectId: "foodordering-f210f",
    //     storageBucket: "foodordering-f210f.appspot.com",
    //     messagingSenderId: "1098214247308",
    //     appId: "1:1098214247308:web:82c94763351a16349364a9",
    //     measurementId: "G-GZHVKSHWYV"
    // });
    // await this.checkPermission()
    // await this.messageListener()
  }
  // checkPermission = async () => {
  //   const enabled = await firebase.messaging().hasPermission();
  //   console.log(enabled)
  //   if (enabled) {
  //       this.getFcmToken();
  //   } else {
  //       this.requestPermission();
  //   }
  // }
  // getFcmToken = async () => {
  //   const fcmToken = await firebase.messaging().getToken();
  //   if (fcmToken) {
  //     console.log(fcmToken);
  //     this.showAlert('Your Firebase Token is:', fcmToken);
  //   } else {
  //     this.showAlert('Failed', 'No token received');
  //   }
  // }
  // requestPermission = async () => {
  //   try {
  //     await firebase.messaging().requestPermission();
  //     // User has authorised
  //   } catch (error) {
  //       // User has rejected permissions
  //   }
  // }      
  // messageListener = async () => {
  //   this.notificationListener = firebase.notifications().onNotification((notification) => {
  //     console.log("Notified")
  //     console.log("message", notification.message)
  //     console.log("data.message",(notification.data.message))
  //     console.log("Body", notification.body)
  //     console.log("Title", notification.title)
  //       const { title, body, message} = notification;
  //      // this.showAlert(title, body, message);
  //   });

  //   this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
  //     console.log("Notified")
  //     console.log("message", notification.message)
  //     console.log("data.message",(notification.data.message))
  //     console.log("Body", notification.body)
  //     console.log("Title", notification.title)
  //       const { title, body , message} = notificationOpen.notification;
  //       //this.showAlert(title, body, message);
  //   });


  //   const notificationOpen = await firebase.notifications().getInitialNotification();
  //   if (notificationOpen) {
  //     console.log("Notification Opened")
  //     console.log("Notification.data.message",notificationOpen.notification.data.message)

  //       const { title, body , message} = notificationOpen.notification;
  //       //this.showAlert(title, body,message);
  //   }

  //   this.messageListener = firebase.messaging().onMessage((message) => {
  //     console.log("Notified")
  //     console.log("Message",message)
  //     console.log(JSON.stringify(message));
  //   });
  // }


  // showAlert = (title,body, message) => {
  //   console.log(message)
  // }

  choosePic = () => {
    var options = {
      title: 'Select Image to upload',
    };
    ImagePicker.showImagePicker(options, (response) => {
      //console.log(response)
      this.setState({
        imageFile: response
      })
      console.log(response.path)

    })
  }
  onBack = () => {
    this.props.history.push({
      pathname: "/restauranthomepage",
      state: {
        url: this.url,
        rid: this.rid
      }
    })
  }
  inputFocused(input) {
    input.setNativeProps({
      style: { borderColor: '#EE3A8C' }
    })
  }
  inputBlurred(input) {

    input.setNativeProps({
      style: { borderColor: 'black' }
    })
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

        </View>
        <ScrollView>
          <View style={{
            alignItems: "center",
            width: '100%',
            flex: 1,
            backgroundColor: "white"
          }}>

            <View style={styles.style_3}>
              <Text style={styles.style_6}>Add Food Details Below</Text>
              <Text style={styles.style_1}
                ref={(ref) => { this.nameText = ref; }}
              >Name</Text>
              <TextInput style={styles.style_2} onChangeText={this.onNameChange}
                ref={(ref) => { this.nameInput = ref; }}
                onFocus={() => {
                  this.inputFocused(this.nameInput)
                }}
                onBlur={() => {
                  this.inputBlurred(this.nameInput)
                }}
                onSubmitEditing={() => { this.descriptionInput.focus() }}
                returnKeyType='next'

              />
              <Text style={styles.style_1}
                ref={(ref) => { this.descriptionText = ref; }}>Description</Text>
              <TextInput style={styles.style_2} onChangeText={this.onDescriptionChange}
                onSubmitEditing={() => { this.priceInput.focus() }}
                ref={(ref) => { this.descriptionInput = ref; }}
                onFocus={() => {
                  this.inputFocused(this.descriptionInput)
                }}
                onBlur={() => {
                  this.inputBlurred(this.descriptionInput)
                }}
                returnKeyType='next'

              />


              <Text style={styles.style_1}
                ref={(ref) => { this.priceText = ref; }}
              >Price</Text>
              <TextInput style={styles.style_2}
                onChangeText={this.onPriceChange}
                ref={(ref) => { this.priceInput = ref; }}
                onFocus={() => {
                  this.inputFocused(this.priceInput)
                }}
                onBlur={() => {
                  this.inputBlurred(this.priceInput)
                }}
                keyboardType='decimal-pad'

              />
              <TouchableOpacity style={{
                width: '100%',
                backgroundColor: "orange",
                marginTop: 20,
                padding: 10,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 3
              }} onPress={this.choosePic}

                ref={(ref) => { this.choosePicInput = ref; }}
              >
                <Text>Choose Picture</Text>
              </TouchableOpacity>

              <Text style={styles.style_6}>Add on Question Details</Text>


              <View style={styles.style_10}>
                <Text style={styles.style_9}>Inclusive Questions</Text>
                {
                  this.state.json.addOnQsnsDetails.false.length != 0 ? <Text style={styles.style_6}>{this.state.json.addOnQsnsDetails.false.length} Inclusive Added</Text> : <Text style={styles.style_6}>No Inclusive Added yet!</Text>
                }
                <Text style={styles.style_1}
                ref={(ref) => { this.iQsnText = ref; }}>Question</Text>
                <TextInput style={styles.style_2} onChangeText={this.onQuestionChangeI} value={this.state.questioni}
                  ref={(ref) => { this.iQsnInput = ref; }}
                  onFocus={() => {
                    this.inputFocused(this.iQsnInput)
                  }}
                  onBlur={() => {
                    this.inputBlurred(this.iQsnInput)
                  }}
                  returnKeyType='next'
                  onSubmitEditing={() => { this.iPriceInput.focus() }}
                />
                <Text style={styles.style_1}
                ref={(ref) => { this.iPriceText = ref; }}>Price</Text>
                <TextInput style={styles.style_2} onChangeText={this.onaddPriceChangeI} value={(this.state.pricei)}
                  ref={(ref) => { this.iPriceInput = ref; }}
                  onFocus={() => {
                    this.inputFocused(this.iPriceInput)
                  }}
                  onBlur={() => {
                    this.inputBlurred(this.iPriceInput)
                  }}
                  keyboardType='decimal-pad'
                  returnKeyType="go"
                  onSubmitEditing={this.onSaveInclusive}
                />
                <TouchableOpacity
                  style={{
                    width: '100%',
                    backgroundColor: "orange",
                    marginTop: 20,
                    padding: 10,
                    borderColor: "black",
                    borderWidth: 1,
                    borderRadius: 3,
                    alignItems: 'center'
                  }}
                  onPress={this.onSaveInclusive}
                >
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>


              <View style={styles.style_10}>
                <Text style={styles.style_9}>Exclusive Questions</Text>
                {
                  this.state.json.addOnQsnsDetails.true.length != 0 ? <Text style={styles.style_6}>{this.state.json.addOnQsnsDetails.true.length} Exclusive Added</Text> : <Text style={styles.style_6}>No Exclusive Added yet!</Text>
                }
                <Text style={styles.style_1}
                ref={(ref) => { this.eQsnText = ref; }}>Question</Text>
                <TextInput style={styles.style_2} onChangeText={this.onQuestionChangeE} value={this.state.questione}
                  ref={(ref) => { this.eQsnInput = ref; }}
                  onFocus={() => {
                    this.inputFocused(this.eQsnInput)
                  }}
                  onBlur={() => {
                    this.inputBlurred(this.eQsnInput)
                  }}

                  returnKeyType='next'
                  onSubmitEditing={() => { this.ePriceInput.focus() }}
                />
                <Text style={styles.style_1}
                
                ref={(ref) => { this.ePriceText = ref; }}>Price</Text>
                <TextInput style={styles.style_2} onChangeText={this.onaddPriceChangeE} value={(this.state.pricee)}
                  keyboardType='decimal-pad'
                  ref={(ref) => { this.ePriceInput = ref; }}
                  onFocus={() => {
                    this.inputFocused(this.ePriceInput)
                  }}
                  onBlur={() => {
                    this.inputBlurred(this.ePriceInput)
                  }}

                />
                <TouchableOpacity
                  style={{
                    width: '100%',
                    backgroundColor: "orange",
                    marginTop: 20,
                    padding: 10,
                    borderColor: "black",
                    borderWidth: 1,
                    borderRadius: 3,
                    alignItems: 'center'
                  }}
                  onPress={this.onSaveExclusive}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>


              <View style={styles.style_8}>
                <Button title="Add Food" onPress={this.onSubmit} />
                <Button title="Back" onPress={this.onBack} />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

}



const styles = StyleSheet.create({
  style_1: {
    width: '100%',
    marginTop: 10,
    fontWeight: 'bold'
  },
  style_2: {
    width: '100%',
    backgroundColor: "rgba(220,220,220,0.4)",
    marginTop: 10,
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 3
  },
  style_3: {
    width: '80%',
    textAlign: "center"
  },
  style_4: {
    alignItems: "center",
    width: '100%',
    flex: 1,
    backgroundColor: "#F9EBEA"
  },
  style_5: {
    padding: 20,
    textAlign: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  style_6: {
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 20,
    textAlign: "center",
    alignItems: "center",
    fontWeight: "bold"
  },
  style_7: {
    width: '100%',
    backgroundColor: "lightgrey",
    marginTop: 10,
    padding: 10
  },
  style_8: {
    marginBottom: 20,
    marginTop: 20
  },
  style_9: {
    width: '100%',
    backgroundColor: "#F9EBEA",
    marginTop: 20,
    padding: 10
  },
  style_10: {
    backgroundColor: "#DBA9A9", borderRadius:15,padding:10,margin:8,
    // padding: 20,
    // marginTop: 10
  }
})