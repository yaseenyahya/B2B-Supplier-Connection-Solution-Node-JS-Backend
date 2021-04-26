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

export const setAccountUserInfoSettingsModalToggle = (
  accountUserInfoSettingsModalToggle
) => {
  return {
    type: ACCOUNT_USERINFO_SETTINGS_MODAL_TOGGLE,
    payload: {
      accountUserInfoSettingsModalToggle: accountUserInfoSettingsModalToggle,
    },
  };
};
export const setAccountUserInfoSettingsModalId = (
  accountUserInfoSettingsModalId
) => {
  return {
    type: ACCOUNT_USERINFO_SETTINGS_MODAL_ID,
    payload: {
      accountUserInfoSettingsModalId: accountUserInfoSettingsModalId,
    },
  };
};
export const setAccountUserInfoSettingsModalName = (
  accountUserInfoSettingsModalName
) => {
  return {
    type: ACCOUNT_USERINFO_SETTINGS_MODAL_NAME,
    payload: {
      accountUserInfoSettingsModalName: accountUserInfoSettingsModalName,
    },
  };
};
export const setAccountUserInfoSettingsModalPseudonym = (
  accountUserInfoSettingsModalPseudonym
) => {
  return {
    type: ACCOUNT_USERINFO_SETTINGS_MODAL_PSEUDONYM,
    payload: {
      accountUserInfoSettingsModalPseudonym: accountUserInfoSettingsModalPseudonym,
    },
  };
};
export const setAccountUserInfoSettingsModalPicture = (accountUserInfoSettingsModalPicture) => {
  return {
    type: ACCOUNT_USERINFO_SETTINGS_MODAL_PICTURE,
    payload: {
      accountUserInfoSettingsModalPicture: accountUserInfoSettingsModalPicture,
    },
  };
};
export const setAccountUserInfoSettingsModalEmail = (
  accountUserInfoSettingsModalEmail
) => {
  return {
    type: ACCOUNT_USERINFO_SETTINGS_MODAL_EMAIL,
    payload: {
      accountUserInfoSettingsModalEmail: accountUserInfoSettingsModalEmail,
    },
  };
};
export const setAccountUserInfoSettingsModalUsername = (
  accountUserInfoSettingsModalUsername
) => {
  return {
    type: ACCOUNT_USERINFO_SETTINGS_MODAL_USERNAME,
    payload: {
      accountUserInfoSettingsModalUsername: accountUserInfoSettingsModalUsername,
    },
  };
};
export const setAccountUserInfoSettingsModalNumber = (
  accountUserInfoSettingsModalNumber
) => {
  return {
    type: ACCOUNT_USERINFO_SETTINGS_MODAL_NUMBER,
    payload: {
      accountUserInfoSettingsModalNumber: accountUserInfoSettingsModalNumber,
    },
  };
};
export const setAccountUserInfoSettingsModalCurrentPassword = (
  accountUserInfoSettingsModalCurrentPassword
) => {
  return {
    type: ACCOUNT_USERINFO_SETTINGS_MODAL_CURRENT_PASSWORD,
    payload: {
      accountUserInfoSettingsModalCurrentPassword: accountUserInfoSettingsModalCurrentPassword,
    },
  };
};
export const setAccountUserInfoSettingsModalNewPassword = (
  accountUserInfoSettingsModalNewPassword
) => {
  return {
    type: ACCOUNT_USERINFO_SETTINGS_MODAL_NEW_PASSWORD,
    payload: {
      accountUserInfoSettingsModalNewPassword: accountUserInfoSettingsModalNewPassword,
    },
  };
};
export const setAccountUserInfoSettingsModalReset = () => {
  return {
    type: ACCOUNT_USERINFO_SETTINGS_MODAL_RESET,
  };
};
