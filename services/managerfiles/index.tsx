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

// export const downloadImage = async (urls: any) => {
//   try {
//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permissão necessária', 'Conceda acesso à biblioteca para salvar arquivos.');
//       return;
//     }

//     const assets = [];
//     const downloadPromises = urls.map(async (url: string) => {
//       const decodedPath = decodeURIComponent(new URL(url).pathname);
//       const fileName = decodedPath.split('/').pop();
 
//       if (fileName) {
//         const fileUri = FileSystem.documentDirectory + fileName;
//         const response = await FileSystem.downloadAsync(url, fileUri);

//         try {
//           const asset = await MediaLibrary.createAssetAsync(response.uri);
//           assets.push(asset);
//         } catch {
//           console.log("Arquivo salvo, mas não é uma mídia compatível.");
//         }
//       }
//     });

//     if (assets.length > 0) {
//       await MediaLibrary.createAlbumAsync('Download', assets[0], false);
//       for (let i = 1; i < assets.length; i++) {
//         await MediaLibrary.addAssetsToAlbumAsync([assets[i]], 'Download', false);
//       }
//     }

//     await Promise.all(downloadPromises);

//     Alert.alert(
//       'Sucesso',
//       `Download realizado, deseja abrir o arquivo?`,
//       [
//         { text: 'Cancelar', style: 'cancel' },
//         { text: 'Abrir', onPress: () => OpenGallery() },
//       ],
//       { cancelable: true }
//     );
//   } catch (error) {
//     console.error('Erro ao fazer download:', error);
//     Alert.alert('Erro', 'Não foi possível salvar o arquivo.');
//   }
// };




// const OpenGallery = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       // Abre a galeria de imagens no Android
//       await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
//         data: 'content://media/internal/images/media',
//         type: 'image/*',
//       });
//     } else if (Platform.OS === 'ios') {
//       // Abre a galeria de fotos no iOS
//       await Linking.openURL('photos-redirect://');
//     } else {
//       Alert.alert('Erro', 'Plataforma não suportada.');
//     }
//   } catch (error) {
//     console.error('Erro ao abrir a galeria:', error);
//     Alert.alert('Erro', 'Não foi possível abrir a galeria de fotos.');
//   }
// };



// export const downloadFile = async (listAction) => {
//   try {
//     console.log("break - 1");
//     // Request permissions to write to external storage
//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Permission to access media library is required!');
//       return;
//     }
//     console.log("break - 2");

//     for (const [url, name] of listAction) {
//       console.log("break - 3");
//       console.log("break - 3.2: ", url);
//       let type = mime.getType(url);
//       console.log("break - 3.1: ", type);

//       // If mime type is null, try to extract extension from URL
//       if (!type) {
//         const extensionMatch = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
//         const extension = extensionMatch ? extensionMatch[1] : '';
//         type = mime.getType(extension);
//         console.log("break - 3.3: Extracted extension type: ", type);
//       }

//       if (type) {
//         console.log("break - 4");
//         const validMimeTypes = [
//           'application/pdf',
//           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//           'text/plain',
//           'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//         ];
        
//         if (validMimeTypes.includes(type)) {
//           console.log("break - 5");
//           // Define path to the public storage directory
//           const fileUri = `${FileSystem.documentDirectory}${name}`;
          
//           // Download the file to a local directory
//           const downloadResult = await FileSystem.downloadAsync(url, fileUri);
// console.log('Downloaded file to temporary location:', downloadResult.uri);
//           if (downloadResult.status === 200) {
//             console.log("break - 6");
//             // Move file to Downloads directory
//             const downloadsDirectory = `${FileSystem.documentDirectory}Download/`;
//             const destinationUri = `${downloadsDirectory}${name}`;

//             try {
//               await FileSystem.makeDirectoryAsync(downloadsDirectory, { intermediates: true });
//               await FileSystem.moveAsync({ from: downloadResult.uri, to: destinationUri });
// console.log('Moved file to final destination:', destinationUri);
//               console.log(`Downloaded ${name} to public Downloads successfully.`);
//               Alert.alert(
//                 'Sucesso',
//                 `Download realizado com sucesso. Deseja abrir a pasta de Downloads?`,
//                 [
//                   { text: 'Cancelar', style: 'cancel' },
//                   { text: 'Abrir', onPress: () => openFolder() },
//                 ],
//                 { cancelable: true }
//               );
//             } catch (error) {
//               console.error('Error moving file to Downloads:', error);
//               Alert.alert('Erro', 'Não foi possível mover o arquivo para a pasta de Downloads. Verifique as permissões.');
//             }
//           } else {
//             console.error(`Failed to download file ${name}`);
//           }
//         } else {
//           console.error(`File type not supported: ${name}`);
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error downloading files:', error);
//   }
// };




