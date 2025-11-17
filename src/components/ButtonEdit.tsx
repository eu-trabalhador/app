import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  editable:any,
  press?: (it:boolean) => void;
};


export const ButtonEdit = ({editable,press}:Props) => {

  const [image, setImage] = useState("edit");



  const hadlebuton = (it:boolean) => {
    if(it) setImage('edit')
    if(!it) setImage('save')
    if(press) {
      press(!editable)
    }
  };


  return (
    <TouchableOpacity style={styles.button} onPress={()=> {
      hadlebuton(editable)
    }}>
      <Icon name={image} style={styles.icon} size = {40}  color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height : 40
  },
  button:{

  }
});

