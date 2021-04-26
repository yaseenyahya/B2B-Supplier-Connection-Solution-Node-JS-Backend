import {
  NOTIFICATION_MENU_ANCHOR_EL,
  NOTIFICATION_MENU_DATA,
  NOTIFICATION_MENU_SHOW_ALERT,
} from "../ActionTypes";

export const setNotificationMenuAnchorEl = (notificationMenuAnchorEl) => {
  return {
    type: NOTIFICATION_MENU_ANCHOR_EL,
    payload: {
      notificationMenuAnchorEl: notificationMenuAnchorEl,
    },
  };
};
export const setNotificationMenuData = (notificationMenuData) => {
  return {
    type: NOTIFICATION_MENU_DATA,
    payload: {
      notificationMenuData: notificationMenuData,
    },
  };
};
export const setNotificationMenuShowAlert = (notificationMenuShowAlert) => {
  return {
    type: NOTIFICATION_MENU_SHOW_ALERT,
    payload: {
      notificationMenuShowAlert: notificationMenuShowAlert,
    },
  };
};
