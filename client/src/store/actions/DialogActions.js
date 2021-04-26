import {
  DIALOG_OPEN,
  DIALOG_CANCEL_TEXT,
  DIALOG_OK_TEXT,
  DIALOG_TITLE,
  DIALOG_CONTENT,
  DIALOG_OK_CLICK,
} from "../ActionTypes";

export const setDialogOpen = (dialogOpen) => {
  return {
    type: DIALOG_OPEN,
    payload: {
      dialogOpen: dialogOpen,
    },
  };
};
export const setDialogCancelText = (dialogCancelText) => {
  return {
    type: DIALOG_CANCEL_TEXT,
    payload: {
      dialogCancelText: dialogCancelText,
    },
  };
};
export const setDialogOkText = (dialogOkText) => {
  return {
    type: DIALOG_OK_TEXT,
    payload: {
      dialogOkText: dialogOkText,
    },
  };
};
export const setDialogTitle = (dialogTitle) => {
  return {
    type: DIALOG_TITLE,
    payload: {
      dialogTitle: dialogTitle,
    },
  };
};
export const setDialogContent = (dialogContent) => {
  return {
    type: DIALOG_CONTENT,
    payload: {
      dialogContent: dialogContent,
    },
  };
};
export const setDialogOkClick = (dialogOkClick) => {
  return {
    type: DIALOG_OK_CLICK,
    payload: {
      dialogOkClick: dialogOkClick,
    },
  };
};

