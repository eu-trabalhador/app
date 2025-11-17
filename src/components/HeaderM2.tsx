import React from 'react';
import {  Text, StyleSheet, View, ImageBackground } from 'react-native';
import { ButtonBack } from './ButtonBack';
import { ButtonShowbar } from './ButtonShowbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  navigation : any;
  press?: () => void;
};

export const HeaderM2 = ({title,navigation,press}:Props) => {
  const insets = useSafeAreaInsets();
  const headerHeight = 68 + insets.top;
  return (
    <View style={[styles.view, {height: headerHeight }]}>
      <ImageBackground
        source={require('../assets/images/Ellipse1.jpg')}
        style={[styles.image, {height: headerHeight }]}
        resizeMode="cover"
      ></ImageBackground>
      <View style={[styles.menu, {top: insets.top }]}>
        <ButtonBack navigation={navigation}/>
        <Text allowFontScaling={false} style={styles.title}>{title}</Text>
        <ButtonShowbar press={() =>{
          if(press){
            press()
          }}}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex : 1,
    flexDirection : 'column',
    alignItems : 'center' ,
    width: '100%',
    height: 68,
    position: 'relative',
    overflow: 'hidden',
    borderBottomEndRadius: 10,
    borderBottomStartRadius : 10,
  },
  image: {
    position: 'relative',
    // marginTop: -192,
    width: '100%',
    // height: 68,
    opacity : 1
  },
  menu:{
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-between',
    position: 'absolute',
    width : '100%',
    height : 68,
    paddingVertical : 14,
    // paddingLeft : 8,
    paddingRight : 18,
  },
  title:{
    // fontFamily : 'Poppins-Regular',
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 35,
    textAlign: 'center',
    alignContent:'center',
    flex : 1
  }
});

