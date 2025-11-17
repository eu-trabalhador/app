import React, { useEffect, useState } from "react";
import { View, FlatList, Image, StyleSheet, Text } from "react-native";
import firestore from "@react-native-firebase/firestore";

interface Usuario {
  id: string;
  nome: string;
  imagem: string;
  ultimoEnvio?: string;
  totalImgs: number;
  totalDocs: number;
  usedMB: number;
}

export default function UserList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const snapshot = await firestore().collection("usuario").get();
        const lista: Usuario[] = [];

        for (const doc of snapshot.docs) {
          const data = doc.data();
          const uid = data.uid;
          let ultimoEnvio = "Sem registros";
          let totalImgs = 0;
          let totalDocs = 0;
          let totalBytes = 0;

        if (uid) {
          const filesSnapshot = await firestore()
            .collection("files")
            .where("uid", "==", uid)
            .get();

          if (!filesSnapshot.empty) {
            const docsOrdenados = filesSnapshot.docs
              .map((d) => d.data())
              .sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime());

            ultimoEnvio = docsOrdenados[0].dataCadastro;

            filesSnapshot.docs.forEach((fileDoc) => {
              const fileData = fileDoc.data();
              if (fileData.type === "imagem") totalImgs++;
              else totalDocs++;
              totalBytes += fileData.size || 0;
            });
          }
        }

          lista.push({
            id: doc.id,
            nome: data.nome || "Sem nome",
            imagem: data.imagem || "",
            ultimoEnvio,
            totalImgs,
            totalDocs,
            usedMB: Number((totalBytes / (1024 * 1024)).toFixed(2)),
          });
        }

        setUsuarios(lista);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const renderItem = ({ item }: { item: Usuario }) => (
    <View style={styles.card}>
      <Image
        source={
          item.imagem
            ? { uri: item.imagem }
            : require("../assets/images/simbolo-do-usuario.png")
        }
        style={styles.imageUser}
      />
      <View style={{ flex: 1 }}>
        <Text allowFontScaling={false} style={styles.nome}>{item.nome}</Text>
        <Text allowFontScaling={false} style={styles.subInfo}>Último envio: {item.ultimoEnvio}</Text>
      </View>
      <View style={styles.metrics}>
        <Text allowFontScaling={false} style={styles.metricTextBold}>Total utilizado: {item.usedMB} MB</Text>
        <Text allowFontScaling={false} style={styles.metricText}>{item.totalImgs} Imagens</Text>
        <Text allowFontScaling={false} style={styles.metricText}>{item.totalDocs} Documentos</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text allowFontScaling={false}>Carregando usuários...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={usuarios}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => (
        <View style={styles.separator} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 3,
    backgroundColor: "transparent",
  },
  imageUser: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: "#ddd",
  },
  nome: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  subInfo: {
    fontSize: 12,
    color: "#666",
  },
  metrics: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  metricText: {
    fontSize: 13,
    color: "#333",
  },
  metricTextBold: {
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#d1d1d1",
    marginVertical: 6,
  },
});
