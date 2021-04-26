import {
  ADD_EDIT_DESIGNATION_MODAL_TOGGLE,
  ADD_EDIT_DESIGNATION_MODAL_SELECTED_ROW_DATA,
  ADD_EDIT_DESIGNATION_MODAL_NAME,
  ADD_EDIT_DESIGNATION_MODAL_PANELTYPE,
  ADD_EDIT_DESIGNATION_MODAL_RESET
} from "../ActionTypes";

export const setAddEditDesignationModalToggle = (addEditDesignationModalToggle) => {
  return {
    type: ADD_EDIT_DESIGNATION_MODAL_TOGGLE,
    payload: {
      addEditDesignationModalToggle: addEditDesignationModalToggle,
    },
  };
};
export const setAddEditDesignationModalSelectedRowData = (
  addEditDesignationModalSelectedRowData
) => {
  return {
    type: ADD_EDIT_DESIGNATION_MODAL_SELECTED_ROW_DATA,
    payload: {
      addEditDesignationModalSelectedRowData: addEditDesignationModalSelectedRowData,
    },
  };
};
export const setAddEditDesignationModalName = (addEditDesignationModalName) => {
  return {
    type: ADD_EDIT_DESIGNATION_MODAL_NAME,
    payload: {
      addEditDesignationModalName: addEditDesignationModalName,
    },
  };
};
export const setAddEditDesignationModalPanelType = (addEditDesignationModalPanelType) => {
  return {
    type: ADD_EDIT_DESIGNATION_MODAL_PANELTYPE,
    payload: {
      addEditDesignationModalPanelType: addEditDesignationModalPanelType,
    },
  };
};

export const setAddEditDesignationModalReset = () => {
  return {
    type: ADD_EDIT_DESIGNATION_MODAL_RESET,
  };
};
