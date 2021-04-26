import {
  ADD_EDIT_PROFILE_MODAL_TOGGLE,
  ADD_EDIT_PROFILE_MODAL_SELECTED_ROW_DATA,
  ADD_EDIT_PROFILE_MODAL_NAME,
  ADD_EDIT_PROFILE_MODAL_PANELTYPE,
  ADD_EDIT_PROFILE_MODAL_SETTINGS,
  ADD_EDIT_PROFILE_MODAL_RESET,
} from "../ActionTypes";

export const AddEditProfileModalReducer = (
  state = {
    addEditProfileModalToggle: false,
    addEditProfileModalSelectedRowData: null,
    addEditProfileModalName: "",
    addEditProfileModalPanelType: null,
    addEditProfileModalSettings: null,
  },
  action
) => {
  switch (action.type) {
    case ADD_EDIT_PROFILE_MODAL_TOGGLE:
      return Object.assign({}, state, {
        addEditProfileModalToggle: action.payload.addEditProfileModalToggle,
      });
    case ADD_EDIT_PROFILE_MODAL_SELECTED_ROW_DATA:
      return Object.assign({}, state, {
        addEditProfileModalSelectedRowData:
          action.payload.addEditProfileModalSelectedRowData,
      });
    case ADD_EDIT_PROFILE_MODAL_NAME:
      return Object.assign({}, state, {
        addEditProfileModalName: action.payload.addEditProfileModalName,
      });
    case ADD_EDIT_PROFILE_MODAL_PANELTYPE:
      return Object.assign({}, state, {
        addEditProfileModalPanelType:
          action.payload.addEditProfileModalPanelType,
      });
    case ADD_EDIT_PROFILE_MODAL_SETTINGS:
      return Object.assign({}, state, {
        addEditProfileModalSettings: action.payload.addEditProfileModalSettings,
      });

    case ADD_EDIT_PROFILE_MODAL_RESET:
      return Object.assign({}, state, {
        addEditProfileModalToggle: false,
        addEditProfileModalSelectedRowData: null,
        addEditProfileModalName: "",
        addEditProfileModalPanelType: null,
        addEditProfileModalSettings: null,
      });
    default:
      return state;
  }
};
