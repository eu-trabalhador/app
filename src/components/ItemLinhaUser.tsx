import React, { useState } from 'react';
import { StyleSheet, TextInput, View,Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  keyValue: any;
  value: any;
  colorValue : any,
  editable: any;
  onChangeText?: (it:string) => void;
};

export const ItemLinhaUser  = ({ keyValue , value , colorValue,editable,onChangeText}:Props) => {
  


  // const [editable, setSditable] = useState(false);

  const [valueState, setValueState] = useState(value);

  const toggleValueState = (it: string) => {
    setValueState(it);
    if(onChangeText) onChangeText(it)
  };

  const colorBackGround = editable ? "#FEF4D8" : "#ffffff";
  const color = editable ? '#A17D1C' : colorValue;
  const borderColor = editable ? '#F0E3C2' : "";
  const borderWidth = editable ? 1 : 0;
  const Width = editable ? '80%' : '80%';
  

  return (
    <View style={styles.container}>

      <Text allowFontScaling={false} style={styles.key}>{keyValue}</Text>

      <TextInput style={[styles.valueState, { color: color ,backgroundColor : colorBackGround,borderColor:borderColor, borderWidth:borderWidth,width:Width}]}
        placeholder= {value}
        value = {valueState}
        onChangeText = {toggleValueState}
        // keyboardType={keyboardType}
        placeholderTextColor = {colorValue}
        editable={editable} 
      />
    </View>
  );
};


const styles = StyleSheet.create({

  container :{
    width : '100%',
    height : 61,
    flexDirection:'row',
    paddingHorizontal : 10,
    paddingVertical : 10,
    borderBottomColor : '#00000036',
    borderBottomWidth : 0.75,
    alignItems : 'center',
    // backgroundColor:"#f80000",
    justifyContent:'space-between'

  },
  
  key:{
    height: 21,
    // fontFamily : 'Poppins',
    color : '#00000059',
    fontWeight : '400',
    fontSize : 14,
    lineHeight : 21,
    width : '20%',
    textAlign : 'left',
    // backgroundColor:"#fff"
  },


  valueState:{
    height: '100%',
    // fontFamily : 'Poppins',
    // color : '#00000059',
    fontWeight : '400',
    fontSize : 14,
    lineHeight : 21,
    width : '80%',
    textAlign : 'left',
    borderRadius: 12,
    paddingLeft: 10,
    // backgroundColor: '#e00d0d',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
});

