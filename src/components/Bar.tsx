import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppStack } from '../routes/AppStack';
import { useUser } from '../context/Auth';

export const Bar = () => {
  const navigation = useNavigation<AppStack>();
  const { signOut, visibleBar, setVisibleBar, usuario } = useUser();

  const [active, setActive] = useState<number | null>(null);
  const isAdmin = usuario?.acesso === 2;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert("Erro ao fazer logout, tente novamente.");
    }
  };

  const handleActionLink = (action: number) => {
    setActive(action);
    setTimeout(() => {
      switch (action) {
        case 1: navigation.navigate('Home'); break;
        case 2: navigation.navigate('MeusArquivosImagens'); break;
        case 3: navigation.navigate('MeusArquivosDocumentos'); break;
        case 4: navigation.navigate('User'); break;
        case 5: handleSignOut(); break;
        case 6: if (isAdmin) navigation.navigate('HomeAdmin'); break;
      }
      setVisibleBar(false);
    }, 200);
  };

  return (
    <Modal
      transparent
      visible={visibleBar}
      animationType="fade"
      onRequestClose={() => setVisibleBar(false)}
    >
      <TouchableOpacity
        style={styles.modal}
        activeOpacity={0}
        onPressOut={() => setVisibleBar(false)}
      >
        <View style={styles.bar}>
          <View style={styles.lineTite}>
            <Text
              style={[styles.textBar, active === 1 && styles.underlinedText]}
              onPress={() => handleActionLink(1)}
            >
              Home
            </Text>
            {isAdmin && (
             <View style={styles.line}>
              <Text
                style={[styles.textBar, active === 6 && styles.underlinedText]}
                onPress={() => handleActionLink(6)}
              >
                Dashboard
              </Text>
             </View>
            )}
          </View>

          <View style={styles.line}>
            <Text
              style={[styles.textBar, active === 2 && styles.underlinedText]}
              onPress={() => handleActionLink(2)}
            >
              Abrir imagens
            </Text>
            <Text
              style={[styles.textBar, active === 3 && styles.underlinedText]}
              onPress={() => handleActionLink(3)}
            >
              Abrir documentos
            </Text>
          </View>

          <View style={styles.linefooter}>
            <Text
              style={[styles.textBar, active === 4 && styles.underlinedText]}
              onPress={() => handleActionLink(4)}
            >
              Perfil
            </Text>
            <Text
              style={[styles.textBar, active === 5 && styles.underlinedText]}
              onPress={() => handleActionLink(5)}
            >
              Sair
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#ffffff0',
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    padding: 23,
  },
  bar: {
    backgroundColor: "#ffffff",
    height: 400,
    width: 250,
    top: 75,
    right: 7,
    position: 'absolute',
    zIndex: 999,
    borderRadius: 5,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#00000017",
    shadowColor: '#2b6197',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.75,
    shadowRadius: 10,
    elevation: 10,
  },
  underlinedText: {
    backgroundColor: '#0c61c2d4',
    color: '#fff',
  },
  textBar: {
    paddingLeft: 10,
    color: '#3f444d',
    fontSize: 20,
    width: '100%',
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'left',
    height: 25,
    textAlignVertical: 'center',
    borderRadius: 5,
  },
  lineTite: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#aea7a7',
  },
  line: {
    paddingVertical: 15,
    gap: 15,
  },
  linefooter: {
    borderTopWidth: 1,
    borderTopColor: '#aea7a7',
    position: 'absolute',
    gap: 15,
    bottom: 0,
    paddingTop: 15,
    paddingBottom: 20,
    marginHorizontal: 10,
    width: '100%',
  },
});
