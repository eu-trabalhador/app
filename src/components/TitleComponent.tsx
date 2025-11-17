import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export const TitleComponent = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.textName}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container : {
    width : '100%',
    height : 35
  },
  textName: {
    color: '#211A0A',
    fontSize: 28,
    // fontFamily: 'Inter',
    fontWeight: '700',
    lineHeight: 35,
    textAlign: 'center',
    height: 35,
    alignContent:'center',
    width : '100%'
  },
});

