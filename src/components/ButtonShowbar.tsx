import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

type Props = {
 press?: () => void;
}

export const ButtonShowbar = ({press}:Props) => {

  return (

      <TouchableOpacity 
        onPress={() => {
          if (press) {
            press()
          }
        }}>
        <MaterialIcons name="menu" size={50} color="white" />
      </TouchableOpacity> 
      

  );
};

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height : 50
  },
});

