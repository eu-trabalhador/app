import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


type Props = {
  name: any;
  press?: () => void;
};

export const ButtonComponent = ({ name,press}:Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={press} >
      <Text allowFontScaling={false} style={styles.textName}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0038E1',
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    verticalAlign: 'middle',
    width: '100%',
    height: 48,
    justifyContent: 'center'

  },
  textName: {
    color: '#ffffff',
    fontSize: 16,
    // fontFamily: 'Inter',
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
    height: 24,
    alignContent:'center'
  },
});

