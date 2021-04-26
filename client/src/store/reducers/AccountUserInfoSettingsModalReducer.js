import {
  ACCOUNT_USERINFO_SETTINGS_MODAL_TOGGLE,
  ACCOUNT_USERINFO_SETTINGS_MODAL_ID,
  ACCOUNT_USERINFO_SETTINGS_MODAL_NAME,
  ACCOUNT_USERINFO_SETTINGS_MODAL_PSEUDONYM,
  ACCOUNT_USERINFO_SETTINGS_MODAL_PICTURE,
  ACCOUNT_USERINFO_SETTINGS_MODAL_EMAIL,
  ACCOUNT_USERINFO_SETTINGS_MODAL_USERNAME,
  ACCOUNT_USERINFO_SETTINGS_MODAL_NUMBER,
  ACCOUNT_USERINFO_SETTINGS_MODAL_CURRENT_PASSWORD,
  ACCOUNT_USERINFO_SETTINGS_MODAL_NEW_PASSWORD,
  ACCOUNT_USERINFO_SETTINGS_MODAL_RESET,
} from "../ActionTypes";

export const AccountUserInfoSettingsModalReducer = (
  state = {
    accountUserInfoSettingsModalToggle: false,
    accountUserInfoSettingsModalId: null,
    accountUserInfoSettingsModalName: "",
    accountUserInfoSettingsModalPseudonym: "",
    accountUserInfoSettingsModalPicture: null,
    accountUserInfoSettingsModalEmail: "",
    accountUserInfoSettingsModalUsername: "",
    accountUserInfoSettingsModalNumber: "",
    accountUserInfoSettingsModalCurrentPassword: "",
    accountUserInfoSettingsModalNewPassword: "",
  },
  action
) => {
  switch (action.type) {
    case ACCOUNT_USERINFO_SETTINGS_MODAL_TOGGLE:
      return Object.assign({}, state, {
        accountUserInfoSettingsModalToggle:
          action.payload.accountUserInfoSettingsModalToggle,
      });
    case ACCOUNT_USERINFO_SETTINGS_MODAL_ID:
      return Object.assign({}, state, {
        accountUserInfoSettingsModalId: action.payload.accountUserInfoSettingsModalId,
      });
    case ACCOUNT_USERINFO_SETTINGS_MODAL_NAME:
      return Object.assign({}, state, {
        accountUserInfoSettingsModalName: action.payload.accountUserInfoSettingsModalName,
      });
    case ACCOUNT_USERINFO_SETTINGS_MODAL_PICTURE:
      return Object.assign({}, state, {
        accountUserInfoSettingsModalPicture:
          action.payload.accountUserInfoSettingsModalPicture,
      });
    case ACCOUNT_USERINFO_SETTINGS_MODAL_PSEUDONYM:
      return Object.assign({}, state, {
        accountUserInfoSettingsModalPseudonym:
          action.payload.accountUserInfoSettingsModalPseudonym,
      });
    case ACCOUNT_USERINFO_SETTINGS_MODAL_EMAIL:
      return Object.assign({}, state, {
        accountUserInfoSettingsModalEmail:
          action.payload.accountUserInfoSettingsModalEmail,
      });
    case ACCOUNT_USERINFO_SETTINGS_MODAL_USERNAME:
      return Object.assign({}, state, {
        accountUserInfoSettingsModalUsername:
          action.payload.accountUserInfoSettingsModalUsername,
      });
    case ACCOUNT_USERINFO_SETTINGS_MODAL_NUMBER:
      return Object.assign({}, state, {
        accountUserInfoSettingsModalNumber:
          action.payload.accountUserInfoSettingsModalNumber,
      });
    case ACCOUNT_USERINFO_SETTINGS_MODAL_CURRENT_PASSWORD:
      return Object.assign({}, state, {
        accountUserInfoSettingsModalCurrentPassword:
          action.payload.accountUserInfoSettingsModalCurrentPassword,
      });
    case ACCOUNT_USERINFO_SETTINGS_MODAL_NEW_PASSWORD:
      return Object.assign({}, state, {
        accountUserInfoSettingsModalNewPassword:
          action.payload.accountUserInfoSettingsModalNewPassword,
      });
    case ACCOUNT_USERINFO_SETTINGS_MODAL_RESET:
      return Object.assign({}, state, {
        accountUserInfoSettingsModalToggle: false,
        accountUserInfoSettingsModalId: null,
        accountUserInfoSettingsModalName: "",
        accountUserInfoSettingsModalPseudonym: "",
        accountUserInfoSettingsModalPicture: null,
        accountUserInfoSettingsModalEmail: "",
        accountUserInfoSettingsModalUsername: "",
        accountUserInfoSettingsModalNumber: "",
        accountUserInfoSettingsModalCurrentPassword: "",
        accountUserInfoSettingsModalNewPassword: "",
      });
    default:
      return state;
  }
};
