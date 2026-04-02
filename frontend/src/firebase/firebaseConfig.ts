
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);


export const signInToFirebase = async (): Promise<void> => {
  try {
    if (auth.currentUser) return;
    await signInAnonymously(auth);
    console.log("Firebase anonymous auth OK:", auth.currentUser?.uid);
  } catch (error) {
    console.error("Firebase sign-in failed:", error);
  }
};


export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    
    const supported = await isSupported();
    if (!supported) {
      console.warn("FCM not supported in this browser.");
      return null;
    }

    // 2. Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return null;
    }


    if (!("serviceWorker" in navigator)) {
      console.warn("Service workers not supported.");
      return null;
    }

    const swRegistration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    await navigator.serviceWorker.ready; 
    console.log("FCM service worker ready:", swRegistration.scope);

   
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration, // ✅ critical
    });

    if (!token) {
      console.warn("FCM getToken returned empty. Check VAPID key in .env");
      return null;
    }

    console.log("FCM token:", token.slice(0, 24) + "...");
    return token;
  } catch (error) {
    console.error("requestNotificationPermission error:", error);
    return null;
  }
};


export const onForegroundMessage = (callback: (payload: any) => void) => {
  const messaging = getMessaging(app);
  return onMessage(messaging, callback);
};

export default app;
