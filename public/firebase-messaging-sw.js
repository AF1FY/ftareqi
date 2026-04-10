// public/firebase-messaging-sw.js

// Import Firebase scripts for the service worker
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker
// MUST match the config in your firebase.ts file
firebase.initializeApp({
    apiKey: "AIzaSyCCelR1_F4_zhM12IMXSwKqlKgflR7CcA0",
    authDomain: "ftareqi-80377.firebaseapp.com",
    projectId: "ftareqi-80377",
    storageBucket: "ftareqi-80377.firebasestorage.app",
    messagingSenderId: "1084697068747",
    appId: "1:1084697068747:web:c89fce878f387a8305874e",
    measurementId: "G-FPQXKLN67K"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message: ", payload);

    // Customize the notification UI here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/icon.png", // Path to your app icon in the public folder
    };

    // Show the notification natively
    self.registration.showNotification(notificationTitle, notificationOptions);
});