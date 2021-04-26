import {
    DIALOG_OPEN,
    DIALOG_CANCEL_TEXT,
    DIALOG_OK_TEXT,
    DIALOG_TITLE,
    DIALOG_CONTENT,
    DIALOG_OK_CLICK
  } from "../ActionTypes";

  export const DialogReducer = (
    state = {
      dialogOpen: false,
      dialogCancelText: "Cancel",
      dialogOkText: "OK",
      dialogTitle: "",
      dialogContent: "content",
     dialogOkClick:null
  
    },
    action
  ) => {
    switch (action.type) {
      case DIALOG_OPEN:
        return Object.assign({}, state, {
            dialogOpen: action.payload.dialogOpen,
        });
      case DIALOG_CANCEL_TEXT:
        return Object.assign({}, state, {
            dialogCancelText: action.payload.dialogCancelText,
        });
  
      case DIALOG_OK_TEXT:
        return Object.assign({}, state, {
            dialogOkText: action.payload.dialogOkText,
        });
      case DIALOG_TITLE:
        return Object.assign({}, state, {
            dialogTitle: action.payload.dialogTitle,
        });
      case DIALOG_CONTENT:
        return Object.assign({}, state, {
            dialogContent: action.payload.dialogContent,
        });
        case DIALOG_OK_CLICK:
          return Object.assign({}, state, {
            dialogOkClick: action.payload.dialogOkClick,
          });
      default:
        return state;
    }
  };
  