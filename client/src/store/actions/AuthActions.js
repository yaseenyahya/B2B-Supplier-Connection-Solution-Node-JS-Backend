import {
  AUTH_SETTINGS, AUTH_USERID,AUTH_PANELTYPE
} from "../ActionTypes";

export const setAuthSettings = (authSettings) => {
  return {
    type: AUTH_SETTINGS,
    payload: {
      authSettings: authSettings,
    },
  };
};
export const setAuthPanelType = (authPanelType) => {
  return {
    type: AUTH_PANELTYPE,
    payload: {
      authPanelType: authPanelType,
    },
  };
};
export const setAuthUserId = (
  authUserId
) => {
  return {
    type: AUTH_USERID,
    payload: {
      authUserId: authUserId,
    },
  };
};
