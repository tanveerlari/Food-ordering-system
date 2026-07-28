// src/orderService.js
import { db } from "./firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";

const ORDERS_COLLECTION = "activeOrders";

export async function createOrderInFirestore(orderId, orderData) {
  await setDoc(doc(db, ORDERS_COLLECTION, orderId), orderData);
}

export async function updateOrderStatusInFirestore(orderId, status) {
  await setDoc(doc(db, ORDERS_COLLECTION, orderId), { status }, { merge: true });
}

export function listenToOrder(orderId, callback) {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  return onSnapshot(orderRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    }
  });
}

export function listenToAllOrders(callback) {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  return onSnapshot(ordersRef, (snapshot) => {
    const orders = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(orders);
  });
}

export async function clearOrderInFirestore(orderId) {
  await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
}