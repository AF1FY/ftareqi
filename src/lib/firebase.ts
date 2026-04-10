import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCCelR1_F4_zhM12IMXSwKqlKgflR7CcA0",
    authDomain: "ftareqi-80377.firebaseapp.com",
    projectId: "ftareqi-80377",
    storageBucket: "ftareqi-80377.firebasestorage.app",
    messagingSenderId: "1084697068747",
    appId: "1:1084697068747:web:c89fce878f387a8305874e",
    measurementId: "G-FPQXKLN67K"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const messaging = async () => {
    if (typeof window !== "undefined") {
        const supported = await isMessagingSupported();
        if (supported) {
            return getMessaging(app);
        }
    }
    return null;
};

export const analytics = async () => {
    if (typeof window !== "undefined") {
        const supported = await isAnalyticsSupported();
        if (supported) {
            return getAnalytics(app);
        }
    }
    return null;
};

export { app };