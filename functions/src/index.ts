import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import {Storage} from "@google-cloud/storage";

admin.initializeApp();

const db = admin.firestore();
const storage = new Storage();
const BUCKET_NAME = "eu-trabalhador.firebasestorage.app";

async function atualizarTamanhoStorage(userId: string, deltaBytes: number) {
  console.log(`Atualizando storage para usuário ${userId} com deltaBytes = ${deltaBytes}`);

  const userStorageRef = db.collection("storageUsage").doc(userId);
  const totalStorageRef = db.collection("storageUsage").doc("total");

  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userStorageRef);
    const totalDoc = await transaction.get(totalStorageRef);

    const atualUserBytes = userDoc.exists ? userDoc.data()?.usedBytes || 0 : 0;
    const atualTotalBytes = totalDoc.exists ? totalDoc.data()?.usedBytes || 0 : 0;

    const novoUserTotal = atualUserBytes + deltaBytes;
    const novoTotal = atualTotalBytes + deltaBytes;

    console.log(`Usuário: atual=${atualUserBytes} bytes, novo=${novoUserTotal} bytes`);
    console.log(`Total geral: atual=${atualTotalBytes} bytes, novo=${novoTotal} bytes`);

    transaction.set(userStorageRef, {usedBytes: Math.max(novoUserTotal, 0)}, {merge: true});
    transaction.set(totalStorageRef, {usedBytes: Math.max(novoTotal, 0)}, {merge: true});
  });
}

export const onFileUpload = functions.storage.onObjectFinalized(async (event) => {
  const object = event.data;

  if (!object || !object.name || !object.bucket) {
    console.log("Objeto inválido no onFileUpload:", object);
    return;
  }

  if (object.bucket !== BUCKET_NAME) {
    console.log(`Bucket ignorado no onFileUpload: ${object.bucket}`);
    return;
  }

  const pathParts = object.name.split("/");
  if (pathParts.length < 2) {
    console.log(`Nome do arquivo inválido no onFileUpload: ${object.name}`);
    return;
  }

  const userId = pathParts[1];
  const size = Number(object.size) || 0;

  console.log(`Arquivo enviado: userId=${userId}, size=${size} bytes`);

  await atualizarTamanhoStorage(userId, size);
});

export const onFileDelete = functions.storage.onObjectDeleted(async (event) => {
  const object = event.data;

  if (!object || !object.name || !object.bucket) {
    console.log("Objeto inválido no onFileDelete:", object);
    return;
  }

  if (object.bucket !== BUCKET_NAME) {
    console.log(`Bucket ignorado no onFileDelete: ${object.bucket}`);
    return;
  }

  const pathParts = object.name.split("/");
  if (pathParts.length < 2) {
    console.log(`Nome do arquivo inválido no onFileDelete: ${object.name}`);
    return;
  }

  const userId = pathParts[1];
  const size = Number(object.size) || 0;

  console.log(`Arquivo deletado: userId=${userId}, size=${size} bytes`);

  await atualizarTamanhoStorage(userId, -size);
});

export const recalcularUsoStorage = functions.https.onRequest(async (req, res) => {
  try {
    console.log("Iniciando varredura para recalcular uso de storage...");
    const [files] = await storage.bucket(BUCKET_NAME).getFiles();

    const usageMap: Record<string, number> = {};

    for (const file of files) {
      const pathParts = file.name.split("/");
      if (pathParts.length < 2) continue;

      const userId = pathParts[1];
      await file.getMetadata();
      const size = Number(file.metadata.size) || 0;

      usageMap[userId] = (usageMap[userId] || 0) + size;
    }

    console.log(`Usuários encontrados na varredura: ${Object.keys(usageMap).length}`);

    const batch = db.batch();
    let totalBytes = 0;

    for (const userId in usageMap) {
      if (Object.prototype.hasOwnProperty.call(usageMap, userId)) {
        const docRef = db.collection("storageUsage").doc(userId);
        batch.set(docRef, {usedBytes: usageMap[userId]}, {merge: true});
        console.log(`Atualizando ${userId} com ${usageMap[userId]} bytes`);
        totalBytes += usageMap[userId];
      }
    }

    // Atualiza também o documento 'total' com a soma geral
    const totalRef = db.collection("storageUsage").doc("total");
    batch.set(totalRef, {usedBytes: totalBytes}, {merge: true});
    console.log(`Atualizando total geral com ${totalBytes} bytes`);

    await batch.commit();

    console.log("Recalculo de uso de storage finalizado com sucesso.");
    res.status(200).send(`Recalculated storage usage for ${Object.keys(usageMap).length} users.`);
  } catch (error) {
    console.error("Error recalculating storage usage:", error);
    res.status(500).send("Failed to recalculate storage usage.");
  }
});
