import React, { useState,useEffect,useRef} from 'react';
import {  StyleSheet, TextInput, View } from 'react-native';


type Props = {
  value:any;
  placeHolder: any;
  keyboardType: any;
  onChangeText?: (it:string) => void;
  focus : boolean;
  steFocus: () => void;
};



export const InputText = (
  {
    value,
    placeHolder,
    keyboardType,
    onChangeText,
    focus,
    steFocus
  }:Props) => {
  // const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  
  const toggletext = (it:string)=>{
    
    if(onChangeText) onChangeText(it)
    // if(steFocus) steFocus()
  }

  useEffect(() => {
    if (focus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focus]);



  return (
    <View style={styles.containerInput}>
      <TextInput style={styles.input}
        // focusable={focus}
        autoComplete="off"
        importantForAutofill="no"
        ref={inputRef} 
        placeholder= {placeHolder}
        value = {value}
        onChangeText={toggletext}
        keyboardType={keyboardType}
        placeholderTextColor='#a17d1c8d'
        autoCapitalize="none"
      />
    </View>
  );
};


const styles = StyleSheet.create({

  containerInput :{
    width : '100%'
  },
  
  input:{
    height: 56,
    borderColor: '#F0E3C2',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    width : '100%',
    backgroundColor : '#FEF4D8',
    color : '#A17D1C',
    // fontFamily : 'Inter',
    fontWeight : '400',
    fontSize : 16,
    lineHeight : 24,
  },
});

