import React from "react";
import { View, Button, Text, StyleSheet,Image } from "react-native";
import { store } from "../store";
import { AddItem } from "./Add/AddActionCreators";
import { connect } from "react-redux";
import { Link } from "react-router-native";


class AddItemComponent extends React.Component {

  constructor(props) {
    super(props);
    this.url = this.props.location.state.url
    this.userid = this.props.location.state.userid
    this.rid = this.props.location.state.rid

    this.state = {
      itemdetails: this.props.location.state.itemdetails,
      exlfalse: [],
      exltrue: -1,
      price: this.props.location.state.itemdetails.price,
      quantity: 1
    }
    this.prevselectedPrice = 0
    this.flag = false
    this.fixedprice = this.props.location.state.itemdetails.price
  }

  // buttonClicked = () =>{
  //   store.dispatch(AddItem())
  // }

checkBoxChange = (id, price) => {
    let newArr = this.state.exlfalse;
    if(newArr.includes(id)){
      let newArr_1 = []
      newArr.map((val) => {
        if(val != id){
          newArr_1.push(val)
        }
      })
      newArr = newArr_1;
      this.setState({
        price: this.state.price - price
      })
    }else{
      newArr.push(id)
      this.setState({
        price: this.state.price + price
      })
    }
    this.setState({
      exlfalse:newArr
    })
  }
  // /Users/juspay/Desktop/FoodOrderingApp/components/AddItem.js
  radioButtonChange = (id, price) =>{
    
    this.setState({
      exltrue: id, 
      price : this.state.price + price - this.prevselectedPrice
    })
    this.prevselectedPrice = price
  }

  addItemClicked = (id) => {
    var addOnArr = this.state.exlfalse;
    if(this.state.exltrue != -1){
      addOnArr.push(this.state.exltrue);
    }
    
    const objToSend = { "foodId": id, "addOnQId": addOnArr, "foodQuantity": this.state.quantity }
    store.dispatch(AddItem(objToSend, this.state.price, this.rid));
    alert("Item Added to Cart")
    console.log(addOnArr);
  }

  backClicked = () => {

  }

  render() {

    if (this.props.items.length != 0) {
      this.flag = true
    }

    return (
      <View>

        
        <View style={{ padding: 20, margin: 20, alignItems: "center", backgroundColor: "lightgrey" }}>

          <Image  style={styles.logo} source={{uri: "https://firebasestorage.googleapis.com/v0/b/foodordering-f210f.appspot.com/o/Sun%20May%2003%202020%2008%3A03%3A07%20GMT%2B0530%20(IST)-IMG_20200427_175358.jpg?alt=media&token=b73b5cca-7438-4818-a329-bd3ab86b925a"}}
            />
          <Text style={{ width: '100%', fontWeight: "bold", fontSize: 18 }}>{this.state.itemdetails.name}</Text>
          <Text style={{ width: '100%', fontSize: 14, marginTop: 10 }}>{this.state.itemdetails.description}</Text>
          <Text style={{ width: '100%', fontSize: 14, marginTop: 10 }}>Price: {this.state.itemdetails.price} /- </Text>

          {
            // this.state.itemdetails.addOnQsnsDetails.length != 0 ? 
            // <View style={{marginTop:20}}>
            //   <RadioComponent extraarr={this.state.itemdetails.addOnQsnsDetails}/>
            // </View> : <View></View>
          }
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Button title="-" onPress={
              () => {
                if (this.state.quantity >= 2) {
                  this.setState({
                    quantity: this.state.quantity - 1,
                    price: this.fixedprice * (this.state.quantity - 1)
                  })
                }
              }
            } />
            <Text style={{ fontWeight: "bold", marginTop: 8, marginLeft: 10, marginRight: 10 }}>{this.state.quantity}</Text>
            <Button title="+" onPress={
              () => {
                this.setState({
                  quantity: this.state.quantity + 1,
                  price: this.fixedprice * (this.state.quantity + 1)
                })
              }
            } />
          </View>
          
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>Price : {this.state.price}</Text>
          <Text style={{padding:10}}>Select one from below</Text>
          <RadioButton data={this.state.itemdetails.addOnQsnsDetails.true} state={this.state} onChange={this.radioButtonChange}/>
          <Text style={{padding:10}}>Select One or More add On from below</Text>
          <CheckBox data={this.state.itemdetails.addOnQsnsDetails.false} state={this.state} onChange={this.checkBoxChange}/>

          <View style={{ width: 100, marginTop: 10 }}>
            <Button
              title="Add Item"
              onPress={() => this.addItemClicked(this.state.itemdetails.id)}
            />
          </View>

          <Link to={{
            pathname: "/foodlist",
            state: {
              url: this.url,
              userid: this.userid,
              rid: this.rid
            }
          }} style={{ marginTop: 20 }}>
            <View>
              <Text style={{ fontWeight: "bold", backgroundColor: "lightgrey", padding: 10 }}>Back</Text>
            </View>
          </Link>
        </View>
      </View>
    )
  }

}

class RadioButton extends React.Component{
  constructor(props){
    super(props);
  }
  loadAllData = () => {
    const allData = this.props.data.map((val, pos) => {
      return <View><Text style={this.props.state.exltrue == val.id ? styles.selected: styles.defaultStyle} onPress={() => this.props.onChange(val.id, val.addOnPrice)}>{val.question} : {val.addOnPrice} Rs</Text></View>
    });
    return allData;
  }
  render(){
    return (
      <View>
        {this.loadAllData()}
      </View>)
  }
}

class CheckBox extends React.Component{
  constructor(props){
    super(props);
  }
  loadAllData = () => {
    const allData = this.props.data.map((val, pos) => {
      return <View><Text style={this.props.state.exlfalse.includes(val.id) ? styles.selected: styles.defaultStyle} onPress={() => this.props.onChange(val.id, val.addOnPrice)}>{val.question} : {val.addOnPrice} Rs</Text></View>
    });
    return allData;
  }

  render() {
    return (
      <View>
        {this.loadAllData()}
      </View>)
  }
}


function mapStateToProps(state) {
  return ({
    items: state.items
  })
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
  logo: {
    width: 66,
    height: 58,
  }, 
  selected: {
    backgroundColor:"orange",
    textAlign:"center",
    padding:10, 
    marginLeft:20, 
    marginRight:20, 
    marginBottom:10
  },
  defaultStyle: {
    textAlign: "center",
    padding:10, 
    marginLeft:20, 
    marginRight:20, 
    marginBottom:10,
    backgroundColor:"lightgrey"
  }
})
export default connect(mapStateToProps)(AddItemComponent)