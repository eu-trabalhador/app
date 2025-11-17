import {  Modal, SafeAreaView, StyleSheet, TouchableOpacity, View, Text ,Alert, ActivityIndicator} from 'react-native';

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';


import { HeaderM3 } from '../components/HeaderM3';
import { LinearGradient } from 'expo-linear-gradient';
import { ButtonComponentCircle } from '../components/ButtonComponentCircle';
import { CardM1 } from '../components/CardM1';
import Plus from "../assets/images/Plus.png"
import Camera from "../assets/images/Camera.png"
import Folder from "../assets/images/Folder.png"
import Paper from "../assets/images/Paper.jpeg"
import { Popupcarregar } from '../components/Popupcarregar';
import { useEffect, useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Bar } from '../components/Bar';
import { useUser } from '../context/Auth';
import * as ImageManipulator from "expo-image-manipulator";
import { camera, fileImage, file } from '../../services/managerfiles';
import * as Location from 'expo-location';
import storage from "@react-native-firebase/storage"
import firestore from "@react-native-firebase/firestore"
import { handleError } from '../context/Auth';
import {useNavigation} from '@react-navigation/native'
import { AppStack } from '../routes/AppStack'

export default function Home() {

async function getLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Ative a permissão de localização nas configurações.');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Faz a conversão das coordenadas
    const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    const geo = reverseGeocode[0];

    // Monta endereço mais completo possível
    const endereco = [
      geo.name, // ex: número e nome da rua
      geo.street,
      geo.district,
      geo.subregion,
      geo.city,
      geo.region,
    ]
      .filter(Boolean) // remove null/undefined
      .join(", ");

    return {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      cidade: geo.city || geo.subregion || "Cidade não encontrada",
      uf: geo.region || "UF não encontrada",
      enderecoCompleto: endereco || "Endereço não encontrado",
    };
  } catch (error) {
    console.warn("Erro ao obter localização:", error);
    return null;
  }
}


  const navigation = useNavigation<AppStack>();
  //carregamento de dados pessoais
  const{user,usuario,visibleBar,setVisibleBar} = useUser();
  const [name, setName] = useState(usuario.nome || 'carregando...');
  const [imagem, setImagem] = useState(usuario.imagem||null);

  const [spiner, setSpiner] = useState(false);

  const maskFirtsName = (name:string)=>{
    if (name) {
      const primeiraParte = name.split(" ")[0].split(".")[0].toLowerCase();
      return primeiraParte.charAt(0).toUpperCase() + primeiraParte.slice(1);
    }

    else return name
  }
  
  useEffect(()=>{
    setName(usuario.nome)
    setImagem(usuario.imagem)
  },[usuario])

  //camera diretamente
  const handleCamera = async () => {
    setSpiner(true); // mostra o loading imediatamente

    try {
      const imageDados = await camera();

      // se o usuário cancelar, sai do loading
      if (!imageDados) {
        setSpiner(false);
        return;
      }

      const currentDate = new Date();
      const formattedDateTime = new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(currentDate);

      setPopupVisible(false);

      const location = await getLocation();
      if (!location) {
        setSpiner(false);
        return;
      }

      await handleStorage(
        imageDados,
        'imagem',
        '',
        formattedDateTime,
        location.latitude,
        location.longitude,
        location.cidade,
        location.uf,
        'camera'
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível capturar a imagem.');
      setSpiner(false);
    }
  };

  //galeria de imagens
  const handleGallery = async () => {
    setSpiner(true);

    try {
      const image = await fileImage();

      if (!image) {
        setSpiner(false);
        return;
      }

      setPopupVisible(false);

      const currentDate = new Date();
      const formattedDateTime = new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(currentDate);

      const location = await getLocation();
      if (!location) {
        setSpiner(false);
        return;
      }

      await handleStorage(
        image,
        'imagem',
        '',
        formattedDateTime,
        location.latitude,
        location.longitude,
        location.cidade,
        location.uf,
        'galeria'
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
      setSpiner(false);
    }
  };


  //galeria de documentos
  const handleFiles = async () => {
    setSpiner(true);

    try {
      setPopupVisible(false);
      const image = await file();

      if (!image) {
        setSpiner(false);
        return;
      }

      const currentDate = new Date();
      const formattedDateTime = new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(currentDate);

      const location = await getLocation();
      if (!location) {
        setSpiner(false);
        return;
      }

      await handleStorage(
        image.uri,
        'documento',
        image.name,
        formattedDateTime,
        location.latitude,
        location.longitude,
        location.cidade,
        location.uf
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível enviar o documento.');
      setSpiner(false);
    }
  };


  const openFolder = async (path:any) => {
    navigation.navigate(path)
  };



  //funcão de carregamento de imagem de camera:
  const handleStorage = async (image:any,type:string,name:string,time:any,latitude:any,longitude:any,cidade:string,uf:string,origem?: 'camera' | 'galeria' | 'documento' | string)=>{
    setSpiner(true)
    try{

      if(image){

        
        const regex = /\.([a-zA-Z0-9]+)$/;
        const match = image.match(regex);
        
        const extecao = match ? `.${match[1]}` : null;
        
        const filename = image.substring(image.lastIndexOf("/")+1)
        const filePath = image.replace('file://','')

        const newName = name ==="" ? filename : name;
        
        //configurando file
        const currentDate = new Date();
        const formattedDateTime = new Intl.DateTimeFormat('pt-BR', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
        }).format(currentDate);

        
        
        const fileDoc = {
          dataCriacao:time,
          cidade : cidade.toLocaleLowerCase(),
          dataCadastro : formattedDateTime,
          uid: user?.uid,
          type: type,
          url:'',
          extencao:extecao,
          nome: newName.toLocaleLowerCase(),
          geolocalizacao:{
            latitude:latitude,
            longitute:longitude
          },
          status:true,
          uf:uf.toLocaleLowerCase(),
          origem: origem || 'desconhecida',
          size: 0,
        }
        
        //subindo imagem
        if(filename && filePath){

          const storageRef = await storage().ref(`files/${user?.uid}/${filename}`)
          await storageRef.putFile(filePath);

          const downloadURL = await storageRef.getDownloadURL();
          fileDoc.url=downloadURL

          const metadata = await storageRef.getMetadata();
          fileDoc.size = metadata.size ? Number(metadata.size) : 0; // em bytes

        }else{
          setSpiner(false)
          return;
        }
        
        //sunbindo file
        const filesCollection = firestore().collection("files");
        await filesCollection.add(fileDoc);


        setSpiner(false)
        Alert.alert("Sucesso","Documento enviado!",
          [
            {
              text: 'Voltar',
              style: 'cancel',
            },
            {
              text: type === 'imagem'? 'Exibir imagens':'Exibir documentos',
              onPress: () => openFolder(type === 'imagem'? 'MeusArquivosImagens':'MeusArquivosDocumentos'),
            },
          ],
          { cancelable: true })
      
      }
    }catch(error){
      console.error(error)
      setSpiner(false)
      handleError(error)

    }
    setSpiner(false)
  }
  

  //barra de opções
  // const [visibleBar, setvisibleBar] = useState(false);
  const toggleVisibleBar = () => {
    setVisibleBar(!visibleBar);
  };
  
  
  //popup de carregamento de arquivos
  const [popupVisible, setPopupVisible] = useState(false);
  const toggleisPopupVisible = (value: boolean) => {
    setPopupVisible(value);
  };

  
  const insets = useSafeAreaInsets();
  const headerHeight = 68 + insets.top;
  return (

    <LinearGradient colors={["#F7FAFC","#8bc4fd"]} style = {styles.container} >
      <View style = {styles.container}>
        <View style={[styles.header, {height: headerHeight }]}>
          <HeaderM3 title = {`Olá, ${maskFirtsName(name)}`} press = {toggleVisibleBar} imagem = {imagem}/>
          {visibleBar && <Bar/>}
        </View>

        <View style = {styles.body}>

          <View style = {styles.containerVideo}>
            <ButtonComponentCircle 
            imagePath={Plus} 
            text = {"Carregar"} 
            onPress={() => toggleisPopupVisible(true)}
            />
            <ButtonComponentCircle 
            imagePath={Camera} 
            text = {"Camera"} 
            onPress={()=>handleCamera()} 
            />
          </View>
          <CardM1 
          imagePath={Folder} 
          text = {"Meus Arquivos"} 
          page = {"MeusArquivos"}/>
          <CardM1 
          imagePath={Paper} 
          text = {"Histórico"} 
          page = {"Relatorios"}/>
        </View>
      </View>



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

      <Modal
        transparent
        visible={popupVisible}
        animationType="fade"
        onRequestClose={() => toggleisPopupVisible(false)}
      >
        <TouchableOpacity
          style={styles.popupmodal} 
          activeOpacity={1} 
          onPressOut={() => toggleisPopupVisible(false)}
        >
          <View style={styles.popupcontainer}>
            <Popupcarregar 
            gallery = {
              handleGallery
              // ()=>{}
            } 
            files = {
              handleFiles
              // ()=>{}
              } /> 
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex :1,
    flexDirection: 'column',
    alignItems: 'center',
    width : '100%',
    height : '100%',
    justifyContent : 'space-between',
    gap :150   
  },

  header:{
    width : '100%',
    // height : 68,
  },

  body : {
    flexDirection : 'column',
    width : '100%',
    justifyContent : 'flex-start',
    gap: 20,
    paddingHorizontal : 24,
    bottom : '10%'
  },

  containerVideo:{
    flexDirection : 'row',
    width : '100%',
    paddingHorizontal : 10,
    height : 150,
    alignItems : 'center',
    justifyContent : 'space-around',
    gap : 20,
  },
  popupmodal: {
    flex: 1,
    backgroundColor: '#0000007f',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  popupcontainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});



