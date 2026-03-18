import { StyleSheet,  View, TouchableOpacity, Text, Modal, Image, FlatList, ActivityIndicator, Button, TextInput, Pressable, Alert, BackHandler } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { HeaderM2 } from '../components/HeaderM2';
import { LinearGradient } from 'expo-linear-gradient';

import { CardM5 } from '../components/CardM5';
import { SetStateAction, useEffect, useState } from 'react';
import { ButtonComponentCircleM2 } from '../components/ButtonComponentCircleM2';

import relatorio from "../assets/images/relatorio.png"
import Vector_filter from "../assets/images/Vector_filter.png"
import calendar from "../assets/images/calendar.png"
import iconamoon_arrow from "../assets/images/iconamoon_arrow.png"

import firestore from "@react-native-firebase/firestore"


import heroicons_solid_download from "../assets/images/heroicons_solid_download.png"
import mdi_share from "../assets/images/mdi_share.png"



import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {  SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native'
import { AppStack } from '../routes/AppStack'
import { Bar } from '../components/Bar';
import { fileDoc, handleError, records, useUser } from '../context/Auth';
import { downloadFile, downloadFileTemporarioFile, downloadImage, file, shareFile } from '../../services/managerfiles';

import { Dropdown } from "react-native-element-dropdown";

import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NotFoundFile } from '../components/NotFoundFile';

import Doc from "../assets/images/Doc.png";
import PdfImage from "../assets/images/Pdf.png";
import xls from "../assets/images/xls.png";
import txt from "../assets/images/txt.png";
import ppt from "../assets/images/ppt.png";
import { CardM4 } from '../components/CardM4';

import doctypes from "../components/docTypes.json";
import { CardM41 } from '../components/CardM4.1';
import Pdf from 'react-native-pdf';

import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'react-native-blob-util';

import { MarcaDaguaCaptura } from '../components/MarcaDaguaCaptura';
import * as MediaLibrary from 'expo-media-library';
import { useRef } from 'react';
import React from 'react';


