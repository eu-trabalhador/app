import React from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';

type Props = {
  imagePath: any;
  onPress?: () => void;
};

export const ButtonComponentCircleM2 = ({imagePath,onPress}:Props) => {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={()=>{
        if(onPress) onPress();
      }}
    >
      <Image
        source={imagePath}
        style={styles.image}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#c8c8c8',
    borderRadius: 37.5,
    flexDirection : 'column',
    alignItems: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
    width: 75,
    height: 75,
    
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 4, 

  },
  image:{
    // height : 22,
    width : 22.5,
  },

});

