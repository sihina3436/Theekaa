
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  where,
  getDocs,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Message, ChatRoom } from "../../types/chat.types";


export const getRoomId = (a: string, b: string): string =>
  [a, b].sort().join("_");


export const subscribeToMessages = (
  roomId: string,
  onUpdate: (messages: Message[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const q = query(
    collection(db, "chats", roomId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Message, "id">),

        createdAt: docSnap.data().createdAt?.toDate?.() ?? new Date(),
      }));

      onUpdate(msgs);
    },
    (error) => {
      console.error("Firestore onSnapshot error:", error.code, error.message);
      onError?.(error);
    }
  );
};


export const sendMessage = async (
  roomId: string,
  senderId: string,
  receiverId: string,
  text: string
): Promise<string> => {
 
  const msgRef = await addDoc(
    collection(db, "chats", roomId, "messages"),
    {
      senderId,
      receiverId,
      text,
      createdAt: serverTimestamp(), 
      read: false,
      status: "sent",
    }
  );


  await setDoc(
    doc(db, "chats", roomId),
    {
      participants: [senderId, receiverId],
      lastMessage: text,
      lastMessageAt: new Date().toISOString(),
      lastSenderId: senderId,
    } satisfies ChatRoom,
    { merge: true }
  );

  return msgRef.id;
};


export const markMessagesAsRead = async (
  roomId: string,
  currentUserId: string
): Promise<void> => {
  const q = query(
    collection(db, "chats", roomId, "messages"),
    where("receiverId", "==", currentUserId),
    where("read", "==", false)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return;

  await Promise.all(
    snapshot.docs.map((msgDoc) =>
      updateDoc(msgDoc.ref, { read: true, status: "read" })
    )
  );
};
