// src/orderHistoryService.js
import { db } from "./firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";

const HISTORY_COLLECTION = "orderHistory";

export async function saveCompletedOrder(orderData) {
  await addDoc(collection(db, HISTORY_COLLECTION), orderData);
}

export function listenToUserOrders(email, callback) {
  const q = query(
    collection(db, HISTORY_COLLECTION),
    where("customerEmail", "==", email),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(orders);
  });
}