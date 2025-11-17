import { Modal, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { HeaderM3 } from '../components/HeaderM3';
import { Bar } from '../components/Bar';
import { useUser } from '../context/Auth';
import firestore from "@react-native-firebase/firestore";
import UserList from '../components/UserList';
import { useNavigation } from '@react-navigation/native';
import { AppStack } from '../routes/AppStack';

export default function HomeAdmin() {
  const { usuario, visibleBar, setVisibleBar } = useUser();
  const [name, setName] = useState(usuario.nome || 'carregando...');
  const [imagem, setImagem] = useState(usuario.imagem || null);
  const [spiner, setSpiner] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [totalUsuarios, setTotalUsuarios] = useState<number | null>(null);

  // 🔹 Armazenamento
  const [usedGB, setUsedGB] = useState<number | null>(null);
  const [percentUsed, setPercentUsed] = useState<number>(0);

  // Limite total de armazenamento (exemplo: 5 GB por app)
  const TOTAL_GB = 5;

  const toggleVisibleBar = () => {
    setVisibleBar(!visibleBar);
  };

  const toggleisPopupVisible = (value: boolean) => {
    setPopupVisible(value);
  };

  const insets = useSafeAreaInsets();
  const headerHeight = 68 + insets.top;

  // 🔹 Buscar total de usuários
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setSpiner(true);
        const snapshot = await firestore().collection("usuario").get();
        setTotalUsuarios(snapshot.size);
      } catch (error) {
        console.error("Erro ao contar usuários:", error);
      } finally {
        setSpiner(false);
      }
    };
    fetchUsuarios();
  }, []);

  // 🔹 Buscar uso de armazenamento (soma de todos)
  useEffect(() => {
    const fetchStorage = async () => {
      try {
        setSpiner(true);
        const snapshot = await firestore().collection("files").get();
        let totalBytes = 0;
        snapshot.forEach(doc => {
          const data = doc.data();
          totalBytes += data.size || 0; // aqui considera o campo 'size' do arquivo
        });

        const totalMB = totalBytes / (1024 * 1024);
        setUsedGB(Number(totalMB.toFixed(2)));
        setPercentUsed(Math.min((totalMB / (TOTAL_GB * 1024)) * 100, 100));
      } catch (error) {
        console.error("Erro ao buscar uso de storage:", error);
      } finally {
        setSpiner(false);
      }
    };
    fetchStorage();
  }, []);

  const maskFirtsName = (name: string) => {
    if (name) {
      const primeiraParte = name.split(" ")[0].split(".")[0].toLowerCase();
      return primeiraParte.charAt(0).toUpperCase() + primeiraParte.slice(1);
    }
    return name;
  };

  const navigation = useNavigation<AppStack>();


  return (
    <LinearGradient colors={["#F7FAFC", "#8bc4fd"]} style={styles.container}>
      <View style={styles.container}>
        <View style={[styles.header, { height: headerHeight }]}>
          <HeaderM3 title={`Olá, ${maskFirtsName(name)}`} press={toggleVisibleBar} imagem={imagem} />
          {visibleBar && <Bar />}
        </View>

        <View style={styles.body}>
          {/* 🔹 Card de Usuários */}
          <View style={styles.card}>
            <Text allowFontScaling={false} style={styles.cardTitle}>Usuários</Text>
            <Text allowFontScaling={false} style={styles.cardSubtitle}>Total de usuários</Text>
            <Text allowFontScaling={false} style={styles.cardNumber}>
              {totalUsuarios !== null ? totalUsuarios : "..."}
            </Text>
          </View>

          {/* 🔹 Card de Armazenamento */}
          <View style={styles.card}>
            <Text allowFontScaling={false} style={styles.cardTitle}>Armazenamento</Text>
            <Text allowFontScaling={false} style={styles.cardSubtitle}>Total alocado em núvem</Text>
            <Text allowFontScaling={false} style={styles.cardNumber}>
              {usedGB !== null ? `${usedGB} MB` : "..."}
            </Text>

            {/* Barra de proporção */}
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${percentUsed}%` }]} />
            </View>
          </View>

          {/* Lista de Usuários */}
          <View style={[styles.card, { padding: 0, backgroundColor: "transparent" }]}>
            <Text allowFontScaling={false} style={[styles.cardTitle, { padding: 16 }]}>Últimas Atividades</Text>
            <View style={{ maxHeight: 300, width: "100%" }}>
              <UserList />
            </View>
          </View>
        </View>
      </View>

      {/* Modal Spinner */}
      <Modal transparent visible={spiner} animationType="fade">
        <View style={styles.modalSpinner}>
          <ActivityIndicator size="large" />
        </View>
      </Modal>

      {/* Popup */}
      <Modal transparent visible={popupVisible} animationType="fade" onRequestClose={() => toggleisPopupVisible(false)}>
        <TouchableOpacity
          style={styles.popupmodal}
          activeOpacity={1}
          onPressOut={() => toggleisPopupVisible(false)}
        />
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    gap: 20,
  },
  header: {
    width: '100%',
  },
  body: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-start',
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    padding: 16,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 8,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#d3d3d3',
    borderRadius: 6,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0047AB', // Azul escuro
    shadowColor: '#00f',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  modalSpinner: {
    flexDirection: 'column',
    backgroundColor: '#ffffff50',
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: '100%',
  },
  popupmodal: {
    flex: 1,
    backgroundColor: '#0000007f',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
