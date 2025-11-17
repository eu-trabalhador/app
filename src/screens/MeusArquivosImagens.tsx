import { StyleSheet,  View, TouchableOpacity, Text, Modal, FlatList ,KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator, Image,} from 'react-native';
import { HeaderM2 } from '../components/HeaderM2';
import { LinearGradient } from 'expo-linear-gradient';
import { CardM3 } from '../components/CardM3';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { ButtonComponentCircleM2 } from '../components/ButtonComponentCircleM2';
import img1 from "../assets/images/img1.png"
import img2 from "../assets/images/img2.png"
import check from "../assets/Check.png"
import noCheck from "../assets/noCheck.png"
import heroicons_solid_download from "../assets/images/heroicons_solid_download.png"
import mdi_share from "../assets/images/mdi_share.png"
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {  SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native'
import { AppStack } from '../routes/AppStack'
import { Bar } from '../components/Bar';
import { fileDoc, useUser } from '../context/Auth';
import storage from "@react-native-firebase/storage"
import firestore from "@react-native-firebase/firestore"
import { downloadFile, downloadFileTemporarioFile, downloadImage, shareFile } from "../../services/managerfiles"
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NotFoundFile } from '../components/NotFoundFile';
import { MarcaDaguaCaptura } from '../components/MarcaDaguaCaptura';
import * as MediaLibrary from 'expo-media-library';