export default function Relatorios() {
  const navigation = useNavigation<AppStack>();
  const{user,usuario,visibleBar,setVisibleBar} = useUser();

  const [files, setFiles] = useState<fileDoc[]>([]);
  const [originalFiles, setOriginalFiles] = useState<fileDoc[]>([]);
  const [filesOk, setFilesOk] = useState(false);
  const [reports, setReports] = useState<records[]>([]);

  const [loadVisible, setloadVisible] = useState(false);
  
  const [notFoundFile, setNotFoundFile] = useState(false);
  const [spiner, setSpiner] = useState(false);

  const [showOrder, setShowOrder] = useState(false);
  const [show, setShow] = useState(false);
  const [showTipo, setShowTipo] = useState(false);
  
  const [order, setOrder] = useState("");

  const [filterType, setFilterType] = useState("");
  const [showMin, setShowMin] = useState(false);
  const [showMax, setShowMax] = useState(false);
  const [filterDataMin, setFilterDataMin] = useState("");
  const [filterDataMax, setFilterDataMax] = useState("");
  const [alertData1, setAlertData1] = useState(false);
  const [alertData2, setAlertData2] = useState(false);
  const [ultimaData, setUltimaData] = useState("");
  const [nextFilterDataMin, setNextFilterDataMin] = useState("");
  const [nextFilterDataMax, setNextFilterDataMax] = useState("");

  const [showImagemGreat, setShowImagemGreat] = useState(false); 
  const [showImagemItem, setShowImagemItem] = useState<fileDoc[]>([]);
  const [showImagemSelecionada, setShowImagemSelecionada] = useState(false); 
  const [showImagemItemSelecionada, setShowImagemItemSelecionada] = useState("");

  const marcaDaguaRef = useRef<any>(null);
  const [showImagemOrigem, setShowImagemOrigem] = useState<string | null>(null);
  const [showImagemLocalizacao, setShowImagemLocalizacao] = useState<string | null>(null);
  const [showImagemLatitude, setShowImagemLatitude] = useState<string | null>(null);
  const [showImagemLongitude, setShowImagemLongitude] = useState<string | null>(null);
  const [showImagemDataEnvio, setShowImagemDataEnvio] = useState<string | null>(null);

  const closeModal = () => {
    setShowDocumentoGreat(false);
    setShowDocumentoItem({ url: "", type: "", name: "" });
  };

  // const [visibleBar, setvisibleBar] = useState(false);
  
  const toggleVisibleBar = () => {
    setVisibleBar(!visibleBar);
  };

  useEffect(()=>{if(show) setShowOrder(false),setShowTipo(false)},[show])
  useEffect(()=>{if(showOrder) setShow(false),setShowTipo(false)},[showOrder])
  useEffect(()=>{if(showTipo) setShow(false),setShowOrder(false)},[showTipo])

    const hadleDowload2 = async (item: string) => {
      setloadVisible(true);
      try {
        if (showImagemOrigem === 'camera' && marcaDaguaRef.current) {
          const uri = await marcaDaguaRef.current.capturarImagem();
          if (uri) await MediaLibrary.saveToLibraryAsync(uri);
        } else if (item) {
          await downloadImage([item]);
        }
      } finally {
        setloadVisible(false);
      }
    };

    const handleShareFile2 = async (item: string) => {
      if (showImagemOrigem === 'camera' && marcaDaguaRef.current) {
        const uri = await marcaDaguaRef.current.capturarImagem();
        if (uri) await shareFile(uri);
      } else if (item) {
        const uri = await downloadFileTemporarioFile(item);
        if (uri) await shareFile(uri);
      }
    };

    const hadleDowload3 = async (url:string,name:string) => {
      setloadVisible(true);
      if (url) await downloadFile([[url,name]]);
      setloadVisible(false);
    };

    const handleShareFile3 = async (url:string) => {
      if (url) {
        const uri = await downloadFileTemporarioFile(url);
        if (uri) await shareFile(uri);
      }
    };

  const getFileExtension = (url: string): string => {
    const match = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
    return match ? match[1] : "";
  };

  const getFilePath = (extension: string): string => {
    if (extension in doctypes) {
      return doctypes[extension as keyof typeof doctypes];
    }
    return "";
  };

  const image = (url: string) => {
    if (getFilePath(getFileExtension(url)) == "pdf") return PdfImage;
    if (getFilePath(getFileExtension(url)) == "ppt") return ppt;
    if (getFilePath(getFileExtension(url)) == "txt") return txt;
    if (getFilePath(getFileExtension(url)) == "xls") return xls;
    if (getFilePath(getFileExtension(url)) == "doc") return Doc;
  };

  //lista de imagens
  const fetchRegisters = async () => {
    setSpiner(true)
    try {
      const filesCollection  = firestore().collection('files')
      let query = filesCollection
        .where('uid', '==', user?.uid)
        .where('status', '==', true)
        .orderBy('dataCadastro', 'desc');
      if(filterType !== "") query = query.where('type', '==', filterType);

      const snapshot = await query.get();

      if (!snapshot.empty) {
        const fileData = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<fileDoc, 'id'>
          const formattedDataCadastro = data.dataCadastro.split(' ')[0];
          const formattedDataCriacao = data.dataCriacao.split(' ')[0];
          return {
              id: doc.id,
              ...data,
              dataCadastro: formattedDataCadastro,
              dataCriacao: formattedDataCriacao
            }
          }
        )
        // for (let i in fileData) console.log(i,"-",fileData[i])
        setOriginalFiles(fileData); 
        if((filterDataMin||filterDataMax)&&!alertData2&&!alertData1) await filterData(fileData,filterDataMin,filterDataMax)
        else {
          setFiles(fileData); 
          setFilesOk(true)
        }
      }else{
        setFiles([]);
      }
    }catch(error){
      console.error('Erro ao buscar registros:', error);
      return [];
    }
  } 
  

const parseDateBR = (dateStr: string) => {
  if (!dateStr) return null;

  const cleanDate = dateStr.split(',')[0].trim();

  const parts = cleanDate.split('/');
  if (parts.length !== 3) return null;

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);

  const date = new Date(year, month - 1, day);

  return isNaN(date.getTime()) ? null : date;
};

const parseDateBREnd = (dateStr: string) => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day, 23, 59, 59);
};

