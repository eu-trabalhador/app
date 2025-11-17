import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';

interface Props {
  uriImagem: string;
  dataEnvio: string;
  localizacao: string;
  latitude: string;
  longitude: string;
}

// O forwardRef permite que quem usar esse componente chame funções internas
export const MarcaDaguaCaptura = forwardRef(({
  uriImagem,
  dataEnvio,
  localizacao,
  latitude,
  longitude,
}: Props, ref) => {
  const viewShotRef = useRef<ViewShot>(null);

  // Expõe a função para o componente pai
  useImperativeHandle(ref, () => ({
    async capturarImagem(): Promise<string> {
      if (!viewShotRef.current) return '';
      const uri = await viewShotRef.current.capture?.();
      return uri ?? '';
    },
  }));

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'jpg', quality: 0.9, result: 'tmpfile' }}
        style={styles.viewShot}
      >
        <Image source={{ uri: uriImagem }} style={styles.imagem} resizeMode="cover" />
        <View style={styles.overlay}>
          <Text style={styles.text}>Eu Trabalhador</Text>
          <Text style={styles.text}>Data: {dataEnvio}</Text>
          <Text style={styles.text}>Local: {localizacao}</Text>
          <Text style={styles.text}>Latitude: {latitude}</Text>
          <Text style={styles.text}>Longitude: {longitude}</Text>
        </View>
      </ViewShot>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  viewShot: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imagem: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  text: {
    color: '#fff',
    fontSize: 10,
  },
});
