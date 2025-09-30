// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIlSKMkFIyY1OFYqqImwx5Lo2nHW5Foss",
  authDomain: "studio-1f95z.firebaseapp.com",
  projectId: "studio-1f95z",
  storageBucket: "studio-1f95z.firebasestorage.app",
  messagingSenderId: "922681782984",
  appId: "1:922681782984:web:d3840713be209e4a60abfd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

// Function to get FCM token
export async function getFCMToken() {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BJ3SXe0Nof9H4KJpvgG80LVUeDTNxdh0O2z3aOIzEzrFxd3bAn4ixhhouG7VV11zmK8giQ-UUGWeAP3JK8MpbXk"
    });
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

// Function to handle foreground messages
export function onForegroundMessage(callback) {
  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    callback(payload);
  });
}

export { messaging, app };
