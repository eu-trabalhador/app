import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

type Props = {
  imagePath: any;
  text: string;
  onPress?: () => void;
};

export const ButtonComponentCircle = ({ imagePath, text, onPress}:Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image
        source={imagePath}
        style={styles.image}
      />
      <Text allowFontScaling={false} style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    // backgroundColor: '#f40000',
    borderRadius: 75,
    flexDirection : 'column',
    alignItems: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
    width: 150,
    height: 150,
    padding : 10,
    shadowColor: '#2b6197',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10, 
    gap:10,
  },
  image:{
    height : 50,
    width : 50,
    // position: 'absolute',
    alignContent:'center',
    // backgroundColor: '#f40000',
  },
  text: {
    color:'#646464',
    fontSize: 24,
    // fontFamily: 'DM_Sans',
    fontWeight: '700',
    lineHeight: 32,
    alignContent:'center',
    textAlign: 'center',
    height: 32,
    // backgroundColor: '#bebebe',
  },
});

