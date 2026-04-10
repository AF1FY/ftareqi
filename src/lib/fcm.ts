import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { postDataAsync } from "./actions/Base.actions";

export const requestForToken = async () => {
    try {
        const msg = await messaging();
        if (!msg) {
            console.log("Firebase Messaging is not supported in this browser.");
            return null;
        }

        const currentToken = await getToken(msg, {
            vapidKey: "BFZzDYKhXX-eJ7TmgBJ3HQJTef_qp1_jFclp61gO2Y5ZOiAxo_dXAFo9Vyr9vHd82CgPKBJ9o2jzMRR5t1MR2PA",
        });

        if (currentToken) {
            console.log("Current token for client: ", currentToken);
            return currentToken;
        } else {
            console.log("No registration token available. Request permission to generate one.");
            return null;
        }
    } catch (err) {
        console.error("An error occurred while retrieving token. ", err);
        return null;
    }
};

export const registerFcmToken = async (token: string) => await postDataAsync('api/Notification/register-fcm-token',{token});
export const deactivateFcmToken = async (token: string) => await postDataAsync('api/Notification/deactivate-fcm-token',{token});