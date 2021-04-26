import {
  LOGIN_USERNAME_TEXT,
  LOGIN_PASSWORD_TEXT,
  LOGIN_REDIRECT_TO_PATH,
  LOGIN_IS_LOADING,
  LOGIN_FORGET_PASSWORD_TOGGLE_FORM_NAME,
  FORGET_PASSWORD_IS_LOADING,
  FORGET_PASSWORD_EMAIL_TEXT,
  FORGET_PASSWORD_REQUESTED,
  RESET_PASSWORD_IS_LOADING,
  RESET_PASSWORD_CHANGE_PASSWORD_TEXT,
  RESET_PASSWORD_CHANGE_CONFIRM_PASSWORD_TEXT,
  RESET_PASSWORD_CHANGE_SUCCESS,
} from "../ActionTypes";
import {
  setDialogOpen,
  setDialogOkText,
  setDialogCancelText,
  setDialogOkClick,
  setDialogTitle,
  setDialogContent,
} from "./DialogActions";
import expressConfig from "../../config/express.json";

export const setLoginUsernameText = (loginUsernameText) => {
  return {
    type: LOGIN_USERNAME_TEXT,
    payload: {
      loginUsernameText: loginUsernameText,
    },
  };
};
export const setLoginPasswordText = (loginPasswordText) => {
  return {
    type: LOGIN_PASSWORD_TEXT,
    payload: {
      loginPasswordText: loginPasswordText,
    },
  };
};
export const setLoginRedirectToPath = (loginRedirectToPath) => {
  return {
    type: LOGIN_REDIRECT_TO_PATH,
    payload: {
      loginRedirectToPath: loginRedirectToPath,
    },
  };
};
export const setLoginIsLoading = (loginIsLoading) => {
  return {
    type: LOGIN_IS_LOADING,
    payload: {
      loginIsLoading: loginIsLoading,
    },
  };
};
export const setForgetPasswordIsLoading = (forgetPasswordIsLoading) => {
  return {
    type: FORGET_PASSWORD_IS_LOADING,
    payload: {
      forgetPasswordIsLoading: forgetPasswordIsLoading,
    },
  };
};
export const setForgetPasswordEmailText = (forgetPasswordEmailText) => {
  return {
    type: FORGET_PASSWORD_EMAIL_TEXT,
    payload: {
      forgetPasswordEmailText: forgetPasswordEmailText,
    },
  };
};
export const setLoginForgetPasswordToggleFormName = (
  loginForgetPasswordToggleFormName
) => {
  return {
    type: LOGIN_FORGET_PASSWORD_TOGGLE_FORM_NAME,
    payload: {
      loginForgetPasswordToggleFormName: loginForgetPasswordToggleFormName,
    },
  };
};

export const setForgetPasswordRequested = (forgetPasswordRequested) => {
  return {
    type: FORGET_PASSWORD_REQUESTED,
    payload: {
      forgetPasswordRequested: forgetPasswordRequested,
    },
  };
};

export const setResetPasswordIsLoading = (resetPasswordIsLoading) => {
  return {
    type: RESET_PASSWORD_IS_LOADING,
    payload: {
      resetPasswordIsLoading: resetPasswordIsLoading,
    },
  };
};

export const setResetPasswordChangePasswordText = (
  resetPasswordChangePasswordText
) => {
  return {
    type: RESET_PASSWORD_CHANGE_PASSWORD_TEXT,
    payload: {
      resetPasswordChangePasswordText: resetPasswordChangePasswordText,
    },
  };
};

export const setResetPasswordChangeConfirmPasswordText = (
  resetPasswordChangeConfirmPasswordText
) => {
  return {
    type: RESET_PASSWORD_CHANGE_CONFIRM_PASSWORD_TEXT,
    payload: {
      resetPasswordChangeConfirmPasswordText: resetPasswordChangeConfirmPasswordText,
    },
  };
};

export const setResetPasswordChangeSuccess = (resetPasswordChangeSuccess) => {
  return {
    type: RESET_PASSWORD_CHANGE_SUCCESS,
    payload: {
      resetPasswordChangeSuccess: resetPasswordChangeSuccess,
    },
  };
};
