import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';


export const ButtonBack = ({navigation}) => {
  
  return (
    <TouchableOpacity style={styles.button} onPress={()=>navigation.goBack()}>
      <Icon name="chevron-left" style={styles.icon} size = {60}  color="white" />
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

