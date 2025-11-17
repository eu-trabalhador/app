import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from 'react-native';

type Props = {
 visible : boolean;
 setVisible:(it:boolean)=>void;
 functionCamera:()=>void;
 functionFile:()=>void;
}


export const ModalGetFilOrImagem = ({visible,setVisible,functionCamera,functionFile}:Props) => {

 return (
  <Modal
  transparent
  visible = {visible}
  animationType="fade"
  onDismiss={() => setVisible(false)}
  onRequestClose={() => setVisible(false)}
  >
    <TouchableOpacity style={styles.modal} onPressOut={() => setVisible(false)} >
      <View style={styles.modalContent}>
          
        <Text allowFontScaling={false} style = {styles.text12}>
          Selecione uma opção
        </Text>
        <View style = {styles.container2}>
          <TouchableOpacity onPress={()=>{functionCamera(), setVisible(false)}} style={styles.button22}>
            <Text allowFontScaling={false} style = {styles.text22}>
            Tirar Foto
            </Text>
            <Image
              source={require('../assets/images/camera_preto_branco.png')}
              style={styles.imageIcon1}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{functionFile(), setVisible(false)}} style={styles.button22}>
            <Text allowFontScaling={false} style = {styles.text22}>
              Escolher Galeria
            </Text>
            
            <Image
              source={require('../assets/images/galery_image_preto_brancoSem título.png')}
              style={styles.imageIcon2}
            />
          </TouchableOpacity>
        </View>
      </View>
      </TouchableOpacity>
  </Modal>
 )
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#ffffffcf',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding : 23,
    flexDirection:'column',
    justifyContent : 'center',
    alignItems:'center'
  },
  modalContent: {
    padding: 23,
    borderRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:"#f7f7f7",
    width : '100%',
    height : '25%',
    shadowColor : '#000000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6, 
    paddingHorizontal: 15,
    paddingVertical : 10,
    

  },
  text12:{
    // marginBottom:18,
    fontWeight:"800",
    fontSize:18,
    color:"#5c5656",
    height : 22,
    margin : 20
  },
  container2:{
   width:"100%" ,
   height: 100,
   justifyContent:"space-between",
   alignContent:"center",
   alignItems:"center",
   borderColor:"#5f5656",
   borderRadius:10,
   flexDirection:"row"
  },
  text22:{
    marginBottom:5,
    fontWeight:"700",
    color:"#5f5656",
  },
 
//  modalContent: {
//    padding: 20,
//    borderRadius: 6,
//    justifyContent: 'center',
//    alignItems: 'center',
//    backgroundColor:"#FFF",
//  },
  button22:{
    width: '50%',
    height : '100%',
    padding: '5%',
    alignItems: 'center',
    flexDirection:'column',
    justifyContent:'center',
    borderWidth: 1,
    borderColor: '#F0EDED',
    gap : 3
  },
  imageIcon1:{
    width : 60,
    height:40
  },
  imageIcon2:{
    width : 40,
    height:40
  }
});