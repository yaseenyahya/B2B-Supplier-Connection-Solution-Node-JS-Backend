import { REDIRECT_TO_PATH } from "../ActionTypes";

export const RedirectToPathReducer = (
  state = {
    redirectToPath: "",
  },
  action
) => {
  switch (action.type) {
    case REDIRECT_TO_PATH:
      return Object.assign({}, state, {
        redirectToPath: action.payload.redirectToPath,
      });
    default:
      return state;
  }
};
