import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


type Props = {
  placeHolder: any;
  keyboardType: any;
  onChangeText?: (it:string) => void;
  focus : boolean;
  steFocus: () => void;
};


export const InputPassword = (
  { 
    placeHolder , 
    keyboardType,
    onChangeText,
    focus,
    steFocus
  
  }:Props) => {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [security, setVisible] = useState(true);

  const toggletext = (it:string)=>{
    setText(it)
    if(onChangeText) onChangeText(it)
  }


  const toggleSecureEntry = () => {
    setVisible(!security);
  };

  useEffect(() => {
    if (focus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focus]);

  return (
    <View style={styles.containerInput}>
      <TextInput style={styles.input}
        autoComplete="off"
        importantForAutofill="no"
        ref={inputRef} 
        placeholder= {placeHolder}
        value = {text}
        onChangeText={toggletext}
        keyboardType={keyboardType}
        placeholderTextColor='#a17d1c8d'
        secureTextEntry ={security}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={toggleSecureEntry} style={styles.icon}>
        <Icon name={security ? 'visibility-off' : 'visibility'} size={20} color='#807979' />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({

  containerInput :{
    width : '100%',
    flexDirection:'row'
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


  icon:{
    position: 'absolute',
    right: 16,
    top: 18,
  }
});

