import { StyleSheet, View, TouchableOpacity, Text, Modal, Alert, ActivityIndicator } from 'react-native';


import { HeaderM4 } from '../components/HeaderM4';

import {useNavigation} from '@react-navigation/native'
import { AppStack } from '../routes/AppStack'
// import { userImage } from '../assets/images/user.jpg'
// import { useFonts,Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';
import {  useSafeAreaInsets } from 'react-native-safe-area-context';
import {  SafeAreaView} from 'react-native';
import { ItemLinhaUser } from '../components/ItemLinhaUser';
import { useEffect, useState } from 'react';
import { useUser } from '../context/Auth';
import {validarCPF,validarEmail} from '../context/Validador'
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import storage from "@react-native-firebase/storage"
import { ModalGetFilOrImagem } from '../components/ModalGetFilOrImagem';
import { camera3x4, fileImage3x4 } from '../../services/managerfiles';
import React from "react";


export default function Login() {
  const [spiner, setSpiner] = useState(false);
  const{signOut,modifyPassword,user,usuario,setAction,setUsuario,setInitializing} = useUser();
  
  const [imagem, setImagem] = useState(usuario.imagem||null);

  useEffect(()=>{
    setImagem(usuario.imagem)
  },[usuario])

  const navigation = useNavigation<AppStack>();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [editable, setEditable] = useState(false);
  
  
  //imagem do usuario
  const [visibleManagerFile, setVisibleManagerFile] = useState(false);
  const [imageOriginalUpLoad, setImageUpLoad] = useState<string>();
  // const [filename, setFilename] = useState("");
  // const [filePath, setFilePath] = useState("");
  // useEffect(()=>{
  //   if(imageOriginalUpLoad){
  //    setFilename(imageOriginalUpLoad.substring(imageOriginalUpLoad.lastIndexOf("/")+1))
  //    setFilePath(imageOriginalUpLoad.replace('file://',''))
     
  //    console.log(imageOriginalUpLoad)
  //    console.log(imageOriginalUpLoad.substring(imageOriginalUpLoad.lastIndexOf("/")+1))
  //    console.log(imageOriginalUpLoad.replace('file://',''))
  //   }
  // },[imageOriginalUpLoad])

  
  const maskEmail = (email:string | null | undefined) => {
    if(email){
      const [user, domain] = email.split("@");
      const maskedUser = user.length > 2 ? `${user.charAt(0)}****${user.charAt(user.length - 1)}` : `${user.charAt(0)}****`;
      return `${maskedUser}@${domain}`;
    }else{
      return "";
    }
  };

  const maskCPF = (cpf:string | null | undefined) => {
    if (cpf) {

      const cleanedCPF = cpf.replace(/[^\d]/g, "");
      if (cleanedCPF.length !== 11) {
        throw new Error("CPF inválido. Deve conter 11 dígitos.");
      }
      const maskedCPF = `${cleanedCPF.slice(0, 3)}.***.***-${cleanedCPF.slice(-2)}`;
      return maskedCPF;
    }else{
      return "";
    }
  };

  function masTelefone(telefone:string | null | undefined) {
    if(telefone){

      const apenasNumeros = telefone.replace(/\D/g, '');
      if (apenasNumeros.length === 10) {
        return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else if (apenasNumeros.length === 11) {
        return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else {
        return telefone;
      }
    }else{
      return ""
    }
  }
  
  
  const [name, setName] = useState(usuario?.nome);
  const [telefone, setTelefone] = useState(usuario?.telefone);
  const [cpf, setCpf] = useState(usuario?.cpf);
  
  const [email, setEmail] = useState(user?.email);


  const maskFirtsName = (name:string)=>{
    if (name) {
      const primeiraParte = name.split(" ")[0].split(".")[0].toLowerCase();
      return primeiraParte.charAt(0).toUpperCase() + primeiraParte.slice(1);
    }
    else return name
  }



  const sanitizeInput = (input: any) => {
    const trimmedInput = input.trim();
    if (trimmedInput.includes("@")) {
      return trimmedInput;
    }
    return trimmedInput.replace(/[^\d]/g,"");
  };

  const validarCampos = () => {
    if (!name?.trim()) {
      Alert.alert("Erro", "O campo Nome é obrigatório.");
      return false;
    }
    if (!cpf?.trim() || !validarCPF(cpf)) {
      Alert.alert("Erro", "CPF inválido ou não informado.");
      return false;
    }
    if (!email?.trim() || !validarEmail(email)) {
      Alert.alert("Erro", "E-mail inválido ou não informado.");
      return false;
    }
    if (!telefone?.trim()) {
      Alert.alert("Erro", "O campo Telefone é obrigatório.");
      return false;
    }
    return true; 
  };


  const handleEditImage = () =>{
    console.log("mudando imagem")
  } 



  const toggleVisible = (value:boolean) => {
    setVisible(value)
  };

  const handleSignOut = async() => {
    try{
       await signOut();
    }catch (error) {
      Alert.alert("Erro ao fazer logout, tente novamente.");
    };
  }

  const handleModifyUsuario = async ()=>{
    setInitializing(true)
    try{
      if(validarCampos()){
        const userCollectionRef = firestore().collection("usuario");
        if (auth().currentUser) {
          const uid = auth().currentUser?.uid;

          const filename = imageOriginalUpLoad?.substring(imageOriginalUpLoad.lastIndexOf("/")+1)
          const filePath = imageOriginalUpLoad?.replace('file://','')

          const updatedUserData = {
            nome: name?.trim() || usuario?.nome,
            cpf: sanitizeInput(cpf) || usuario?.cpf,
            email: sanitizeInput(email)||usuario?.email,
            telefone: sanitizeInput(telefone)||usuario?.telefone,
            imagem: usuario?.imagem
          };

          if(filename&&filePath){
            const storageRef = await storage().ref(`user/${auth().currentUser?.uid}/${filename}`)
            await storageRef.putFile(filePath);
            const downloadURL = await storageRef.getDownloadURL();
            console.log("Operação realizada")
            updatedUserData.imagem = downloadURL
            
          }

          await userCollectionRef.doc(uid).update(updatedUserData);
          
          Alert.alert(
            "Dados atualizados com sucesso!"
          );

          navigation.navigate('Home')

          // setAction('reload')
          setUsuario((prevUsuario) => ({ ...prevUsuario, ...updatedUserData }));
          
          setInitializing(false)

        }else { 
          setInitializing(false)
          Alert.alert("Erro", "Usuário não encontrado.");
        }
      }else{
        setInitializing(false)
        Alert.alert("Algum dado está inconsistente");
      }
    }catch(error){
      setInitializing(false)
      Alert.alert("Erro de atualização, tente novamente.");
      console.log(error)
      setEditable(false)
    }
  }




  const handleModifyPassword = async() => {
    setSpiner(true)
    try{
      if(user && user.email){ 
        await modifyPassword(user.email);
        toggleVisible(true);
        setSpiner(false)
      }else{
        setSpiner(false)
        Alert.alert("Usuário não encontrado ou sem e-mail disponível.");
      }
    }catch (error) {
      setSpiner(false)
      Alert.alert("Erro ao fazer logout, tente novamente");
    };
  }

  const handleEdit = (it:boolean) =>{
    
    if(!it){
      handleModifyUsuario()
    }
    setEditable(it)
    
  }

  const handleSelectImage = async (source: 'camera' | 'file') => {
    const imagePath = source === 'camera' ? await camera3x4() : await fileImage3x4();
  
    if (imagePath) {
      setImageUpLoad(imagePath); 
      setImagem(imagePath);
    }
  };
  

  const headerHeight = 150 + insets.top;

  return (

    <View style = {styles.container}>

      <View style={[styles.header, {height: headerHeight }]}>
        <HeaderM4 imagem={imagem} navigation = {navigation} name = {maskFirtsName(name)} editable={editable} edit={(it:boolean)=>handleEdit(it)} onchangeImage = {()=>{setVisibleManagerFile(true)}}/>
      </View>

      <View style = {styles.body}>

        <ItemLinhaUser keyValue = {"Nome"} value = {name} colorValue ={'#000000'} editable={editable} onChangeText={(it:string)=>setName(it)}/>
        <ItemLinhaUser keyValue = {"CPF"} value = {maskCPF(cpf)} colorValue ={'#00000036'} editable={false} onChangeText={(it:string)=>setCpf(it)}/>
        <ItemLinhaUser keyValue = {"E-mail"} value = {email} colorValue ={'#00000036'} editable={false} onChangeText={(it:string)=>setEmail(it)}/>
        <ItemLinhaUser keyValue = {"Telefone"} value = {masTelefone(telefone)} colorValue ={'#000000'} editable={editable} onChangeText={(it:string)=>setTelefone(it)}/>

        <TouchableOpacity style={styles.button} onPress={()=>{
          handleModifyPassword();
        }}>
          <Text allowFontScaling={false} style={styles.textName}>Alterar senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button2} onPress={()=>{
          // toggleVisible(true)
          handleSignOut()
          }}>
          <Text allowFontScaling={false} style={styles.textName2}>Sair</Text>
        </TouchableOpacity>

      </View>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => {
          toggleVisible(false)
          // handleSignOut()
        }}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={0.4}      
          onPressOut={() => {
            toggleVisible(false)
            // handleSignOut()
          }}
        >
          <View style={styles.containerPassword}>
            <Text allowFontScaling={false} style={styles.text1}>Alteração de senha</Text>
            <Text allowFontScaling={false} style={styles.text2} numberOfLines={3} ellipsizeMode="tail">Foi enviado um <Text allowFontScaling={false} style={styles.email}>e-mail</Text> de alteração de senha para o endereço <Text allowFontScaling={false} style={styles.email}>{maskEmail(user?.email)}</Text>.</Text>
          </View>
        </TouchableOpacity>
      </Modal>
            <Modal
              transparent
              visible={spiner}
              animationType="fade"
              // onRequestClose={() => toggleisPopupVisible(false)}
            >
              <View style={{flexDirection:'column',backgroundColor:'#ffffff50',justifyContent:'center',alignItems:'center',width:"100%",height:'100%'}}>
                <ActivityIndicator size="large" />
              </View>
            </Modal>
      <ModalGetFilOrImagem visible = {visibleManagerFile} setVisible={setVisibleManagerFile} functionCamera={async ()=>{handleSelectImage("camera")}} functionFile={async ()=>{handleSelectImage('file')}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex :1,
    flexDirection: 'column',
    alignItems: 'center',
    width : '100%',
    height : '100%',
    justifyContent : 'flex-start',
    backgroundColor : '#FFFFFF'
  },

  header:{
    // marginTop:-120,
    width : '100%',
    // height : 180,
    // backgroundColor:"#000000ff"
  },

  body : {
    top:228,
    flex : 1,
    flexDirection : 'column',
    width : '100%',
    justifyContent : 'flex-start',
    position: 'absolute',
    padding : 24
  },

  button:{
    width : '100%',
    height : 61,
    justifyContent : 'center',
    flexDirection:'row',
    paddingHorizontal : 30,
    paddingVertical : 10,
    borderBottomColor : '#00000036',
    borderBottomWidth : 0.75,
    alignItems : 'center'
  },
  button2:{
    height : 61,
    alignContent : 'center',
    justifyContent : 'center'
  },
  textName:{
    height: 21,
    // fontFamily : 'Poppins',
    color : '#000acb',
    fontWeight : '400',
    fontSize : 14,
    lineHeight : 21,
    width : '100%',
    textAlign : 'center',
    textDecorationLine:'underline'
  },
  textName2:{
    height: 21,
    // fontFamily : 'Poppins',
    color : '#000000',
    fontWeight : '500',
    fontSize : 14,
    lineHeight : 21,
    width : '100%',
    textAlign : 'center',
  },

  

  modal: {
    flex: 1,
    backgroundColor: '#ffffffc7',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding : 23
  },
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  containerPassword:{
    top: 346,
    backgroundColor : '#ffffff',
    borderRadius : 25,
    height : 121,
    width: '100%',
    borderColor : "#00000014",
    borderWidth : 1,
    shadowColor : '#000000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6, 
    paddingHorizontal: 15,
    paddingVertical : 10,
    gap : 18
  },
  text1:{
    color: '#000000',
    fontSize: 16,
    // fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 20.83,
    textAlign: 'center',
    height: 21,
    alignContent:'center'
  },
  text2:{
    color: '#000000af',
    fontSize: 14,
    // fontFamily: 'DM Sans',
    fontWeight: '400',
    lineHeight: 18.23,
    textAlign: 'center',
    alignContent:'center'
  },
  email: {
    color: '#1717f9', // Cor azul para o e-mail
  },

















});