// const openFolder = async () => {
//   try {
//     console.log("openFolder - 1: Start open folder process");
//     if (Platform.OS === 'android') {
//       console.log("openFolder - 2: Platform is Android");
//       console.log("openFolder - 3: Preparing to launch ACTION_OPEN_DOCUMENT_TREE to open Downloads");
//       await IntentLauncher.startActivityAsync('android.intent.action.OPEN_DOCUMENT_TREE', {
//         flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
//       });
//       console.log("openFolder - 4: Intent launched successfully");
//     } else {
//       console.log("openFolder - 5: Platform is not Android, showing alert");
//       Alert.alert('Erro', 'Abrir a pasta não é suportado nesta plataforma.');
//     }
//   } catch (error) {
//     console.log('openFolder - 6: Error occurred while trying to open the folder', error);
//     console.error('Erro ao abrir a pasta:', error);
//     Alert.alert('Erro', 'Não foi possível abrir a pasta de Downloads.');
//   }
// };

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

export const downloadFile = async (listAction:any) => {
  try {
    console.log("downloadFiles - Iniciando download de arquivos");
    console.log(listAction);

    for (const [url, name] of listAction) {
      console.log("downloadFiles - Baixando:", name);
      let type = mime.getType(url);

      // Tentativa de extrair a extensão do URL caso o tipo MIME não seja identificado
      if (!type) {
        const extensionMatch = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
        const extension = extensionMatch ? extensionMatch[1] : '';
        type = mime.getType(extension);
        console.log("downloadFiles - Tipo extraído:", type);
      }

      // Verifica se o tipo MIME é suportado
      if (type) {
        const validMimeTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ];

        if (validMimeTypes.includes(type)) {
          console.log("downloadFiles - Tipo válido, iniciando download...");

          // Definir caminho para o diretório de cache
          const fileUri = `${FileSystem.cacheDirectory}${name}`;

          // Baixar o arquivo para o diretório de cache
          const downloadResult = await FileSystem.downloadAsync(url, fileUri);
          console.log('Arquivo baixado para o cache:', downloadResult.uri);

          if (downloadResult.status === 200) {
            // Compartilhar o arquivo baixado
            await shareFiles(downloadResult.uri);

            Alert.alert('Sucesso', 'Arquivo baixado com sucesso!');


            
          } else {
            console.error(`Falha ao baixar o arquivo ${name}`);
          }
        } else {
          console.error(`Tipo de arquivo não suportado: ${name}`);
        }
      }
    }

    
  } catch (error) {
    console.error('Erro ao baixar ou salvar arquivos:', error);
    Alert.alert('Erro', 'Não foi possível baixar ou salvar todos os arquivos.');
  }
};





// async () => {
//   try {
//     if (Platform.OS === 'android') {
//       // Usa Intent Android para abrir a pasta de Downloads diretamente
//       await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
//         data: 'content://com.android.externalstorage.documents/document/primary:Download',
//         flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
//       });
//     } else {
//       Alert.alert('Erro', 'Abrir a pasta não é suportado nesta plataforma.');
//     }
//   } catch (error) {
//     console.log('Erro ao abrir a pasta:', error);
//     console.error('Erro ao abrir a pasta:', error);
//     Alert.alert('Erro', 'Não foi possível abrir a pasta de Downloads.');
//   }
// };

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

// const downloadFileTemporarioImage = async (url: string): Promise<string | null> => {
//   try {
//     const fileName = decodeURIComponent(new URL(url).pathname.split('/').pop() || '');
//     const fileUri = FileSystem.documentDirectory + fileName;

//     const response = await FileSystem.downloadAsync(url, fileUri);
//     console.log(`Arquivo baixado para: ${response.uri}`);
//     return response.uri;
//   } catch (error) {
//     console.error('Erro ao baixar o arquivo:', error);
//     return null;
//   }
// };

// export const shareImage = async (url: string) => {
//   console.log(url)
//   const uri = await downloadFileTemporarioImage(url)
//   console.log(uri)
  // if(uri){
  //   try {
  //     // Verifica se o dispositivo suporta compartilhamento
  //     if (!(await Sharing.isAvailableAsync())) {
  //       Alert.alert('Compartilhamento não disponível', 'Seu dispositivo não suporta compartilhamento.');
  //       return;
  //     }
  
  //     // Compartilha o arquivo
  //     await Sharing.shareAsync(uri);
  //     console.log(`Arquivo compartilhado: ${uri}`);
  //   } catch (error) {
  //     console.error('Erro ao compartilhar arquivo:', error);
  //     Alert.alert('Erro', 'Não foi possível compartilhar o arquivo.');
  //   }
  // }
// };