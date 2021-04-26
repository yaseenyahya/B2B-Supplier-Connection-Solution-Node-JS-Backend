import { LABEL_LIST_DATA, LABEL_LIST_TEXT_INPUT } from "../ActionTypes";

export const LabelListReducer = (
  state = {
    labelListData: [{ id: 0, text: "Follow Up" }],
    labelListTextInput:""
  },
  action
) => {
  switch (action.type) {
    case LABEL_LIST_DATA:
      return Object.assign({}, state, {
        labelListData: action.payload.labelListData,
      });
      case LABEL_LIST_TEXT_INPUT:
        return Object.assign({}, state, {
          labelListTextInput: action.payload.labelListTextInput,
        });
    default:
      return state;
  }
};
