import {
  USER_PANEL_NOTIFICATION_COUNT,
  USER_PANEL_CHAT_ONLINE,
  USER_PANEL_FULLSCREEN_TOGGLE,
  USER_PANEL_APPBAR_HEIGHT,
  USER_PANEL_PROFILE_PIC_MENU_ANCHOR_EL,
  USER_PANEL_SETTINGS_MENU_ANCHOR_EL,
  USER_PANEL_WS_SUBSCRIPTION_READY
} from "../ActionTypes";
import { LocalStorage } from "../../auth/LocalStorage";

export const UserPanelReducer = (
  state = {
    userPanelNotificationCount: 0,
    userPanelChatOnline: LocalStorage.getUserPanelChatOnline(),
    userPanelFullscreenToggle: false,
    userPanelAppBarHeight: 64,
    userPanelProfilePicMenuAnchorEl: null,
    userPanelSettingsMenuAnchorEl: null,
    userpanelWsSubscriptionReady:false
  },
  action
) => {
  switch (action.type) {

    case USER_PANEL_NOTIFICATION_COUNT:
      return Object.assign({}, state, {
        userPanelNotificationCount: action.payload.userPanelNotificationCount,
      });
    case USER_PANEL_CHAT_ONLINE:
      return Object.assign({}, state, {
        userPanelChatOnline: action.payload.userPanelChatOnline,
      });
    case USER_PANEL_FULLSCREEN_TOGGLE:
      return Object.assign({}, state, {
        userPanelFullscreenToggle: action.payload.userPanelFullscreenToggle,
      });
    case USER_PANEL_APPBAR_HEIGHT:
      return Object.assign({}, state, {
        userPanelAppBarHeight: action.payload.userPanelAppBarHeight,
      });
    case USER_PANEL_SETTINGS_MENU_ANCHOR_EL:
      return Object.assign({}, state, {
        userPanelSettingsMenuAnchorEl:
          action.payload.userPanelSettingsMenuAnchorEl,
      });
    case USER_PANEL_PROFILE_PIC_MENU_ANCHOR_EL:
      return Object.assign({}, state, {
        userPanelProfilePicMenuAnchorEl:
          action.payload.userPanelProfilePicMenuAnchorEl,
      });
      case USER_PANEL_WS_SUBSCRIPTION_READY:
        return Object.assign({}, state, {
          userpanelWsSubscriptionReady:
            action.payload.userpanelWsSubscriptionReady,
        });
    default:
      return state;
  }
};
