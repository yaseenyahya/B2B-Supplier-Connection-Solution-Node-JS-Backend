import {
  NOTIFICATION_MENU_ANCHOR_EL,
  NOTIFICATION_MENU_DATA,
  NOTIFICATION_MENU_SHOW_ALERT,
} from "../ActionTypes";

export const NotificationMenuReducer = (
  state = {
    notificationMenuAnchorEl: null,
    notificationMenuData: [],
    notificationMenuShowAlert: false,
  },
  action
) => {
  switch (action.type) {
    case NOTIFICATION_MENU_ANCHOR_EL:
      return Object.assign({}, state, {
        notificationMenuAnchorEl: action.payload.notificationMenuAnchorEl,
      });
    case NOTIFICATION_MENU_DATA:
      return Object.assign({}, state, {
        notificationMenuData: action.payload.notificationMenuData,
      });
    case NOTIFICATION_MENU_SHOW_ALERT:
      return Object.assign({}, state, {
        notificationMenuShowAlert: action.payload.notificationMenuShowAlert,
      });
    default:
      return state;
  }
};
