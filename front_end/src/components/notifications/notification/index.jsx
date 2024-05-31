import "./index.scss";
import {FiX} from "react-icons/fi";

const dateFormat = new Intl.DateTimeFormat('nl-BE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const Notification = ({ notification, deleteNotification, seenNotification, selected=false, handleSelect}) => {
  const handleDelete = () => {
    deleteNotification(notification.notificationId);
    if (selected) handleSelect(null);
  };

  const handleSeen = () => {
    if (!notification.seen)
      seenNotification(notification.notificationId);
  };

  const handleClick = () => {
    handleSelect(selected ? null : notification.notificationId);
    handleSeen();
  };
  
  return (
    <div>
      {selected && <div><button className="backButton" onClick={handleClick} data-cy="back-button">Back</button></div>}
      <div className="notification">
        <li className={notification.seen ? "notificationSeen" : "notificationUnseen"} data-cy="notification">
          <div className="topNotification">
            <div className="notification__date" data-cy="notification-date">
            {dateFormat.format(new Date(notification.createdAt)) === dateFormat.format(new Date()) ? "Today" : dateFormat.format(new Date(notification.createdAt))}
            </div>
            <div>
              <FiX className="deleteNotificationButton" size={20}
                onClick={handleDelete}
                data-cy="button-delete-notification"></FiX>
            </div>
          </div>

          <p className="notification__contents"
            data-cy="notification-contents">
            {selected ? notification.longMessage : notification.shortMessage}
          </p>
          
          {!selected && <div className="detailsContainer">
            <button className="notification__detailsButton" data-cy="notification-button-details" 
              onClick={handleClick}>Details &gt;
            </button>
          </div>}
        </li>
      </div>
      
    </div>
  );
};

export default Notification;