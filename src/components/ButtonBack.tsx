import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';


export const ButtonBack = ({navigation}) => {
  
  return (
    <TouchableOpacity style={styles.button} onPress={()=>navigation.goBack()}>
      <MaterialIcons name="chevron-left" size={60} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 60,
    height : 60
  },
  button:{

  }
});

