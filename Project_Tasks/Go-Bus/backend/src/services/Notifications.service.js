import { Notification } from "../models/Notification.model.js";
export const createNotification = async (
  userId,
  tripId,
  bookingId,
  title,
  message,
) => {
  const notification = await Notification.create({
    userId,
    tripId,
    bookingId,
    title,
    message,
  });
  return notification;
};
export const getMyNotifications = async (userId) => {
  const notifications = await Notification.find({ userId }).sort({
    createdAt: -1,
  });

  return notifications;
};
export const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
    },
  );

  return notification;
};
