import React, { SetStateAction, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { ButtonComponentCircleM3 } from './ButtonComponentCircleM3';
import Gallery from "../assets/images/Gallery.png"
import Document from "../assets/images/Document.png"

type Props = {
  gallery?: () => void;
  files?: () => void;
};

export const Popupcarregar = ({gallery,files}:Props) => {
  return (
    <View style={styles.container}>       
      <View style={styles.containerbuttons}>  
        <ButtonComponentCircleM3 imagePath={Gallery} text = {"Fotos"} funcionpress = {gallery}/>
        <ButtonComponentCircleM3 imagePath={Document} text = {"Documentos"} funcionpress = {files}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container : {
    width: '100%',
    height: 161,
    bottom : 0,
    flexDirection : 'column',
    backgroundColor : '#0976CA',
    position : 'absolute',
    alignContent : 'center',
    justifyContent : 'center',
    alignItems : 'center'
  },
  containerbuttons : {
    width: '100%',
    height: 92,
    flexDirection :'row',
    justifyContent : 'space-between'
  },
});

