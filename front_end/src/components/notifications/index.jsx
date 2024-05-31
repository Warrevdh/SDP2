import { useCallback, useContext, useEffect, useState } from "react"
import * as notificationsAPI from "../../api/notifications";
import Notification from "./notification";
import "./index.scss";
import { UserContext } from "../../context/UserProvider";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const {userToken, user} = useContext(UserContext);

  useEffect(() => {
    const getNotifications = async () => {
      return await notificationsAPI.getNotificationsFromCompany(user.companyId, userToken);
    };

    getNotifications().then((data) => {
      setNotifications(data);
    });
  }, [user.companyId, userToken]);

  const deleteNotification = useCallback((id) => {
    try {
      //delete from database
      // nog te implementeren
      const deleteNotification = async () => {
        return await notificationsAPI.deleteNotification(id, userToken);
      };

      deleteNotification();
    
      setNotifications((prevNotifications) => (
        prevNotifications.filter((notification) => notification.notificationId !== id)
      ));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSeen = useCallback((id) => {
    try {
      const notification = notifications.find((notification) => notification.notificationId === id);
      const updatedNotification = {
        title : notification.title,
        shortMessage : notification.shortMessage,
        longMessage : notification.longMessage,
        seen : true
      };

      const updateNotification = async () => {
        return await notificationsAPI.updateNotification(id, updatedNotification, userToken);
      };

      updateNotification();

      setNotifications((prevNotifications) => (
        prevNotifications.map((notification) => {
          if (notification.notificationId === id) {
            notification.seen = true;
          }
          return notification;
        })
      ));
    } catch (error) {
      console.log(error);
    }
  }, [notifications, userToken]);
  
  const handleSelect = useCallback((value) => {
    setSelectedNotification(value);
  }, []);

  return (
    <article className="notificationOverview">
      <ul data-cy="notification-overview">
        {notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .filter((notification) => {
            if (selectedNotification) {
              return notification.notificationId === selectedNotification;
            }
            return true;
          })
          .map((notification) => {
            return (
              <Notification key={notification.notificationId}
                notification={notification} 
                deleteNotification={deleteNotification}
                seenNotification={handleSeen}
                selected={notification.notificationId === selectedNotification}
                handleSelect={handleSelect}/>
          );
        })}
      </ul>
    </article>
  )
}

export default NotificationList;