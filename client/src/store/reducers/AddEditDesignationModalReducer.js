import {
  ADD_EDIT_DESIGNATION_MODAL_TOGGLE,
  ADD_EDIT_DESIGNATION_MODAL_SELECTED_ROW_DATA,
  ADD_EDIT_DESIGNATION_MODAL_NAME,
  ADD_EDIT_DESIGNATION_MODAL_PANELTYPE,
  ADD_EDIT_DESIGNATION_MODAL_RESET,
} from "../ActionTypes";

export const AddEditDesignationModalReducer = (
  state = {
    addEditDesignationModalToggle: false,
    addEditDesignationModalSelectedRowData: null,
    addEditDesignationModalName: "",
    addEditDesignationModalPanelType: null,
  },
  action
) => {
  switch (action.type) {
    case ADD_EDIT_DESIGNATION_MODAL_TOGGLE:
      return Object.assign({}, state, {
        addEditDesignationModalToggle: action.payload.addEditDesignationModalToggle,
      });
    case ADD_EDIT_DESIGNATION_MODAL_SELECTED_ROW_DATA:
      return Object.assign({}, state, {
        addEditDesignationModalSelectedRowData:
          action.payload.addEditDesignationModalSelectedRowData,
      });
    case ADD_EDIT_DESIGNATION_MODAL_NAME:
      return Object.assign({}, state, {
        addEditDesignationModalName: action.payload.addEditDesignationModalName,
      });
    case ADD_EDIT_DESIGNATION_MODAL_PANELTYPE:
      return Object.assign({}, state, {
        addEditDesignationModalPanelType: action.payload.addEditDesignationModalPanelType,
      });
   
    case ADD_EDIT_DESIGNATION_MODAL_RESET:
      return Object.assign({}, state, {
        addEditDesignationModalToggle: false,
        addEditDesignationModalSelectedRowData: null,
        addEditDesignationModalName: "",
        addEditDesignationModalPanelType: null,
      });
    default:
      return state;
  }
};
