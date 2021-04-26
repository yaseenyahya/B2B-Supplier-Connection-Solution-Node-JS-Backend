import {
  ADD_EDIT_PROFILE_MODAL_TOGGLE,
  ADD_EDIT_PROFILE_MODAL_SELECTED_ROW_DATA,
  ADD_EDIT_PROFILE_MODAL_NAME,
  ADD_EDIT_PROFILE_MODAL_PANELTYPE,
  ADD_EDIT_PROFILE_MODAL_SETTINGS,
  ADD_EDIT_PROFILE_MODAL_RESET,
} from "../ActionTypes";

export const setAddEditProfileModalToggle = (
  addEditProfileModalToggle
) => {
  return {
    type: ADD_EDIT_PROFILE_MODAL_TOGGLE,
    payload: {
      addEditProfileModalToggle: addEditProfileModalToggle,
    },
  };
};
export const setAddEditProfileModalSelectedRowData = (
  addEditProfileModalSelectedRowData
) => {
  return {
    type: ADD_EDIT_PROFILE_MODAL_SELECTED_ROW_DATA,
    payload: {
      addEditProfileModalSelectedRowData: addEditProfileModalSelectedRowData,
    },
  };
};
export const setAddEditProfileModalName = (addEditProfileModalName) => {
  return {
    type: ADD_EDIT_PROFILE_MODAL_NAME,
    payload: {
      addEditProfileModalName: addEditProfileModalName,
    },
  };
};
export const setAddEditProfileModalPanelType = (
  addEditProfileModalPanelType
) => {
  return {
    type: ADD_EDIT_PROFILE_MODAL_PANELTYPE,
    payload: {
      addEditProfileModalPanelType: addEditProfileModalPanelType,
    },
  };
};
export const setAddEditProfileModalSettings = (
  addEditProfileModalSettings
) => {
  return {
    type: ADD_EDIT_PROFILE_MODAL_SETTINGS,
    payload: {
      addEditProfileModalSettings: addEditProfileModalSettings,
    },
  };
};
export const setAddEditProfileModalReset = () => {
  return {
    type: ADD_EDIT_PROFILE_MODAL_RESET,
  };
};
