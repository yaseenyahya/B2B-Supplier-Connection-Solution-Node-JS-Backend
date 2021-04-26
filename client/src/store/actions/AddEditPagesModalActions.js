import {
  ADD_EDIT_PAGES_MODAL_TOGGLE,
  ADD_EDIT_PAGES_MODAL_PAGES,
  ADD_EDIT_PAGES_MODAL_SELECTED_PAGES,
  ADD_EDIT_PAGES_MODAL_RESET,
} from "../ActionTypes";

export const setAddEditPagesModalToggle = (
  addEditPagesModalToggle
) => {
  return {
    type: ADD_EDIT_PAGES_MODAL_TOGGLE,
    payload: {
      addEditPagesModalToggle: addEditPagesModalToggle,
    },
  };
};
export const setaddEditPagesModalPages = (
  addEditPagesModalPages
) => {
  return {
    type: ADD_EDIT_PAGES_MODAL_PAGES,
    payload: {
      addEditPagesModalPages: addEditPagesModalPages,
    },
  };
};
export const setAddEditPagesModalSelectedPages = (addEditPagesModalSelectedPages) => {
  return {
    type: ADD_EDIT_PAGES_MODAL_SELECTED_PAGES,
    payload: {
      addEditPagesModalSelectedPages: addEditPagesModalSelectedPages,
    },
  };
};
export const setAddEditPagesModalReset = () => {
  return {
    type: ADD_EDIT_PAGES_MODAL_RESET,
  };
};
