import { AUTH_SETTINGS, AUTH_USERID, AUTH_PANELTYPE,AUTH_PAGES_DATA } from "../ActionTypes";

export const AuthReducer = (
  state = {
    authSettings: null,
    authUserId: null,
    authPanelType: null,
    authPagesData:[]
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
      case AUTH_PAGES_DATA:
        return Object.assign({}, state, {
          authPagesData: action.payload.authPagesData,
        });
    default:
      return state;
  }
};
