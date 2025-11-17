import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { HeaderM2 } from "../components/HeaderM2";
import { LinearGradient } from "expo-linear-gradient";
import { CardM4 } from "../components/CardM4";
import { SetStateAction, useEffect, useState } from "react";
import { ButtonComponentCircleM2 } from "../components/ButtonComponentCircleM2";
import Doc from "../assets/images/Doc.png";
import PdfImage from "../assets/images/Pdf.png";
import xls from "../assets/images/xls.png";
import txt from "../assets/images/txt.png";
import ppt from "../assets/images/ppt.png";
import heroicons_solid_download from "../assets/images/heroicons_solid_download.png";
import mdi_share from "../assets/images/mdi_share.png";
import { fileDoc, useUser } from "../context/Auth";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppStack } from "../routes/AppStack";
import { Bar } from "../components/Bar";
import firestore from "@react-native-firebase/firestore";
import {
  downloadFile,
  downloadFileTemporarioFile,
  shareFile,
} from "../../services/managerfiles";
import { Colors } from "react-native/Libraries/NewAppScreen";
import doctypes from "../components/docTypes.json";
import { NotFoundFile } from "../components/NotFoundFile";
import check from "../assets/Check.png"
import noCheck from "../assets/noCheck.png"
import Pdf from 'react-native-pdf';

import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'react-native-blob-util';


