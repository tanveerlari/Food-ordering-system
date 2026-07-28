// src/menuService.js
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

const ITEMS_COLLECTION = "menuItems";

// Real-time listener — jab bhi items change hon, automatically update mile
export function listenToMenuItems(callback) {
  const itemsRef = collection(db, ITEMS_COLLECTION);
  return onSnapshot(itemsRef, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(items);
  });
}

export async function addMenuItem(item) {
  await addDoc(collection(db, ITEMS_COLLECTION), item);
}

export async function updateMenuItem(itemId, updatedData) {
  const itemRef = doc(db, ITEMS_COLLECTION, itemId);
  await updateDoc(itemRef, updatedData);
}

export async function deleteMenuItem(itemId) {
  const itemRef = doc(db, ITEMS_COLLECTION, itemId);
  await deleteDoc(itemRef);
}