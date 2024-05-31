const { getLogger } = require("../core/logger.js");
const { getPrisma } = require("../data/index.js");
const { getChildLogger } = require("../core/logger.js");
const ServiceError = require("../core/serviceError");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const getAllNotificationsFromCompany = async (companyId) => {
  debugLog("Get all notifications from company", {
    companyId,
  });
  try {
    const company = await getPrisma().company.findUnique({
      where: {
        companyId: companyId,
      },
    });
    if (!company) {
      throw ServiceError.notFound("Company not found", { companyId });
    }
    const notifications = await getPrisma().notification.findMany({
      where: {
        companyId: companyId,
      },
    });
    return notifications;
  } catch (error) {
    const logger = getChildLogger("notification-service");
    logger.error("Failed to get all notifications from user", {
      error,
    });
    throw error;
  }
};

const editNotification = async (
  notificationId,
  { title, shortMessage, longMessage, seen }
) => {
  debugLog("Edit notification", {
    notificationId,
    title,
    shortMessage,
    longMessage,
    seen,
  });
  try {
    const existingNotification = await getPrisma().notification.findUnique({
      where: {
        notificationId: notificationId,
      },
    });
    if (!existingNotification) {
      throw ServiceError.notFound("Notification not found", {
        notificationId,
      });
    }
    const notification = await getPrisma().notification.update({
      where: {
        notificationId: notificationId,
      },
      data: {
        title: title,
        shortMessage: shortMessage,
        longMessage: longMessage,
        seen: seen,
      },
    });
    return notification;
  } catch (error) {
    const logger = getChildLogger("notification-service");
    logger.error("Failed to edit notification", {
      error,
    });
    throw error;
  }
};

const deleteNotification = async (notificationId) => {
  debugLog("Delete notification", {
    notificationId,
  });
  try {
    const notification = await getPrisma().notification.delete({
      where: {
        notificationId: notificationId,
      },
    });
    return notification;
  } catch (error) {
    const logger = getChildLogger("notification-service");
    logger.error("Failed to delete notification", {
      error,
    });
    throw error;
  }
};

module.exports = {
  getAllNotificationsFromCompany,
  editNotification,
  deleteNotification,
};
