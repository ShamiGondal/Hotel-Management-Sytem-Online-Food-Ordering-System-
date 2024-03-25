// NotificationService.js

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


const sendNotification = async (type, message) => {
  const apiUri = import.meta.env.VITE_REACT_APP_API_URL;
  try {
      const token = Cookies.get('token');
      const decodedToken = token ? jwtDecode(token) : null;
      console.log(decodedToken)
      const customerId = decodedToken ? decodedToken.userID : null;
      const response = await fetch(`${apiUri}api/notifications`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_id: customerId,
            type: type,
            message: message
          }),
      });

      const data = await response.json();
      console.log('Notification sent successfully:', data);
  } catch (error) {
      console.error('Error sending notification:', error);
  }
};

export default sendNotification;
