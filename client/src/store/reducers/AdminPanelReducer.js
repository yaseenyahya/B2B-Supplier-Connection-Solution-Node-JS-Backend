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

export const AdminPanelReducer = (
  
  state = {
    adminPanelDrawerToggle: true,
    adminPanelClosedDrawerToggle:false,
    adminPanelActiveLink: 0,
    adminPanelNotificationCount: 0,
    adminPanelChatOnline: LocalStorage.getAdminPanelChatOnline(),
    adminPanelFullscreenToggle: false,
    adminPanelAppBarHeight: 64,
    adminPanelProfilePicMenuAnchorEl: null,
    adminPanelSettingsMenuAnchorEl:null,
    adminPanelDrawerWidth:240
  },
  action
) => {
  switch (action.type) {
    case ADMIN_PANEL_DRAWER_TOGGLE:
      return Object.assign({}, state, {
        adminPanelDrawerToggle: action.payload.adminPanelDrawerToggle,
      });
      case ADMIN_PANEL_CLOSED_DRAWER_TOGGLE:
        return Object.assign({}, state, {
          adminPanelClosedDrawerToggle: action.payload.adminPanelClosedDrawerToggle,
        });
    case ADMIN_PANEL_ACTIVE_LINK:
      return Object.assign({}, state, {
        adminPanelActiveLink: action.payload.adminPanelActiveLink,
      });
    case ADMIN_PANEL_NOTIFICATION_COUNT:
      return Object.assign({}, state, {
        adminPanelNotificationCount: action.payload.adminPanelNotificationCount,
      });
    case ADMIN_PANEL_CHAT_ONLINE:
      return Object.assign({}, state, {
        adminPanelChatOnline: action.payload.adminPanelChatOnline,
      });
    case ADMIN_PANEL_FULLSCREEN_TOGGLE:
      return Object.assign({}, state, {
        adminPanelFullscreenToggle: action.payload.adminPanelFullscreenToggle,
      });
    case ADMIN_PANEL_APPBAR_HEIGHT:
      return Object.assign({}, state, {
        adminPanelAppBarHeight: action.payload.adminPanelAppBarHeight,
      });
      case ADMIN_PANEL_SETTINGS_MENU_ANCHOR_EL:
        return Object.assign({}, state, {
          adminPanelSettingsMenuAnchorEl: action.payload.adminPanelSettingsMenuAnchorEl,
        });
    case ADMIN_PANEL_PROFILE_PIC_MENU_ANCHOR_EL:
      return Object.assign({}, state, {
        adminPanelProfilePicMenuAnchorEl:
          action.payload.adminPanelProfilePicMenuAnchorEl,
      });
      
    default:
      return state;
  }
};
