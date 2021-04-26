import {
  FOLLOW_UP_DIALOG_TOGGLE,
  FOLLOW_UP_DIALOG_DATE_TIME,
} from "../ActionTypes";

export const setFollowUpDialogToggle = (followUpDialogToggle) => {
  return {
    type: FOLLOW_UP_DIALOG_TOGGLE,
    payload: {
      followUpDialogToggle: followUpDialogToggle,
    },
  };
};
export const setFollowUpDialogDateTime = (followUpDialogDateTime) => {
  return {
    type: FOLLOW_UP_DIALOG_DATE_TIME,
    payload: {
      followUpDialogDateTime: followUpDialogDateTime,
    },
  };
};