export default function MeusArquivosDocumentos() {
  const navigation = useNavigation<AppStack>();

  const{user,usuario,visibleBar,setVisibleBar} = useUser();

  // const [visibleBar, setvisibleBar] = useState(false);
  const [visibleButtonShare, setVisibleButtonShare] = useState(false);
  const [loadVisible, setloadVisible] = useState(false);

  const [showDocumentoGreat, setShowDocumentoGreat] = useState(false); 
  const [showDocumentoItem, setShowDocumentoItem] = useState<{url:string,type:string,name:string}>();
  
  // ReactNativeBlobUtil.config({
  //   trusty: true,
  // })


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
    if( type == ".pdf") setShowDocumentoItem({url:file,type:type,name:name})
    else{
      openDocument(file,type)
    }
  }

  // const handleShowDocument = async (file:string) => {
  //   try {
  //     const user = auth().currentUser;
  //     if (!user) {
  //       throw new Error("Usuário não autenticado");
  //     }
  //     // const url = await storage().ref(file).getDownloadURL();
  //     const url = file
  //     console.log(url)
  //     const token = await user.getIdToken();
  //     const res = await ReactNativeBlobUtil.config({
  //       trusty: true,
  //       fileCache: true,
  //       appendExt: 'pdf'
  //     }).fetch('GET', url, {
  //       'Authorization': `Bearer ${token}`,
  //       'User-Agent': 'Mozilla/5.0',
  //       'Accept': 'application/pdf',
  //     });

  //     if (!res || !res.path()) {
  //       throw new Error("Falha ao baixar o PDF");
  //     }

  //     setShowDocumentoItem(res.path());
  //   } catch (error) {
  //     console.error("Erro ao buscar o PDF:", error);
  //   }
  // };

  const toggleVisibleBar = () => {
    setVisibleBar(!visibleBar);
  };

  const [selecting, setSelecting] = useState(false);

  const [textSelection, setTextSelection] = useState("Selecionar");

  const [spiner, setSpiner] = useState(false);

  const toggleselecting = (value: SetStateAction<boolean>) => {
    // console.log(value)
    setSelecting(value);
    if (value) {
      setTextSelection("Selecionando");
    } else {
      setTextSelection("Selecionar");
    }
  };

  const [number, setNumber] = useState(0);
  const toggleNumber = (value: number) => {
    setNumber(value + number);
    toggleVisible(value + number);
  };

  const [listAction, setListAction] = useState<[string, string][]>([]);

  const toogleListAction = (url: string, action: string, name: string) => {
    if (action === "add")
      setListAction((listAction) => [...listAction, [url, name]]);
    if (action === "remove")
      setListAction((listAction) =>
        listAction.filter(
          ([itemUrl, itemName]) => !(itemUrl === url && itemName === name)
        )
      );
  };

  useEffect(() => {
    if (listAction.length > 0) setVisible(true);
    else {
      setVisible(false);
      toggleselecting(false);
    }
    // for(let i in listAction) console.log(i," - ",listAction[i])
    if (listAction.length === 1) setVisibleButtonShare(true);
    else setVisibleButtonShare(false);
  }, [listAction]);

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const toggleVisible = (value: number) => {
    // console.log(true)
    if (value > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const [files, setFiles] = useState<fileDoc[]>([]);

  //lista de imagens
  const fetchImages = async () => {
    setSpiner(true)
    try {
      const filesCollection = firestore().collection("files");
      const snapshot = await filesCollection
        .where('uid', '==',user?.uid)
        .where('type','==','documento')
        .where('status','==',true)
        .orderBy('dataCadastro','asc')
        .get();

      if (!snapshot.empty) {
        const fileData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<fileDoc, 'id'>),
          }))
          .sort((a, b) => {
            const parseDate = (dateStr: string) => {
              const [day, month, yearAndTime] = dateStr.split('/');
              const [year, time] = yearAndTime.split(' ');
              const [hours, minutes, seconds] = time.split(':');
              return new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours),
                parseInt(minutes), 
                parseInt(seconds),
              );
            };

            return parseDate(b.dataCadastro).getTime() - parseDate(a.dataCadastro).getTime();
          });
        // for (let i in fileData) console.log(i, "-", fileData[i].nome);
        setFiles(fileData);
        setSpiner(false)
      }
      setSpiner(false)
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
      setSpiner(false)
      return [];
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const insets = useSafeAreaInsets();
  const headerHeight = 68 + insets.top;

  const hadleDowload = async () => {
    setloadVisible(true);
    if (listAction.length === 1) await downloadFile(listAction);
    setloadVisible(false);
  };
  const hadleDowload2 = async (url:string,name:string) => {
    setloadVisible(true);
    if (url) await downloadFile([[url,name]]);
    setloadVisible(false);
  };
  const handleShareFile = async () => { 
    if (listAction.length === 1) {
      const uri = await downloadFileTemporarioFile(listAction[0]);
      if (uri) await shareFile(uri);
    }
  };
  const handleShareFile2 = async (url:string) => {
    if (url) {
      const uri = await downloadFileTemporarioFile(url);
      if (uri) await shareFile(uri);
    }
  };

  const getFileExtension = (url: string): string => {
    const match = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
    return match ? match[1] : "";
  };

  const image = (url: string) => {
    if (getFilePath(getFileExtension(url)) == "pdf") return PdfImage;
    if (getFilePath(getFileExtension(url)) == "ppt") return ppt;
    if (getFilePath(getFileExtension(url)) == "txt") return txt;
    if (getFilePath(getFileExtension(url)) == "xls") return xls;
    if (getFilePath(getFileExtension(url)) == "doc") return Doc;
  };

  const getFilePath = (extension: string): string => {
    if (extension in doctypes) {
      return doctypes[extension as keyof typeof doctypes];
    }
    return "";
  };

  useEffect(()=>{
    if(showDocumentoItem?.url) setShowDocumentoGreat(true),setVisible2(true)
  },[showDocumentoItem])

  return (
    <LinearGradient colors={["#F7FAFC", "#8BC4FD"]} style={styles.container}>
      <View style={styles.container}>
        <View style={[styles.header, { height: headerHeight }]}>
          <HeaderM2
            title={"Documentos"}
            navigation={navigation}
            press={toggleVisibleBar}
          />
          {visibleBar && <Bar />}
        </View>

        <View style={styles.body}>
          <TouchableOpacity
            onPress={() => {
              if (!selecting) {
                toggleselecting(true);
              }
            }}
            style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:45}}>

            <Text style={styles.textSelection} allowFontScaling={false}>
              {textSelection}
            </Text>

            <Image source={textSelection == "Selecionando" ? check : noCheck} style={{width: 20, height: 20}}/>
          </TouchableOpacity>
          <View style={styles.containerList}>
            {spiner?<ActivityIndicator size="large" />:
            files.length == 0 ?<NotFoundFile value="Nenhuma documento disponível!" />:
            <FlatList
              contentContainerStyle={styles.containerCards}
              data={files}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CardM4
                  imagePath={item.url}
                  name={item.nome}
                  extecao={image(item.url)}
                  text1={item.nome}
                  text2={item.cidade.charAt(0).toUpperCase() + item.cidade.slice(1).toLowerCase()+", "+item.uf.toUpperCase()}
                  text3={item.dataCadastro.split(" ")[0]}
                  text4 = {`criado em ${item.dataCriacao}`}
                  selecting={selecting}
                  longPress={() => toggleselecting(true)}
                  number={(it) => toggleNumber(it)}
                  view={(it) => handleShowDocument(it,item.extencao,item.nome)}
                  action={(it) => toogleListAction(it[0], it[1], it[2])}
                />
              )}
            />}
          </View>
        </View>

        {visible && (
          <View style={styles.containerButtonsActions}>
            {visibleButtonShare && (
              <ButtonComponentCircleM2
                imagePath={mdi_share}
                onPress={() => handleShareFile()}
              />
            )}
            {visibleButtonShare && (<ButtonComponentCircleM2
              imagePath={heroicons_solid_download}
              onPress={() => hadleDowload()}
            />)}
          </View>
        )}
      </View>


      <Modal
        transparent
        visible={showDocumentoGreat}
        animationType="fade"
        onRequestClose={() => {setShowDocumentoGreat(false),setShowDocumentoItem({url:"",type:""})}}
      >
        
        <View style={styles.modal2}>
          
          {showDocumentoItem?.type==".pdf"?
          <Pdf 
            trustAllCerts={false}
            source={{uri:`${showDocumentoItem.url}`, cache: true,headers: { "User-Agent": "Mozilla/5.0" }}} 
            style={styles.pdf} 
          />:null}
          {visible2 && (
            <View style={styles.containerButtonsActions2}>
              <ButtonComponentCircleM2 imagePath={mdi_share} onPress={()=>handleShareFile2(showDocumentoItem?showDocumentoItem.url:"")}/> 
              <ButtonComponentCircleM2 imagePath={heroicons_solid_download} onPress={()=>showDocumentoItem?hadleDowload2(showDocumentoItem.url,showDocumentoItem?.name):""}/>
            </View>
          )}
        </View>
      </Modal>

      {/* load */}
      <Modal
        transparent
        visible={loadVisible}
        animationType="fade"
        // onRequestClose={() => {setVisiblemodal2(false),setEmailNewPassword("")}}
      >
        <TouchableOpacity
          style={styles.modal2}
          activeOpacity={0.4}
          // onPressOut={() => {setVisiblemodal2(false),setEmailNewPassword("")}}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size={"large"} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    paddingBottom: 10,
  },


  header: {
    width: "100%",
  },

  pdf: {
    flex:1,
    // width:Dimensions.get('window').width,
    // height:Dimensions.get('window').height,
  },
  containerPdf: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor:'#ff0000'
},

  
  image:{
    height : "100%",
    width : "100%",
  },

  body: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-start",
    top: 26,
    gap: 10,
    flex: 1,
  },

  textSelection: {
    color: "#807979",
    fontSize: 14,
    // fontFamily: 'Poppins',
    fontWeight: "500",
    lineHeight: 21,
    textAlign: "right",
    height: 21,
    width: "100%",
    right: 24,
  },
  containerList: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingBottom: 20,
    flex: 1,
  },
  containerCards: {
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 24,
  },
  containerButtonsActions: {
    position: "absolute",
    width: 75,
    height: 173,
    bottom: 50,
    gap: 23,
    right: 24,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  containerButtonsActions2: {
    position: "absolute",
    width: 75,
    // height: 173,
    bottom: 30,
    gap: 23,
    right: 24,
    flexDirection: "row",
    justifyContent: "flex-end",
    zIndex: 99999,
  },
  modal: {
    width: "100%",
    height: "100%",
  },
  modal2: {
    flex: 1,
    backgroundColor: "#ffffffc7",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 23,
  },
});
