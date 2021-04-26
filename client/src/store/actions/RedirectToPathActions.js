import { REDIRECT_TO_PATH } from "../ActionTypes";

export const setRedirectToPath = (redirectToPath) => {
  return {
    type: REDIRECT_TO_PATH,
    payload: {
      redirectToPath: redirectToPath,
    },
  };
};
