import { LABEL_LIST_DATA, LABEL_LIST_TEXT_INPUT } from "../ActionTypes";

export const setLabelListData = (labelListData) => {
  return {
    type: LABEL_LIST_DATA,
    payload: {
      labelListData: labelListData,
    },
  };
};
export const setLabelListTextInput = (labelListTextInput) => {
  return {
    type: LABEL_LIST_TEXT_INPUT,
    payload: {
      labelListTextInput: labelListTextInput,
    },
  };
};