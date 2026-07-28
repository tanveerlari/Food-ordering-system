// src/imageUploadService.js
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadMenuImage(file) {
  const fileName = `menu-images/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}