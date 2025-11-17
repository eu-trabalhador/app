import React from 'react';
import { Text, StyleSheet, Image, View, ImageBackground, TouchableOpacity } from 'react-native';
import { ButtonShowbar } from './ButtonShowbar';
import {useNavigation} from '@react-navigation/native'
import { AppStack } from '../routes/AppStack'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  press?: () => void;
  imagem: any;
};

export const HeaderM3 = ({title,press,imagem}:Props) => {
  const navigation = useNavigation<AppStack>();
  const insets = useSafeAreaInsets();
  const headerHeight = 68 + insets.top;
  return (
    <View style={[styles.view, {height: headerHeight }]}>
      <ImageBackground
        source={require('../assets/images/Ellipse1.jpg')}
        style={[styles.image, {height: headerHeight }]}
        // style={styles.image}
        resizeMode="cover"
      ></ImageBackground>
      <View style={[styles.menu, {top: insets.top }]}>
        <TouchableOpacity style={styles.menuUser} onPress = {()=> navigation.navigate('User')}>
          <Image
              source={imagem? {uri: `${imagem}`}:require('../assets/images/simbolo-do-usuario.png')}
              style={styles.imageUser}
            />
          <Text allowFontScaling={false} style={styles.title}>{title.length > 15 ?title.slice(0, 15) + '...':title}</Text>
        </TouchableOpacity>
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
    paddingLeft : 12,
    paddingRight : 18,
  },
  menuUser:{
    flexDirection : 'row',
    alignItems : 'center',
    alignContent:'center',
    justifyContent : 'flex-start',
    gap : 15
  },
  imageUser:{
    width : 50,
    height : 50,
    borderRadius : 25,
    alignContent : 'center'
  },
  title:{
    // fontFamily : 'Poppins-Regular',
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 35,
    textAlign: 'center',
    alignContent:'center',
    
    // flex : 1
  }

});