export default function MeusArquivosImagens() {
  const navigation = useNavigation<AppStack>();
  const { user, usuario, visibleBar, setVisibleBar } = useUser();

  const [visibleButtonShare, setVisibleButtonShare] = useState(false);
  const [loadVisible, setloadVisible] = useState(false);

  const [showImagemGreat, setShowImagemGreat] = useState(false);
  const [showImagemItem, setShowImagemItem] = useState("");
  const [showImagemLocalizacao, setShowImagemLocalizacao] = useState<string | null>(null);
  const [showImagemLatitude, setShowImagemLatitude] = useState<string | null>(null);
  const [showImagemLongitude, setShowImagemLongitude] = useState<string | null>(null);
  const [showImagemDataEnvio, setShowImagemDataEnvio] = useState<string | null>(null);
  const [showImagemOrigem, setShowImagemOrigem] = useState<string | null>(null);
  const marcaDaguaRef = useRef<any>(null);

  const toggleVisibleBar = () => {
    setVisibleBar(!visibleBar);
  };

  const [selecting, setSelecting] = useState(false);
  const [spiner, setSpiner] = useState(false);

  const [textSelection, setTextSelection] = useState("Selecionar");

  const toggleselecting = (value: SetStateAction<boolean>) => {
    setSelecting(value);
    setTextSelection(value ? "Selecionando" : "Selecionar");
  };

  const [number, setNumber] = useState(0);
  const toggleNumber = (value: number) => {
    setNumber(value + number);
    toggleVisible(value + number);
  };

  const [listAction, setListAction] = useState<string[]>([]);

  const toogleListAction = (url: string, action: string) => {
    if (action === "add") setListAction((listAction) => [...listAction, url]);
    if (action === "remove") setListAction((listAction) => listAction.filter((element) => element !== url));
  };

  useEffect(() => {
    if (listAction.length > 0) setVisible(true);
    else {
      setVisible(false);
      toggleselecting(false);
    }
    setVisibleButtonShare(listAction.length === 1);
  }, [listAction]);

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const toggleVisible = (value: number) => {
    setVisible(value > 0);
  };

  const [files, setFiles] = useState<fileDoc[]>([]);

  const fetchImages = async () => {
    setSpiner(true);
    try {
      const filesCollection = firestore().collection("files");
      const snapshot = await filesCollection
        .where("uid", "==", user?.uid)
        .where("type", "==", "imagem")
        .where("status", "==", true)
        .orderBy("dataCadastro", "desc")
        .get();

      if (!snapshot.empty) {
        const fileData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<fileDoc, "id">),
          }))
          .sort((a, b) => {
            const parseDate = (dateStr: string) => {
              const [day, month, yearAndTime] = dateStr.split("/");
              const [year, time] = yearAndTime.split(" ");
              const [hours, minutes, seconds] = time.split(":");
              return new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours),
                parseInt(minutes),
                parseInt(seconds)
              );
            };
            return parseDate(b.dataCadastro).getTime() - parseDate(a.dataCadastro).getTime();
          });
        setFiles(fileData);
      }
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
    } finally {
      setSpiner(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const insets = useSafeAreaInsets();
  const headerHeight = 68 + insets.top;

  const hadleDowload = async () => {
    setloadVisible(true);
    if (listAction.length > 0) await downloadImage(listAction);
    setloadVisible(false);
  };

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

  const handleShareFile = async () => {
    if (listAction.length === 1) {
      const uri = await downloadFileTemporarioFile(listAction[0]);
      if (uri) await shareFile(uri);
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

  useEffect(() => {
    if (showImagemItem) {
      setShowImagemGreat(true);
      setVisible2(true);
    }
  }, [showImagemItem]);

  return (
    <LinearGradient colors={["#F7FAFC", "#8BC4FD"]} style={styles.container}>
      <View style={styles.container}>
        <View style={[styles.header, { height: headerHeight }]}>
          <HeaderM2 title={"Imagens"} navigation={navigation} press={toggleVisibleBar} />
          {visibleBar && <Bar />}
        </View>

        <View style={styles.body}>
          <TouchableOpacity
            onPress={() => {
              if (!selecting) {
                toggleselecting(true);
              }
            }}
            style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 45 }}
          >
            <Text style={styles.textSelection} allowFontScaling={false}>
              {textSelection}
            </Text>
            <Image source={textSelection == "Selecionando" ? check : noCheck} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>

          <View style={styles.containerList}>
            {spiner ? (
              <ActivityIndicator size="large" />
            ) : files.length == 0 ? (
              <NotFoundFile value="Nenhuma imagem disponível!" />
            ) : (
              <FlatList
                contentContainerStyle={styles.containerCards}
                data={files}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <CardM3
                    imagePath={item.url}
                    text1={`Enviado em ${item.dataCadastro.split(" ")[0]}`}
                    text2={`${item.cidade.charAt(0).toUpperCase() + item.cidade.slice(1).toLowerCase()}, ${item.uf.toLocaleUpperCase()}`}
                    text3={`criado em ${item.dataCriacao}`}
                    text4={
                      item.geolocalizacao.latitude && item.geolocalizacao.longitute
                        ? `${item.geolocalizacao.latitude}S ${item.geolocalizacao.longitute}E`
                        : null
                    }
                    selecting={selecting}
                    longPress={() => toggleselecting(true)}
                    number={(it) => toggleNumber(it)}
                    view={() => {
                      setShowImagemItem(item.url);
                      setShowImagemDataEnvio(item.dataCadastro || null);

                      const cidadeUF = `${item.cidade.charAt(0).toUpperCase() + item.cidade.slice(1).toLowerCase()}, ${item.uf.toUpperCase()}`;
                      setShowImagemLocalizacao(cidadeUF);

                      setShowImagemLatitude(item.geolocalizacao?.latitude || null);
                      setShowImagemLongitude(item.geolocalizacao?.longitute || null);
                      setShowImagemOrigem(item.origem || null);
                    }}
                    action={(it) => toogleListAction(it[0], it[1])}
                  />
                )}
              />
            )}
          </View>
        </View>

        {visible && (
          <View style={styles.containerButtonsActions}>
            {visibleButtonShare && <ButtonComponentCircleM2 imagePath={mdi_share} onPress={() => handleShareFile()} />}
            <ButtonComponentCircleM2 imagePath={heroicons_solid_download} onPress={() => hadleDowload()} />
          </View>
        )}
      </View>

      <Modal
        transparent
        visible={showImagemGreat}
        animationType="fade"
        onRequestClose={() => {
          setShowImagemGreat(false);
          setShowImagemItem("");
          setShowImagemLocalizacao(null);
          setVisible2(false);
        }}
      >
        <TouchableOpacity
          style={styles.modal2}
          activeOpacity={0.4}
          onPressOut={() => {
            setShowImagemGreat(false);
            setShowImagemItem("");
            setShowImagemLocalizacao(null);
            setVisible2(false);
          }}
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: '90%', height: '80%' }}>
            {showImagemOrigem === 'camera' ? (
              <MarcaDaguaCaptura
                ref={marcaDaguaRef}
                uriImagem={showImagemItem}
                dataEnvio={showImagemDataEnvio || ''}
                localizacao={showImagemLocalizacao || ''}
                latitude={showImagemLatitude || ''}
                longitude={showImagemLongitude || ''}
              />
            ) : (
              <Image
                source={{ uri: showImagemItem }}
                style={{ width: '100%', height: '80%', resizeMode: 'contain', borderRadius: 10 }}
              />
            )}
          </View>


            {visible2 && (
              <View style={styles.containerButtonsActions2}>
                <ButtonComponentCircleM2 imagePath={mdi_share} onPress={() => handleShareFile2(showImagemItem)} />
                <ButtonComponentCircleM2 imagePath={heroicons_solid_download} onPress={() => hadleDowload2(showImagemItem)} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal transparent visible={loadVisible} animationType="fade">
        <TouchableOpacity style={styles.modal2} activeOpacity={0.4}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size={"large"} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}



const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    width : '100%',
    height : '100%',
    justifyContent : 'flex-start',  
    paddingBottom:10,  
  },
  image:{
    height : "100%",
    width : "100%",
  },

  header:{
    width : '100%',
  },

  body : {
    flexDirection : 'column',
    width : '100%',
    justifyContent : 'flex-start',
    top : 26,
    gap : 10,
    flex:1
  },

  infoText: {
  color: 'white',
  fontSize: 14,
  fontWeight: '500',
  marginTop: 2,
  textAlign: 'right',
  },

  overlayText: {
  color: "white",
  fontSize: 14,
  fontWeight: "500",
  marginBottom: 2,
  },

  textSelection: {
    color: '#807979',
    fontSize: 14,
    // fontFamily: 'Poppins',
    fontWeight: '500',
    lineHeight: 21,
    textAlign: 'right',
    height: 21,
    width : '100%',
    right:24
  },
  containerList:{
    width : '100%',
    flexDirection : 'column',
    justifyContent : 'flex-start',
    paddingBottom:20,
    flex:1
  },
  containerCards:{
    width : '100%',
    flexDirection : 'column',
    paddingHorizontal:24,
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
  modal:{
    width : '100%',
    height : "100%"
  },
  modal2: {
    flex: 1,
    backgroundColor: '#ffffffc7',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding : 23
  },
});
