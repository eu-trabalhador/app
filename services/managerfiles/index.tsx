import React from "react";
import { Alert, Linking, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import mime from 'mime';
import * as IntentLauncher from 'expo-intent-launcher';

// import * as IntentLauncherAndroid from 'expo-intent-launcher/IntentLauncher';


// import * as Permissions from 'expo-permissions';



export const camera3x4 = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== "granted") {
    // console.error("Permissão de câmera negada!");
    return;
  }

  const result: any = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.5,
  });

  if (!result.cancelled && result.assets[0].uri) {
    const resizedImage = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [],
      {
        compress: 0.2,
        format: ImageManipulator.SaveFormat.JPEG,
        // maxWidth: 400,
        // maxHeight: 400,
      } as any
    );

    return resizedImage.uri;
  }
  return;
}


export const camera = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== "granted") {
    // console.error("Permissão de câmera negada!");
    return;
  }

  const result: any = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    // aspect: [3, 4],
    quality: 0.5,
  });

  if (!result.cancelled && result.assets[0].uri) return result.assets[0].uri;
  return;
}




export const fileImage3x4 = async () => {
  const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  const { status: cameraStatus } =
    await ImagePicker.requestCameraPermissionsAsync();
  if (mediaLibraryStatus !== "granted" || cameraStatus !== "granted") {
    Alert.alert(
      "Alerta!",
      "Necessário permissão de camera e galeria, para fotos!"
    );
    return;
  }
  const result: any = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.5,
  });
  if (result.assets[0].uri) {
    // Redimensionar a imagem proporcionalmente para ter no máximo 400 pixels de largura ou altura
    const resizedImage = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [],
      {
        compress: 0.2,
        format: ImageManipulator.SaveFormat.JPEG,
        // maxWidth: 400,
        // maxHeight: 400,
      } as any
    );

    return resizedImage.uri;
  }
  return;
}
export const fileImage = async () => {
  const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  const { status: cameraStatus } =
    await ImagePicker.requestCameraPermissionsAsync();
  if (mediaLibraryStatus !== "granted" || cameraStatus !== "granted") {
    Alert.alert(
      "Alerta!",
      "Necessário permissão de camera e galeria, para fotos!"
    );
    return;
  }

  const result: any = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    // allowsEditing: true,
    // aspect: [1, 1],
    quality: 0.5,
  });

  console.log(result.assets[0])

  if (result.assets[0].uri) return result.assets[0].uri;

  return;
}
export const file = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ], 
      copyToCacheDirectory: true, 
      multiple: false, 
    });

    if (!result.canceled) {
      const image = result.assets[0];
      // const fileUri = uri.startsWith('content://')? await FileSystem.getContentUriAsync(uri): uri;



      return image
      // return result.assets[0].uri
    } else if (result.canceled) {
      // O usuário cancelou a seleção do arquivo
      Alert.alert('Seleção cancelada', 'Nenhum arquivo foi selecionado.');
      return;
    }
  } catch (error) {
    // console.error('Erro ao selecionar o arquivo:', error);
    Alert.alert('Erro', 'Ocorreu um erro ao tentar selecionar o arquivo.');
    return;
  }
}
export const downloadImage = async (urls:any) => {
  
   
  // setInitializing(true)
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Conceda acesso à biblioteca para salvar arquivos.');
      return;
    }

    const assets = [];

    const downloadPromises = urls.map(async (url:string) => {
      const decodedPath = decodeURIComponent(new URL(url).pathname);
      const fileName = decodedPath.split('/').pop();

      if(fileName) {
        const fileUri = FileSystem.documentDirectory + fileName;
        const response = await FileSystem.downloadAsync(url, fileUri);
        // console.log(response.uri)
        
        try{
          const asset = await MediaLibrary.createAssetAsync(response.uri);
          assets.push(asset)
        }catch{
          console.log("Arquivos não midia, salvos!")
        }
        
      }
    });

    if(assets.length > 0 ){
      await MediaLibrary.createAlbumAsync('Download', assets[0], false);
      for (let i = 1; i < assets.length; i++) {
        await MediaLibrary.addAssetsToAlbumAsync([assets[i]], 'Download', false);
      }
    }

    await Promise.all(downloadPromises);

    // setInitializing(false)
    Alert.alert(
      'Sucesso',
      `Download realizado, deseja abrir o arquivo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir', onPress: () => OpenGalery() },
      ],
      { cancelable: true }
    );
  } catch (error) {
    // setInitializing(false) 
    console.error('Erro ao fazer dowload:', error);
    Alert.alert('Erro', 'Não foi possível salvar o arquivo.');
  }
};

declare module 'mime';

const shareFiles = async (fileUri:string) => {
  try {
    console.log("shareFile - Iniciando compartilhamento");
    const local = mime.getType(fileUri)
    if(local){
      await Sharing.shareAsync(fileUri, {
        dialogTitle: 'Escolha onde salvar o arquivo',
        mimeType: local
      });
    }
    console.log("shareFile - Arquivo salvo com sucesso:", fileUri);
  } catch (error) {
    console.error('Erro ao compartilhar o arquivo:', error);
    Alert.alert('Erro', 'Não foi possível compartilhar o arquivo.');
  }
};

export const downloadFile = async (listAction: [string, string][]) => {

  try {

    console.log("downloadFiles - Iniciando download");

    // pedir acesso à pasta Downloads
    const permission =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!permission.granted) {

      Alert.alert(
        "Permissão necessária",
        "Permita acesso à pasta Downloads"
      );

      return;
    }

    for (const [url, name] of listAction) {

      console.log("Baixando:", name);

      let mimeType = mime.getType(url) || 'application/octet-stream';

      const extensionMatch = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);

      const extension =
        extensionMatch?.[1] ||
        mime.getExtension(mimeType) ||
        '';

      const fileName =
        extension && !name.endsWith(extension)
          ? `${name}.${extension}`
          : name;

      // caminho temporário
      const tempUri =
        FileSystem.cacheDirectory + fileName;

      // baixar arquivo
      const download =
        await FileSystem.downloadAsync(
          url,
          tempUri
        );

      if (download.status !== 200) {

        throw new Error("Falha no download");

      }

      console.log("Baixado:", download.uri);

      // ler base64
      const base64 =
        await FileSystem.readAsStringAsync(
          download.uri,
          {
            encoding:
              FileSystem.EncodingType.Base64,
          }
        );

      // criar arquivo em Downloads
      const newFileUri =
        await FileSystem.StorageAccessFramework.createFileAsync(
          permission.directoryUri,
          fileName,
          mimeType
        );

      // salvar
      await FileSystem.writeAsStringAsync(
        newFileUri,
        base64,
        {
          encoding:
            FileSystem.EncodingType.Base64,
        }
      );

      console.log("Salvo em:", newFileUri);

    }

    Alert.alert(
      "Sucesso",
      "Arquivo salvo em Downloads"
    );

  } catch (error) {

    console.log("ERRO:", error);

    Alert.alert(
      "Erro",
      "Não foi possível salvar o arquivo"
    );

  }

};

const OpenGalery = async () => {
  try {
    if (Platform.OS === 'android') {
      // Usa Intent Android para abrir a galeria de fotos diretamente
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: 'content://media/internal/images/media',
      });
    } else {
      Alert.alert('Erro', 'Abrir a galeria não é suportado nesta plataforma.');
    }
  } catch (error) {
    console.log('Erro ao abrir a galeria:', error);
    console.error('Erro ao abrir a galeria:', error);
    Alert.alert('Erro', 'Não foi possível abrir a galeria.');
  }
};


export const downloadFileTemporarioFile = async (item: any) => {
  try {

    const url = typeof(item) === 'string' ? item : item[0];

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Conceda acesso à biblioteca para salvar arquivos.');
      return;
    }
    const decodedPath = decodeURIComponent(new URL(url).pathname);
    const fileName = typeof(item) === 'string' ? decodedPath.split('/').pop() : item[1];
    if(fileName) {
      const fileUri = FileSystem.documentDirectory + fileName;
      const response = await FileSystem.downloadAsync(url, fileUri);   
      return response.uri;
    }
  } catch (error) {
    console.error('Erro ao baixar o arquivo:', error);
    return null;
  }
};

export const shareFile = async (uri: string) => {
  if(uri){
    try {
      // Verifica se o dispositivo suporta compartilhamento
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Compartilhamento não disponível', 'Seu dispositivo não suporta compartilhamento.');
        console.log('Compartilhamento não disponível', 'Seu dispositivo não suporta compartilhamento.');
        return;
      }
      // Compartilha o arquivo
      await Sharing.shareAsync(uri);
      // console.log(`Arquivo compartilhado: ${uri}`);
    } catch (error) {
      console.error('Erro ao compartilhar arquivo:', error);
      Alert.alert('Erro', 'Não foi possível compartilhar o arquivo.');
    }
  }
};
