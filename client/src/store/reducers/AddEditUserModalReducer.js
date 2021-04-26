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
  ADD_EDIT_USER_MODAL_SETTINGS
} from "../ActionTypes";

export const AddEditUserModalReducer = (
  state = {
    addEditUserModalToggle: false,
    addEditUserModalSelectedRowData: null,
    addEditUserModalPicture: null,
    addEditUserModalName: "",
    addEditUserModalPseudonym: "",
    addEditUserModalUsername: "",
    addEditUserModalPassword: "",
    addEditUserModalEmail: "",
    addEditUserModalDesignation: null,
    addEditUserModalManager: null,
    addEditUserModalStatus: null,
    addEditUserModalComments: "",
    addEditUserModalNumber: "",
    addEditUserModalSettings: "",
  },
  
  action
) => {
  switch (action.type) {
    case ADD_EDIT_USER_MODAL_TOGGLE:
      return Object.assign({}, state, {
        addEditUserModalToggle: action.payload.addEditUserModalToggle,
      });
    case ADD_EDIT_USER_MODAL_SELECTED_ROW_DATA:
      return Object.assign({}, state, {
        addEditUserModalSelectedRowData:
          action.payload.addEditUserModalSelectedRowData,
      });
    case ADD_EDIT_USER_MODAL_PICTURE:
      return Object.assign({}, state, {
        addEditUserModalPicture: action.payload.addEditUserModalPicture,
      });
    case ADD_EDIT_USER_MODAL_NAME:
      return Object.assign({}, state, {
        addEditUserModalName: action.payload.addEditUserModalName,
      });
    case ADD_EDIT_USER_MODAL_PSEUDONYM:
      return Object.assign({}, state, {
        addEditUserModalPseudonym: action.payload.addEditUserModalPseudonym,
      });
    case ADD_EDIT_USER_MODAL_USERNAME:
      return Object.assign({}, state, {
        addEditUserModalUsername: action.payload.addEditUserModalUsername,
      });
    case ADD_EDIT_USER_MODAL_PASSWORD:
      return Object.assign({}, state, {
        addEditUserModalPassword: action.payload.addEditUserModalPassword,
      });
    case ADD_EDIT_USER_MODAL_EMAIL:
      return Object.assign({}, state, {
        addEditUserModalEmail: action.payload.addEditUserModalEmail,
      });
    case ADD_EDIT_USER_MODAL_DESIGNATION:
      return Object.assign({}, state, {
        addEditUserModalDesignation: action.payload.addEditUserModalDesignation,
      });
    case ADD_EDIT_USER_MODAL_MANAGER:
      return Object.assign({}, state, {
        addEditUserModalManager: action.payload.addEditUserModalManager,
      });
    case ADD_EDIT_USER_MODAL_STATUS:
      return Object.assign({}, state, {
        addEditUserModalStatus: action.payload.addEditUserModalStatus,
      });
    case ADD_EDIT_USER_MODAL_COMMENTS:
      return Object.assign({}, state, {
        addEditUserModalComments: action.payload.addEditUserModalComments,
      });
    case ADD_EDIT_USER_MODAL_NUMBER:
      return Object.assign({}, state, {
        addEditUserModalNumber: action.payload.addEditUserModalNumber,
      });
      case ADD_EDIT_USER_MODAL_SETTINGS:
        return Object.assign({}, state, {
          addEditUserModalSettings: action.payload.addEditUserModalSettings,
        });
      
    case ADD_EDIT_USER_MODAL_RESET:
      return Object.assign({}, state, {
        addEditUserModalToggle: false,
        addEditUserModalSelectedRowData: null,
        addEditUserModalPicture: null,
        addEditUserModalName: "",
        addEditUserModalPseudonym: "",
        addEditUserModalUsername: "",
        addEditUserModalPassword: "",
        addEditUserModalEmail: "",
        addEditUserModalDesignation: null,
        addEditUserModalManager: null,
        addEditUserModalStatus: null,
        addEditUserModalComments: "",
        addEditUserModalNumber: "",
        addEditUserModalSettings:""
      });
    default:
      return state;
  }
};
