import {
  ADD_EDIT_USER_MODAL_TOGGLE,
  ADD_EDIT_USER_MODAL_SELECTED_ROW_DATA,
  ADD_EDIT_USER_MODAL_PICTURE,
  ADD_EDIT_USER_MODAL_NAME,
  ADD_EDIT_USER_MODAL_PSEUDONYM,
  ADD_EDIT_USER_MODAL_USERNAME,
  ADD_EDIT_USER_MODAL_EMAIL,
  ADD_EDIT_USER_MODAL_DESIGNATION,
  ADD_EDIT_USER_MODAL_MANAGER,
  ADD_EDIT_USER_MODAL_STATUS,
  ADD_EDIT_USER_MODAL_COMMENTS,
  ADD_EDIT_USER_MODAL_PASSWORD,
  ADD_EDIT_USER_MODAL_NUMBER,
  ADD_EDIT_USER_MODAL_RESET,
  ADD_EDIT_USER_MODAL_SETTINGS,
} from "../ActionTypes";

export const setAddEditUserModalToggle = (addEditUserModalToggle) => {
  return {
    type: ADD_EDIT_USER_MODAL_TOGGLE,
    payload: {
      addEditUserModalToggle: addEditUserModalToggle,
    },
  };
};
export const setAddEditUserModalSelectedRowData = (
  addEditUserModalSelectedRowData
) => {
  return {
    type: ADD_EDIT_USER_MODAL_SELECTED_ROW_DATA,
    payload: {
      addEditUserModalSelectedRowData: addEditUserModalSelectedRowData,
    },
  };
};
export const setAddEditUserModalPicture = (addEditUserModalPicture) => {
  return {
    type: ADD_EDIT_USER_MODAL_PICTURE,
    payload: {
      addEditUserModalPicture: addEditUserModalPicture,
    },
  };
};
export const setAddEditUserModalName = (addEditUserModalName) => {
  return {
    type: ADD_EDIT_USER_MODAL_NAME,
    payload: {
      addEditUserModalName: addEditUserModalName,
    },
  };
};
export const setAddEditUserModalPseudonym = (addEditUserModalPseudonym) => {
  return {
    type: ADD_EDIT_USER_MODAL_PSEUDONYM,
    payload: {
      addEditUserModalPseudonym: addEditUserModalPseudonym,
    },
  };
};
export const setAddEditUserModalUsername = (addEditUserModalUsername) => {
  return {
    type: ADD_EDIT_USER_MODAL_USERNAME,
    payload: {
      addEditUserModalUsername: addEditUserModalUsername,
    },
  };
};
export const setAddEditUserModalEmail = (addEditUserModalEmail) => {
  return {
    type: ADD_EDIT_USER_MODAL_EMAIL,
    payload: {
      addEditUserModalEmail: addEditUserModalEmail,
    },
  };
};

export const setAddEditUserModalDesignation = (addEditUserModalDesignation) => {
  return {
    type: ADD_EDIT_USER_MODAL_DESIGNATION,
    payload: {
      addEditUserModalDesignation: addEditUserModalDesignation,
    },
  };
};
export const setAddEditUserModalManager = (addEditUserModalManager) => {
  return {
    type: ADD_EDIT_USER_MODAL_MANAGER,
    payload: {
      addEditUserModalManager: addEditUserModalManager,
    },
  };
};
export const setAddEditUserModalStatus = (addEditUserModalStatus) => {
  return {
    type: ADD_EDIT_USER_MODAL_STATUS,
    payload: {
      addEditUserModalStatus: addEditUserModalStatus,
    },
  };
};
export const setAddEditUserModalComments = (addEditUserModalComments) => {
  return {
    type: ADD_EDIT_USER_MODAL_COMMENTS,
    payload: {
      addEditUserModalComments: addEditUserModalComments,
    },
  };
};
export const setAddEditUserModalPassword = (addEditUserModalPassword) => {
  return {
    type: ADD_EDIT_USER_MODAL_PASSWORD,
    payload: {
      addEditUserModalPassword: addEditUserModalPassword,
    },
  };
};
export const setAddEditUserModalNumber = (addEditUserModalNumber) => {
  return {
    type: ADD_EDIT_USER_MODAL_NUMBER,
    payload: {
      addEditUserModalNumber: addEditUserModalNumber,
    },
  };
};
export const setAddEditUserModalReset = () => {
  return {
    type: ADD_EDIT_USER_MODAL_RESET,
  };
};
export const setAddEditUserModalSettings = (addEditUserModalSettings) => {
  return {
    type: ADD_EDIT_USER_MODAL_SETTINGS,
    payload: {
      addEditUserModalSettings: addEditUserModalSettings,
    },
  };
};