const filterData = async (filesnew: fileDoc[], dmin: string, dmax: string) => {
  setSpiner(true);

  let newFiles = filesnew;

  const minDate = dmin ? parseDateBR(dmin) : null;
  const maxDate = dmax ? parseDateBR(dmax) : null;

  newFiles = newFiles.filter((elemento) => {

    const fileDate = parseDateBR(elemento.dataCriacao);
    if (!fileDate) return false;

    if (minDate && fileDate < minDate) return false;
    if (maxDate && fileDate > maxDate) return false;

    return true;
  });

  setNotFoundFile(newFiles.length === 0);

  setFiles(newFiles);
  setFilesOk(true);
};

  const handleFilterApply=(dmin:string,dmax:string)=>{
    filterData(originalFiles,dmin,dmax)
  }




  useEffect(()=>{ 
    fetchRegisters() 
  },[filterType])
  // useEffect(()=>{ 
  //   fetchRegisters() 
  // },[])


  useEffect(()=>{ 
    if(nextFilterDataMax && nextFilterDataMin){
      const desigual = nextFilterDataMin.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1") > nextFilterDataMax.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
      if(ultimaData == 'dataMin' && desigual) setAlertData1(true),setAlertData2(false)
      else if(ultimaData == 'dataMax' && desigual) setAlertData2(true),setAlertData1(false)
      else{setAlertData2(false),setAlertData1(false)}
    }
  },[nextFilterDataMax,nextFilterDataMin])

  useEffect(()=>{
    if(alertData1)setNextFilterDataMin("")
    if(alertData2)setNextFilterDataMax("")
  },[alertData1,alertData2])

  const handleFiltertype = ((value:string)=>{ 
    if(filterType == value) setFilterType("")
    else setFilterType(value)
  })
  


