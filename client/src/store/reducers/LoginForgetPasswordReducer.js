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

export const LoginForgetPasswordReducer = (
  state = {
    loginUsernameText: "",
    loginPasswordText: "",
    loginRedirectToPath: null,
    loginIsLoading: false,
    forgetPasswordIsLoading: false,
    forgetPasswordEmailText: "",
    loginForgetPasswordToggleFormName: "login",
    forgetPasswordRequested: false,
    resetPasswordIsLoading:false,
    resetPasswordChangePasswordText:"",
    resetPasswordChangeConfirmPasswordText:"",
    resetPasswordChangeSuccess:false,

  },
  action
) => {
  switch (action.type) {

    case LOGIN_USERNAME_TEXT:
      return Object.assign({}, state, {
        loginUsernameText: action.payload.loginUsernameText,
      });
    case LOGIN_PASSWORD_TEXT:
      return Object.assign({}, state, {
        loginPasswordText: action.payload.loginPasswordText,
      });

    case LOGIN_REDIRECT_TO_PATH:
      return Object.assign({}, state, {
        loginRedirectToPath: action.payload.loginRedirectToPath,
      });

    case LOGIN_IS_LOADING:
      return Object.assign({}, state, {
        loginIsLoading: action.payload.loginIsLoading,
      });
    case LOGIN_FORGET_PASSWORD_TOGGLE_FORM_NAME:
      return Object.assign({}, state, {
        loginForgetPasswordToggleFormName:
          action.payload.loginForgetPasswordToggleFormName,
      });
    case FORGET_PASSWORD_IS_LOADING:
      return Object.assign({}, state, {
        forgetPasswordIsLoading: action.payload.forgetPasswordIsLoading,
      });
    case FORGET_PASSWORD_EMAIL_TEXT:
      return Object.assign({}, state, {
        forgetPasswordEmailText: action.payload.forgetPasswordEmailText,
      });
    case FORGET_PASSWORD_REQUESTED:
      return Object.assign({}, state, {
        forgetPasswordRequested: action.payload.forgetPasswordRequested,
      });
      case RESET_PASSWORD_IS_LOADING:
      return Object.assign({}, state, {
        resetPasswordIsLoading: action.payload.resetPasswordIsLoading,
      });
      case RESET_PASSWORD_CHANGE_PASSWORD_TEXT:
        return Object.assign({}, state, {
          resetPasswordChangePasswordText: action.payload.resetPasswordChangePasswordText,
        });
        case RESET_PASSWORD_CHANGE_CONFIRM_PASSWORD_TEXT:
          return Object.assign({}, state, {
            resetPasswordChangeConfirmPasswordText: action.payload.resetPasswordChangeConfirmPasswordText,
          });
          case RESET_PASSWORD_CHANGE_SUCCESS:
            return Object.assign({}, state, {
              resetPasswordChangeSuccess: action.payload.resetPasswordChangeSuccess,
            });
    default:
      return state;
  }
};
