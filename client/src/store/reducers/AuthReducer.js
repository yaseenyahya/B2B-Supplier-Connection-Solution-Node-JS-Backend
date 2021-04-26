import { AUTH_SETTINGS, AUTH_USERID, AUTH_PANELTYPE } from "../ActionTypes";

export const AuthReducer = (
  state = {
    authSettings: null,
    authUserId: null,
    authPanelType: null,
  },
  action
) => {
  switch (action.type) {
    case AUTH_SETTINGS:
      return Object.assign({}, state, {
        authSettings: action.payload.authSettings,
      });
    case AUTH_USERID:
      return Object.assign({}, state, {
        authUserId: action.payload.authUserId,
      });
    case AUTH_PANELTYPE:
      return Object.assign({}, state, {
        authPanelType: action.payload.authPanelType,
      });
    default:
      return state;
  }
};