useEffect(()=>{
  if(filesOk){
    const groupedFiles = Object.values(
      files.reduce((acc, file) => { 
        const key = `${file.dataCriacao}-${file.dataCadastro}-${file.type}-${file.cidade}`;

        if (!acc[key]) {
          acc[key] = {
            id: key,
            dataCadastro: file.dataCadastro,
            dataCriacao: file.dataCriacao,
            type: file.type,
            cidade: file.cidade,
            quantidade: 0,
            itens: [],
            uf: file.uf,
            timestamp: (() => {
              const dateStr = file.dataCriacao.split(',')[0].trim();
              const timeStr = file.dataCriacao.split(',')[1]?.trim() || "00:00:00";

              const [day, month, year] = dateStr.split('/');
              const [hour, minute, second] = timeStr.split(':');

              return new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
                Number(hour),
                Number(minute),
                Number(second)
              ).getTime();
            })()
          };
        }

        acc[key].quantidade += 1;
        acc[key].itens.push(file);
        return acc;
      }, {} as Record<string, records>)
    );

    groupedFiles.sort((a,b) =>
      order === 'asc'
        ? a.timestamp - b.timestamp
        : b.timestamp - a.timestamp
    );

    setReports(groupedFiles);
    setSpiner(false);
  }
}, [filesOk, files, order]);


  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho','julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  const parseDate = (date:string)=> {
    const [day, month, year] = date.split('/');
    return {day:day,month:meses[parseInt(month)-1],year:year}
  } 

  useEffect(()=>{
    if(showImagemItem.length>0) setShowImagemGreat(true)
  },[showImagemItem])


  


  const insets = useSafeAreaInsets();
  const headerHeight = 68 + insets.top;


  const [showDocumentoGreat, setShowDocumentoGreat] = useState(false); 
  const [showDocumentoItem, setShowDocumentoItem] = useState<{url:string,type:string,name:string}>();
  
  const openDocument = async (file:string,type:string) => {
      const fileUrl = file
      const fileExt = type
      const localFile = `${RNFetchBlob.fs.dirs.DocumentDir}/documento.${fileExt}`;
    
      try {
        const res = await RNFetchBlob.config({ path: localFile }).fetch('GET', fileUrl);
        await FileViewer.open(res.path());
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível abrir o documento.');
      }
    };
  const handleShowDocument=(file:string,type:string,name:string)=>{
    if( type == ".pdf") {
      // setShowImagemGreat(false)
      setShowDocumentoItem({url:file,type:type,name:name})
    }
    else{
      openDocument(file,type)
    }
  }

  useEffect(()=>{
    if(showDocumentoItem?.url) setShowDocumentoGreat(true)
  },[showDocumentoItem])

  useFocusEffect(
    useCallback(() => {

      const onBackPress = () => {

        if (showImagemSelecionada) {
          setShowImagemSelecionada(false)
          return true
        }

        if (showDocumentoGreat) {
          closeModal()
          return true
        }

        if (showImagemGreat) {
          setShowImagemGreat(false)
          setShowImagemItem([])
          return true
        }

        return false
      }

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      )

      return () => subscription.remove()

    }, [
      showImagemSelecionada,
      showDocumentoGreat,
      showImagemGreat
    ])
  )


  return (
    <LinearGradient colors={["#F7FAFC","#8BC4FD"]} style = {styles.container}>
      
      <View style = {styles.container}>

        <View style={[styles.header, {height: headerHeight }]}>
          <HeaderM2 title = {"Relatorios"} navigation={navigation} press = {toggleVisibleBar}/>
          {visibleBar && <Bar/>}
        </View>

        <View style = {styles.body}>
          <View style = {styles.filtercontainer}>
            <View style = {styles.vectorfilter}>
              <TouchableOpacity style={{width:50,height:30,alignItems:'center',justifyContent:'center',flexDirection:'row'}} onPress={()=>{setShowOrder(!showOrder)}}>
                <View style={styles.imagevectorfilter}>
                  <View style={styles.imagevectorfilter2}></View>
                  <View style={styles.imagevectorfilter3}></View>
                  <View style={styles.imagevectorfilter4}></View>
                </View>
              </TouchableOpacity>
              {showOrder&&(
                <View style={styles.boxOrder}>
                  <TouchableOpacity style = {styles.filterOrder} onPress={()=>{setShowOrder(false),setOrder("asc")}}>
                    <Text style={styles.textButtonOrder} allowFontScaling={false}>Ordenar por Data Crescente</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style = {styles.filterOrder} onPress={()=>{setShowOrder(false),setOrder("desc")}}>
                    <Text style={styles.textButtonOrder} allowFontScaling={false}>Ordenar por Data Decrescente</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>




            <View style = {styles.containerfilters}>
              <TouchableOpacity style = {styles.filterdata} onPress={()=>{
                  setNextFilterDataMin(filterDataMin)
                  setNextFilterDataMax(filterDataMax)
                  setShow(!show)
                }}>
                <Text style={styles.textButton} allowFontScaling={false}>{'Data'}</Text>
                <Image
                  source={calendar}
                  style={styles.imagevectorfilter1}
                />
              </TouchableOpacity>
                
              {show && (

                <View style={styles.boxData}>

                  <View style={styles.boxDataFilter}>
                    <TouchableOpacity style={!alertData1?styles.inputLikeButton:styles.inputLikeButtonAlert} onPress={() => setShowMin(true)}>
                      <Text allowFontScaling={false} style={nextFilterDataMin ? styles.textSelected : styles.placeholder}>
                        {nextFilterDataMin ? nextFilterDataMin : 'Data Mínima'}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.barr}></View>

                    <TouchableOpacity style={!alertData2?styles.inputLikeButton:styles.inputLikeButtonAlert} onPress={() => setShowMax(true)}>
                      <Text allowFontScaling={false} style={nextFilterDataMax ? styles.textSelected : styles.placeholder}>
                        {nextFilterDataMax ? nextFilterDataMax : 'Data Máxima'}
                      </Text>
                    </TouchableOpacity>

                  </View>

                  { alertData1?
                    <View style={styles.msgAlert}><Text allowFontScaling={false} style={{color:"#ff0000",fontWeight:"600"}}>Data selecionada maior que data máxima!</Text></View>
                  :alertData2?
                    <View style={styles.msgAlert}><Text allowFontScaling={false} style={{color:"#ff0000",fontWeight:"600"}}>Data selecionada menor que data mínima!</Text></View>
                  :null
                  }

                  <View style={styles.filterDataBottonsSends}>

                    <TouchableOpacity style={styles.btnVoltar} onPress={()=>{setShow(false),setAlertData1(false),setAlertData2(false),handleFilterApply(filterDataMin,filterDataMax)}}>
                      <Text allowFontScaling={false} style={{color: '#807979',fontWeight:'500', width:"100%", textAlign:"center",fontSize:20}}>Voltar</Text>
                    </TouchableOpacity>

                    {(nextFilterDataMin||nextFilterDataMax)&&(
                      <TouchableOpacity style={styles.btnLimpar} onPress={()=>{setNextFilterDataMin(""),setNextFilterDataMax(""),setAlertData1(false),setAlertData2(false)}}>
                        <Text allowFontScaling={false} style={{color:"#ffffff",fontWeight:'500', width:"100%", textAlign:"center",fontSize:20}}>Limpar</Text>
                      </TouchableOpacity>
                    )}
                    
                    {((alertData1||alertData2 || (nextFilterDataMin==""&&nextFilterDataMax==""))&&filterDataMin==""&&filterDataMax=="")?
                      <TouchableOpacity style={styles.btnAplicarDesable} disabled={true}>
                        <Text allowFontScaling={false} style={{color:"#ffffff",fontWeight:'500', width:"100%", textAlign:"center",fontSize:20}}>Aplicar</Text>
                      </TouchableOpacity>
                    :
                      <TouchableOpacity style={styles.btnAplicar} onPress={()=>{
                        setFilterDataMin(nextFilterDataMin)
                        setFilterDataMax(nextFilterDataMax)
                        setAlertData1(false)
                        setAlertData2(false)
                        handleFilterApply(nextFilterDataMin,nextFilterDataMax)
                        setShow(false)
                      }}>
                        <Text allowFontScaling={false} style={{color:"#ffffff",fontWeight:'500', width:"100%", textAlign:"center",fontSize:20}}>Aplicar</Text>
                      </TouchableOpacity>}

                  </View>



                  {showMin && (<DateTimePicker
                    value={nextFilterDataMin!=""?new Date(nextFilterDataMin.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")):new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowMin(false);
                      if (selectedDate) {
                        setUltimaData("dataMin")
                        const formattedDate = new Intl.DateTimeFormat('pt-BR').format(selectedDate);
                        setNextFilterDataMin(formattedDate);
                      }
                    }}
                  />)}
                  {showMax && (<DateTimePicker
                    value={nextFilterDataMax!=""?new Date(nextFilterDataMax.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")):new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowMax(false);
                      if (selectedDate) {
                        setUltimaData("dataMax")
                        const formattedDate = new Intl.DateTimeFormat('pt-BR').format(selectedDate);
                        setNextFilterDataMax(formattedDate);
                      }
                    }}
                  />)}
                </View>

              )}



              <TouchableOpacity style = {styles.filtertype} onPress={()=>{setShowTipo(!showTipo)}}>
                <Text allowFontScaling={false} style={styles.textButton}>{filterType?filterType=="imagem"?"Imagens":"Documentos":'Tipo'}</Text>
                <Image
                  source={iconamoon_arrow}
                  style={styles.iconStyle}
                />
              </TouchableOpacity>
              {showTipo&&(
                <View style={styles.boxTipo}>
                  <TouchableOpacity style = {styles.filterOrder} onPress={()=>{ handleFiltertype("documento"),setShowTipo(false)}}>
                    <Text allowFontScaling={false} style={styles.textButtonOrder}>Documentos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style = {styles.filterOrder} onPress={()=>{ handleFiltertype("imagem"),setShowTipo(false)}}>
                    <Text allowFontScaling={false} style={styles.textButtonOrder}>Imagens</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>


          <View style = {styles.containerList}>
            {spiner?<ActivityIndicator size="large" />:            
            files.length==0?<NotFoundFile value="Nenhum dado disponível para os filtros selecionados!" />:
            <FlatList 
              contentContainerStyle ={styles.containerCards}
              data = {reports}
              keyExtractor={(item)=>item.id}
              renderItem={({item})=>(
                <CardM5 
                  imagePath={item.type == 'documento' ? relatorio : item.itens[0].url}
                  text1 = {`Enviado em ${parseDate(item.dataCadastro).day} de ${parseDate(item.dataCadastro).month} de ${parseDate(item.dataCadastro).year}`} 
                  text2 = {item.type=="imagem"?"imagens":"documentos"}
                  text3 = {`${item.cidade.charAt(0).toUpperCase() + item.cidade.slice(1).toLowerCase()}, ${item.uf.toUpperCase()}`}
                  text4 = {`criado em ${parseDate(item.dataCriacao).day} de ${parseDate(item.dataCriacao).month} de ${parseDate(item.dataCriacao).year}`}
                  text5 = {`${item.quantidade} ${item.quantidade > 1?"itens":"item"}`}
                  onPress={() => {
                    console.log("TIPO DO GRUPO:", item.type)
                    console.log("PRIMEIRO ITEM:", item.itens[0])
                    console.log("TYPE DO ITEM:", item.itens[0]?.type)
                    setShowImagemItem(item.itens);setShowImagemGreat(true)}}
                />
              )}
            />}
          </View>

        </View>

        {/* Modal de imagens */}
        <Modal
          transparent
          visible={showImagemGreat}
          animationType="fade"
          onRequestClose={() => {
            setShowImagemGreat(false);
            setShowImagemItem([]);
          }}
        >
          <View style={styles.modal2}>

            {/* BOTÃO FECHAR */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 40,
                right: 20,
                zIndex: 20,
                backgroundColor: "#fff",
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                elevation: 6
              }}
              onPress={() => {
                setShowImagemGreat(false);
                setShowImagemItem([]);
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>✕</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
              {showImagemItem.length > 0 && showImagemItem[0].type === "documento" ? (
                <View style={{ backgroundColor: "#ffffff", flex: 1, paddingTop: 30 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 22,
                      color: "#146cc4ec",
                      marginLeft: 10,
                      marginBottom: 20
                    }}
                  >
                    Documentos Enviados
                  </Text>

                  <FlatList
                    contentContainerStyle={styles.containerCards}
                    data={showImagemItem}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <CardM41
                        imagePath={item.url}
                        name={item.nome}
                        extecao={image(item.url)}
                        text1={item.nome}
                        text2={`${item.cidade.charAt(0).toUpperCase() + item.cidade.slice(1).toLowerCase()}, ${item.uf.toUpperCase()}`}
                        text3={item.dataCadastro.split(" ")[0]}
                        text4={`criado em ${item.dataCriacao}`}
                        selecting={false}
                        view={(it) => handleShowDocument(it, item.extencao, item.nome)}
                        action={() => {}}
                      />
                    )}
                  />
                </View>
              ) : (
                <FlatList
                  contentContainerStyle={styles.containerCards}
                  data={showImagemItem}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setShowImagemItemSelecionada(item.url);
                        setShowImagemDataEnvio(item.dataCadastro || null);
                        setShowImagemLocalizacao(`${item.cidade}, ${item.uf}`);
                        setShowImagemLatitude(item.geolocalizacao?.latitude || null);
                        setShowImagemLongitude(item.geolocalizacao?.longitute || null);
                        setShowImagemOrigem(item.origem || null);
                        setShowImagemSelecionada(true);
                      }}
                    >
                      <Image
                        source={{ uri: item.url }}
                        style={{ width: "100%", height: 400 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </Modal>


        {/* Modal de exibição de PDFs*/}
        <Modal
          transparent
          visible={showDocumentoGreat}
          animationType="fade"
          statusBarTranslucent
          onRequestClose={closeModal}
        >

          <View style={styles.modalOverlay}>

            {/* BOTÃO FECHAR */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 40,
                right: 20,
                zIndex: 20,
                backgroundColor: "#fff",
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                elevation: 6
              }}
              onPress={closeModal}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>✕</Text>
            </TouchableOpacity>

            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >

              {showDocumentoItem?.type === ".pdf" && (
                <Pdf
                  trustAllCerts={false}
                  source={{
                    uri: showDocumentoItem.url,
                    cache: true,
                    headers: { "User-Agent": "Mozilla/5.0" }
                  }}
                  style={styles.pdf}
                />
              )}

              <View style={styles.containerButtonsActions2}>
                <ButtonComponentCircleM2
                  imagePath={mdi_share}
                  onPress={() =>
                    handleShareFile3(showDocumentoItem?.url ?? "")
                  }
                />

                <ButtonComponentCircleM2
                  imagePath={heroicons_solid_download}
                  onPress={() =>
                    showDocumentoItem &&
                    hadleDowload3(
                      showDocumentoItem.url,
                      showDocumentoItem.name
                    )
                  }
                />
              </View>

            </Pressable>
          </View>
        </Modal>

        {/* Modal de imagem ampliada*/}
        <Modal
          transparent
          visible={showImagemSelecionada}
          animationType="fade"
          onRequestClose={() => {
            setShowImagemSelecionada(false);
            setShowImagemItemSelecionada("");
          }}
        >
          <View style={styles.modal3}>

            {/* BOTÃO FECHAR */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 50,
                right: 20,
                zIndex: 20,
                backgroundColor: "#fff",
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                elevation: 6
              }}
              onPress={() => {
                setShowImagemSelecionada(false);
                setShowImagemItemSelecionada("");
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>✕</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

              {showImagemOrigem === "camera" ? (
                <MarcaDaguaCaptura
                  ref={marcaDaguaRef}
                  uriImagem={showImagemItemSelecionada}
                  dataEnvio={showImagemDataEnvio || ""}
                  localizacao={showImagemLocalizacao || ""}
                  latitude={showImagemLatitude || ""}
                  longitude={showImagemLongitude || ""}
                />
              ) : (
                <Image
                  source={{ uri: showImagemItemSelecionada }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}

              <View style={styles.containerButtonsActions2}>
                <ButtonComponentCircleM2
                  imagePath={mdi_share}
                  onPress={() => handleShareFile2(showImagemItemSelecionada)}
                />
                <ButtonComponentCircleM2
                  imagePath={heroicons_solid_download}
                  onPress={() => hadleDowload2(showImagemItemSelecionada)}
                />
              </View>

            </View>
          </View>
        </Modal>

        {/* Load */}
        <Modal transparent visible={loadVisible} animationType="fade">
          <View style={styles.modal2}>
            <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
              <ActivityIndicator size="large" color={Colors.primary}/>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  modal2: {
    flex: 1,
    backgroundColor: '#ffffffec',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding : 15
  },
  modal3: {
    flex: 1,
    backgroundColor: '#ffffffec',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding : 15,
    zIndex:99999
  },
  image:{
    height : "100%",
    width : "100%",
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    width : '100%',
    height : '100%',
    justifyContent : 'flex-start',  
    paddingBottom:10,    
  },

  header:{
    width : '100%',
    // height : 68
  },

  body : {
    flexDirection : 'column',
    width : '100%',
    justifyContent : 'flex-start',
    top : 16,
    gap : 10,
    flex:1
  },

  filtercontainer:{
    height: 30,
    width : '100%',
    paddingHorizontal : 10,
    position:'relative',
    // gap : 30,
    flexDirection : 'row',
    // backgroundColor:"#00ff00",
    justifyContent:'space-between'
  },
  vectorfilter:{
    height : '100%',
    width : "10%",
    alignItems : 'center',
    justifyContent : 'center',
    // backgroundColor:"#000000",
  },
  containerfilters:{
    width : '85%',
    height : 30,
    flexDirection : 'row',
    // backgroundColor:"#ad0a0a",
  },

  imagevectorfilter:{ 
    width : 45.5,
    height : 30,
    flexDirection:'column',
    justifyContent:'space-around',
    // alignContent:'center',
    alignItems:'center',
    // backgroundColor:"#b60000"
  },

  imagevectorfilter2:{
    width:"90%",
    height:5,
    backgroundColor:"#9c9c9c",
    borderRadius:2.5,
  },
  imagevectorfilter3:{
    width:"75%",
    height:5,
    backgroundColor:"#9c9c9c",
    borderRadius:2.5,
  },
  imagevectorfilter4:{
    width:"60%",
    height:5,
    backgroundColor:"#9c9c9c",
    borderRadius:2.5,
  },

  
  filterdata : {
    width : '40%',
    height : 30,
    backgroundColor : '#0000001A',
    flexDirection : 'row',
    gap : 10,
    paddingHorizontal : 9,
    alignItems : 'center',
    justifyContent : 'space-between',
    borderTopLeftRadius : 5,
    borderBottomLeftRadius : 5,
    borderColor : '#0000004D',
    borderLeftWidth : 0.5,
    borderTopWidth : 0.5,
    borderBottomWidth : 0.5,
  },
  filterOrder : {
    width : '100%',
    height : 30,
    backgroundColor : '#0000001A',
    flexDirection : 'row',
    // gap : 10,
    paddingHorizontal : 5,
    alignItems : 'center',
    justifyContent : 'flex-start',
    // borderRadius : 5,
    // borderColor : '#0000004D',
    // borderWidth : 0.5,
  },

  filterDataBottonsSends:{
    width:'100%',
    // height:80,
    flexDirection:"row",
    justifyContent:'space-between',
    alignContent:'center',
    paddingHorizontal:10,
    paddingBottom:10,
    // backgroundColor:"#ff0000",
    alignItems:"center",
    gap:10
  },

  btnVoltar:{
    backgroundColor:"#c5c7c5d3", 
    paddingVertical:5, 
    paddingHorizontal:10,
    borderRadius:5,
    width:"30%",
  },

  btnLimpar:{
    backgroundColor:"#9e630cd3", 
    paddingVertical:5, 
    paddingHorizontal:10,
    borderRadius:5,
    width:"30%",
  },
  btnAplicar:{
    backgroundColor:"#04bf10d4", 
    paddingVertical:5, 
    paddingHorizontal:10,
    borderRadius:5,
    width:"30%",
  },
  btnAplicarDesable:{
    backgroundColor:"#04bf103b", 
    paddingVertical:5, 
    paddingHorizontal:10,
    borderRadius:5,
    width:"30%",
  },

  boxData: {
    position: 'absolute', 
    top: 40,             
    left: "-15%",    
    width: "115%",
    flexDirection: 'column',
    justifyContent: 'center',
    // paddingHorizontal: 20,
    // paddingVertical: 20,
    backgroundColor: '#ffffff',
    zIndex: 99999999,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    borderColor : '#0000004D',
    borderWidth : 0.5,
    // alignItems:'center'
  },
  boxOrder: {
    position: 'absolute', 
    top: 40,             
    left: 0,    
    width: 350,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 2,
    backgroundColor: '#ffffff',
    zIndex: 99999,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    borderColor : '#0000004D',
    borderWidth : 0.5,
    // alignItems:'center'
    gap:2
  },
  boxTipo: {
    position: 'absolute', 
    top: 40,             
    left: "40%",    
    width: "60%",
    // height:100,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
    paddingVertical: 2,
    backgroundColor: '#ffffff',
    zIndex: 99999,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    borderColor : '#0000004D',
    borderWidth : 0.5,
    // alignItems:'center'
    gap:2
  },

  boxDataFilter: {
    // position: 'absolute', 
    // top: 25,             
    // left: "-10%",    
    width: "100%",
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems:'center'
  },


  barr:{
    width:"10%",
    height:2,
    backgroundColor:"#0000004D",
    borderRadius:1
  },

  inputLikeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    width:"42%",
    height:"100%"
  },
  inputLikeButtonAlert: {
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 5,
    padding: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    width:"42%",
    height:"100%"
  },



  textSelected: {
    fontSize: 20,
    color: '#625c5c',
    textAlign:"center",
    fontWeight:'600',
  },
  placeholder: {
    fontSize: 20,
    color: '#978c6d8d',
    textAlign:"center",
    fontWeight:'600',
  },

  msgAlert:{
    paddingHorizontal:20,
    // paddingBottom:20,
    top:-10,
  },
  
  filtertype : {
    width : '60%',
    height : 30,
    backgroundColor : '#0000001A',
    flexDirection : 'row',
    gap : 10,
    paddingHorizontal : 9,
    alignItems : 'center',
    justifyContent : 'space-between',
    borderTopRightRadius : 5,
    borderBottomRightRadius : 5,
    borderColor : '#0000004D',
    borderRightWidth : 0.5,
    borderTopWidth : 0.5,
    borderBottomWidth : 0.5,
    borderLeftWidth : 0.5,
  },

  placeholderStyle: {
    fontSize: 22,
    color: '#807979',
    fontWeight:'500',
    lineHeight: 30,
    textAlign: 'left',
    height: 30,
  },
  selectedTextStyle: {
    fontSize: 22,
    color: '#807979',
    fontWeight:'500',
    lineHeight: 30,
    textAlign: 'left',
    height: 30,

  },
  iconStyle: {
    width: 30,
    height: 30,
  },

  dropdownItem: {
    padding: 10,
    backgroundColor: '#9690901a', // Cor de fundo personalizada
    height:50,
    alignItems:"center",
    alignContent:'flex-start',
    justifyContent:'flex-start'
  },
  dropdownItemSelected: {
    padding: 10,
    backgroundColor: '#0000001a', // Cor de fundo personalizada
    height:50,
    alignItems:"center",
    alignContent:'flex-start',
    justifyContent:'flex-start',
    borderColor:'#ffffff1a',
    borderWidth:2
  },
  
  dropdownItemText: {
    width:'100%',
    fontSize: 24,
    color: '#807979',
    fontWeight:'500',
    lineHeight: 30,
    textAlign: 'left',
    height: 30,
  },


  textButton:{
    color: '#807979',
    fontSize: 22,
    // fontFamily: 'Poppins',
    fontWeight: '500',
    lineHeight: 30,
    textAlign: 'right',
    height: 30,
  },

  textButtonOrder:{
    color: '#807979',
    fontSize: 20,
    // fontFamily: 'Poppins',
    fontWeight: '500',
    lineHeight: 30,
    textAlign: 'right',
    height: 30,
  },

  imagevectorfilter1:{
    width : 20,
    height : 20
  },

  containerList:{
    width : '100%',
    flexDirection : 'column',
    justifyContent : 'flex-start',
    paddingBottom:20,
    flex:1,
    zIndex:1
  },




  containerCards:{
    width : '100%',
    flexDirection : 'column',
    paddingHorizontal:10,
    gap:5
  },
  containerButtonsActions :{
    position : 'absolute',
    width : 75,
    height :173,
    bottom : 50,
    gap : 23,
    right : 24,
    flexDirection:'column',
    justifyContent: 'flex-end'
  },
  modal:{
    width : '100%',
    height : "100%"
  },
  containerButtonsActions2 :{
    position : 'absolute',
    width : 75,
    // height :200,
    bottom : 30,
    gap : 23,
    right : 24,
    flexDirection:'row',
    justifyContent: 'flex-end',
    zIndex: 99999,
    // backgroundColor:"#d80606"
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
},

modalContent: {
  width: "90%",
  height: "80%",
  backgroundColor: "#fff",
  borderRadius: 12,
  overflow: "hidden",
},

pdf: {
  flex: 1,
  width: "100%",
},
});
