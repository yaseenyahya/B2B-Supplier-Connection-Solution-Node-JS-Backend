import {
  ADD_EDIT_PAGES_MODAL_TOGGLE,
  ADD_EDIT_PAGES_MODAL_PAGES,
  ADD_EDIT_PAGES_MODAL_SELECTED_PAGES,
  ADD_EDIT_PAGES_MODAL_RESET,
} from "../ActionTypes";

export const AddEditPagesModalReducer = (
  state = {
    addEditPagesModalToggle: false,
    addEditPagesModalPages: null,
    addEditPagesModalSelectedPages: null,
  },
  action
) => {
  switch (action.type) {
    case ADD_EDIT_PAGES_MODAL_TOGGLE:
      return Object.assign({}, state, {
        addEditPagesModalToggle: action.payload.addEditPagesModalToggle,
      });
    case ADD_EDIT_PAGES_MODAL_PAGES:
      return Object.assign({}, state, {
        addEditPagesModalPages: action.payload.addEditPagesModalPages,
      });
    case ADD_EDIT_PAGES_MODAL_SELECTED_PAGES:
      return Object.assign({}, state, {
        addEditPagesModalSelectedPages:
          action.payload.addEditPagesModalSelectedPages,
      });
    case ADD_EDIT_PAGES_MODAL_RESET:
      return Object.assign({}, state, {
        addEditPagesModalToggle: false,
        addEditPagesModalPages: null,
        addEditPagesModalSelectedPages: null,
      });
    default:
      return state;
  }
};
