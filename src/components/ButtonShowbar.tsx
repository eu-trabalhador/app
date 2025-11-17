import Icon from 'react-native-vector-icons/MaterialIcons';
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
        <Icon name="menu" style={styles.icon} size = {50} color="white" />
      </TouchableOpacity> 
      

  );
};

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height : 50
  },
});

