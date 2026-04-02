
import { useEffect } from "react";
import axios from "axios";
import { requestNotificationPermission } from "../firebase/firebaseConfig";
import { getBaseURL } from "../utils/baseURL";


const useInitFCM = (userId: string | undefined) => {
  useEffect(() => {
    if (!userId) return;

    const initToken = async () => {
      const token = await requestNotificationPermission();

      if (!token) {
        return;
      }

      try {
        await axios.post(
          `${getBaseURL()}/api/messages/fcm-token`,
          { userId, token },
          { withCredentials: true }
        );
        console.log("FCM token saved to backend.");
      } catch (error) {
       
        console.error("Failed to save FCM token to backend:", error);
      }
    };

    initToken();
  }, [userId]);
};

export default useInitFCM;
