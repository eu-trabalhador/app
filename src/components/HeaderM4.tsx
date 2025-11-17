import React, { useEffect } from 'react';
import { StyleSheet, Image, View, ImageBackground , TouchableOpacity ,Text } from 'react-native';
import { ButtonBack } from './ButtonBack';
import { ButtonEdit } from './ButtonEdit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  imagem: any;
  name: any;
  navigation : any,
  editable:any,
  edit?: (it:boolean) => void;
  onchangeImage?: () => void;
};

export const HeaderM4 = ({imagem,name,navigation,editable,edit,onchangeImage}:Props) => {

  const insets = useSafeAreaInsets();
  const headerHeight = 150 + insets.top;
  return (
    <View style={[styles.view, {height: headerHeight }]} >
      <ImageBackground
        source={require('../assets/images/Ellipse2.png')}
        style={[styles.image, {height: headerHeight }]}
        resizeMode="cover"
      >
      </ImageBackground>
        <View style={[styles.containerPersonal, {height: headerHeight }]}>
          <View style = {[styles.containerbuton,{top:insets.top}]}>
            <View style = {styles.button}>
              <ButtonBack navigation={navigation}/>
            </View>
            <Text allowFontScaling={false} style={styles.titleName}>{name.length > 15 ?name.slice(0, 15) + '...':name}</Text>
            <View style = {styles.button}>
              <ButtonEdit press={(it:boolean)=>{
                if(edit){
                  edit(it)
              }}} editable = {editable}/>
            </View>
          </View>
          <TouchableOpacity 
            style={{top:40}} 
            disabled={!editable}
            onPress={()=>{
              if(onchangeImage) onchangeImage()
            }}
          >
            <Image
              // source={{uri: `data:image/jpeg;base64, ${imagem}`}}
              // source={ imagem !== "" ? {uri: `data:image/jpeg;base64, ${imagem}`} : editable ? require('../assets/images/botao-adicionar.png'):require('../assets/images/simbolo-do-usuario.png')}
              source={ imagem ? {uri: `${imagem}`} : editable ? require('../assets/images/botao-adicionar.png'):require('../assets/images/simbolo-do-usuario.png')}
              // source={image}
              style={styles.imagePersonal}
            />
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    width: '100%',
    // height: 150
  },
  image: {
    // marginTop: -110,
    width: 430,
    // height: 150,
    opacity : 1
  },
  containerbuton:{
    width : '100%',
    flexDirection : 'row',
    gap : 10,

    alignItems : 'center',
    justifyContent : 'space-between',
    height : 42,
    paddingLeft : 8,
    paddingRight : 18,
    // backgroundColor:"#000000"

  },
  button:{
    width :60,
    height : 60,
    // backgroundColor:"#df0000",
    // alignContent:"center"
    justifyContent:'center',
    alignItems:'center'
  },
  containerPersonal:{
    top : 26,
    position : 'absolute',
    width : '100%',
    alignContent: 'center',
    alignItems : 'center',
    flexDirection : 'column',
    gap : 22,
    // height : 154,
    justifyContent : 'flex-start'
  },
  titleName:{
    // fontFamily : 'Poppins',
    fontSize : 28,
    fontWeight : '400',
    lineHeight : 42,
    textAlign : 'center',
    color : '#FFFFFF',
    height: 42,
  },

  imagePersonal:{
    width : 100,
    height : 100,
    borderColor : '#000170',
    borderWidth : 1,
    borderRadius : 50,
    backgroundColor : '#ffffff',
  },
});

