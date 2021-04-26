import {
  USER_PANEL_NOTIFICATION_COUNT,
  USER_PANEL_CHAT_ONLINE,
  USER_PANEL_FULLSCREEN_TOGGLE,
  USER_PANEL_APPBAR_HEIGHT,
  USER_PANEL_PROFILE_PIC_MENU_ANCHOR_EL,
  USER_PANEL_SETTINGS_MENU_ANCHOR_EL,
  USER_PANEL_WS_SUBSCRIPTION_READY

} from "../ActionTypes";
import {LocalStorage} from "../../auth/LocalStorage";

export const setUserPanelNotificationCount = (userPanelNotificationCount) => {
  return {
    type: USER_PANEL_NOTIFICATION_COUNT,
    payload: {
      userPanelNotificationCount: userPanelNotificationCount,
    },
  };
};
export const setUserPanelChatOnline = (userPanelChatOnline) => {

LocalStorage.setUserPanelChatOnline(userPanelChatOnline);
  return {
    type: USER_PANEL_CHAT_ONLINE,
    payload: {
      userPanelChatOnline: userPanelChatOnline,
    },
  };
};
export const setUserPanelFullscreenToggle = (userPanelFullscreenToggle) => {
  return {
    type: USER_PANEL_FULLSCREEN_TOGGLE,
    payload: {
      userPanelFullscreenToggle: userPanelFullscreenToggle,
    },
  };
};
export const setUserPanelAppBarHeight = (userPanelAppBarHeight) => {
  return {
    type: USER_PANEL_APPBAR_HEIGHT,
    payload: {
      userPanelAppBarHeight: userPanelAppBarHeight,
    },
  };
};
export const setUserPanelSettingsMenuAnchorEl = (userPanelSettingsMenuAnchorEl) => {
  return {
    type: USER_PANEL_SETTINGS_MENU_ANCHOR_EL,
    payload: {
      userPanelSettingsMenuAnchorEl: userPanelSettingsMenuAnchorEl,
    },
  };
};
export const setUserPanelProfilePicMenuAnchorEl = (
  userPanelProfilePicMenuAnchorEl
) => {
  return {
    type: USER_PANEL_PROFILE_PIC_MENU_ANCHOR_EL,
    payload: {
      userPanelProfilePicMenuAnchorEl: userPanelProfilePicMenuAnchorEl,
    },
  };
};
export const setUserpanelWsSubscriptionReady = (
  userpanelWsSubscriptionReady
) => {
  return {
    type: USER_PANEL_WS_SUBSCRIPTION_READY,
    payload: {
      userpanelWsSubscriptionReady: userpanelWsSubscriptionReady,
    },
  };
};
