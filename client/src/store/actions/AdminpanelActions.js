import {
  ADMIN_PANEL_DRAWER_TOGGLE,
  ADMIN_PANEL_CLOSED_DRAWER_TOGGLE,
  ADMIN_PANEL_ACTIVE_LINK,
  ADMIN_PANEL_NOTIFICATION_COUNT,
  ADMIN_PANEL_CHAT_ONLINE,
  ADMIN_PANEL_FULLSCREEN_TOGGLE,
  ADMIN_PANEL_APPBAR_HEIGHT,
  ADMIN_PANEL_PROFILE_PIC_MENU_ANCHOR_EL,
  ADMIN_PANEL_SETTINGS_MENU_ANCHOR_EL
} from "../ActionTypes";
import {LocalStorage} from "../../auth/LocalStorage";
export const setAdminPanelDrawerToggle = (adminPanelDrawerToggle) => {
  return {
    type: ADMIN_PANEL_DRAWER_TOGGLE,
    payload: {
      adminPanelDrawerToggle: adminPanelDrawerToggle,
    },
  };
};
export const setAdminPanelClosedDrawerToggle = (
  adminPanelClosedDrawerToggle
) => {
  return {
    type: ADMIN_PANEL_CLOSED_DRAWER_TOGGLE,
    payload: {
      adminPanelClosedDrawerToggle: adminPanelClosedDrawerToggle,
    },
  };
};
export const setAdminPanelActiveLink = (adminPanelActiveLink) => {
  return {
    type: ADMIN_PANEL_ACTIVE_LINK,
    payload: {
      adminPanelActiveLink: adminPanelActiveLink,
    },
  };
};
export const setAdminPanelNotificationCount = (adminPanelNotificationCount) => {
  return {
    type: ADMIN_PANEL_NOTIFICATION_COUNT,
    payload: {
      adminPanelNotificationCount: adminPanelNotificationCount,
    },
  };
};
export const setAdminPanelChatOnline = (adminPanelChatOnline) => {

LocalStorage.setAdminPanelChatOnline(adminPanelChatOnline);
  return {
    type: ADMIN_PANEL_CHAT_ONLINE,
    payload: {
      adminPanelChatOnline: adminPanelChatOnline,
    },
  };
};
export const setAdminPanelFullscreenToggle = (adminPanelFullscreenToggle) => {
  return {
    type: ADMIN_PANEL_FULLSCREEN_TOGGLE,
    payload: {
      adminPanelFullscreenToggle: adminPanelFullscreenToggle,
    },
  };
};
export const setAdminPanelAppBarHeight = (adminPanelAppBarHeight) => {
  return {
    type: ADMIN_PANEL_APPBAR_HEIGHT,
    payload: {
      adminPanelAppBarHeight: adminPanelAppBarHeight,
    },
  };
};
export const setAdminPanelSettingsMenuAnchorEl = (adminPanelSettingsMenuAnchorEl) => {
  return {
    type: ADMIN_PANEL_SETTINGS_MENU_ANCHOR_EL,
    payload: {
      adminPanelSettingsMenuAnchorEl: adminPanelSettingsMenuAnchorEl,
    },
  };
};
export const setAdminPanelProfilePicMenuAnchorEl = (
  adminPanelProfilePicMenuAnchorEl
) => {
  return {
    type: ADMIN_PANEL_PROFILE_PIC_MENU_ANCHOR_EL,
    payload: {
      adminPanelProfilePicMenuAnchorEl: adminPanelProfilePicMenuAnchorEl,
    },
  };
};
