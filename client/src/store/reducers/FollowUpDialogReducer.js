import {
  FOLLOW_UP_DIALOG_TOGGLE,
  FOLLOW_UP_DIALOG_DATE_TIME,
} from "../ActionTypes";
import moment from "moment";
export const FollowUpDialogReducer = (
  state = {
    followUpDialogToggle: false,
    followUpDialogDateTime: moment().format("yyyy-MM-DDTHH:mm"),

  },
  action
) => {
  switch (action.type) {
    case FOLLOW_UP_DIALOG_TOGGLE:
      return Object.assign({}, state, {
        followUpDialogToggle: action.payload.followUpDialogToggle,
      });
    case FOLLOW_UP_DIALOG_DATE_TIME:
      return Object.assign({}, state, {
        followUpDialogDateTime: action.payload.followUpDialogDateTime,
      });
    default:
      return state;
  }
};
