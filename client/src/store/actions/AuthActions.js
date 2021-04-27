import {
  AUTH_SETTINGS, AUTH_USERID,AUTH_PANELTYPE,
  AUTH_PAGES_DATA
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
export const setAuthPagesData = (
  authPagesData
) => {
  return {
    type: AUTH_PAGES_DATA,
    payload: {
      authPagesData: authPagesData,
    },
  };
};
