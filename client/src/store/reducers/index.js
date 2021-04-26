import { combineReducers } from "redux";
import { LoginForgetPasswordReducer } from "./LoginForgetPasswordReducer";
import { DialogReducer } from "./DialogReducer";
import { RedirectToPathReducer } from "./RedirectToPathReducer";
import { AdminPanelReducer } from "./AdminPanelReducer";
import { AddEditUserModalReducer } from "./AddEditUserModalReducer";
import { CropImageModalReducer } from "./CropImageModalReducer";
import { AddEditDesignationModalReducer } from "./AddEditDesignationModalReducer";
import { AddEditProfileModalReducer } from "./AddEditProfileModalReducer";
import { AddEditPagesModalReducer } from "./AddEditPagesModalReducer";
import { AuthReducer } from "./AuthReducer";
import {AccountUserInfoSettingsModalReducer} from "./AccountUserInfoSettingsModalReducer";
import { UserPanelReducer } from "./UserPanelReducer";
import { ChatBoxReducer } from "./ChatBoxReducer";
import { FollowUpDialogReducer } from "./FollowUpDialogReducer";
import { LabelListReducer } from "./LabelListReducer";
import { NotificationMenuReducer } from "./NotificationMenuReducer";
const rootReducer = combineReducers({
  LoginForgetPasswordReducer,
  DialogReducer,
  RedirectToPathReducer,
  AdminPanelReducer,
  AddEditUserModalReducer,
  AddEditDesignationModalReducer,
  AddEditProfileModalReducer,
  AddEditPagesModalReducer,
  CropImageModalReducer,
  AuthReducer,
  AccountUserInfoSettingsModalReducer,
  UserPanelReducer,
  ChatBoxReducer,
  FollowUpDialogReducer,
  LabelListReducer,
  NotificationMenuReducer
});

export default rootReducer;
