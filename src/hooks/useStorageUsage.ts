import { useEffect, useState } from "react";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export function useStorageUsage() {
  const [totalGB, setTotalGB] = useState<number | null>(null);

  useEffect(() => {
    const calcularUsoStorage = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) {
          console.log("Usuário não autenticado");
          setTotalGB(null);
          return;
        }

        // Buscar dados do usuário para verificar se é admin
        const userDoc = await firestore().collection("usuario").doc(currentUser.uid).get();
        const userData = userDoc.data();

        if (!userData || userData.acesso !== 2) {
          // Usuário não é admin, não calcula o total
          setTotalGB(null);
          return;
        }

        // Pasta raiz "files"
        const rootRef = storage().ref("files");

        let totalBytes = 0;

        // Função recursiva para somar arquivos e subpastas
        const processFolder = async (folderRef: any) => {
          const listResult = await folderRef.listAll();

          // Somar arquivos da pasta atual
          for (const item of listResult.items) {
            const metadata = await item.getMetadata();
            if (metadata.size) {
              totalBytes += Number(metadata.size);
            }
          }

          // Recursão nas subpastas
          for (const prefix of listResult.prefixes) {
            await processFolder(prefix);
          }
        };

        await processFolder(rootRef);

        // Converte bytes para GB e arredonda
        const total = totalBytes / (1024 ** 3);
        setTotalGB(Number(total.toFixed(2)));

      } catch (error) {
        console.error("Erro ao calcular uso de storage:", error);
        setTotalGB(null);
      }
    };

    calcularUsoStorage();
  }, []);

  return totalGB;
}
