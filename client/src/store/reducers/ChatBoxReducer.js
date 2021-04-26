import {
  CHAT_BOX_RECENT_SEARCH_INPUT_TEXT,
  CHAT_BOX_RECENT_SEARCH_TEXT,
  CHAT_BOX_RECENT_CHAT_LIST_DATA,
  CHAT_BOX_MESSAGE_DATA,
  CHAT_BOX_SELECTED_CHATS_ON_FLOATING,
  CHAT_BOX_LABELS_POPOVER_ANCHOR_EL,
  CHAT_BOX_CUSTOMER_FORM_DATA,
  CHAT_BOX_MASSAGE_TEXT_INPUT,
  CHAT_BOX_WINDOW_SIZE,
  CHAT_BOX_RECENT_CHAT_LIST_SEARCH_FILTER_DATA,
  CHAT_BOX_FACEBOOK_IDS_WITH_PROFILE_DETAILS
} from "../ActionTypes";

export const ChatBoxReducer = (
  state = {
    chatBoxRecentSearchInputText: "",
    chatBoxRecentSearchText: "",
    chatBoxRecentChatListData: [],

    chatBoxMessageData: [],
    chatBoxSelectedChatsOnFloating: [],
    ChatBoxMessageBoxHeight: 300,
    chatBoxLabelsPopoverAnchorEl: null,
    chatBoxCustomerFormData: [],

    chatBoxMessageTextInput: "",
    chatBoxWindowSize: {
      width: undefined,
      height: undefined,
    },
    chatBoxRecentChatListSearchSearchFilterData: null,
    chatBoxFacebookIDsWithProfileDetails:[]
  },
  action
) => {
  switch (action.type) {
    case CHAT_BOX_RECENT_SEARCH_INPUT_TEXT:
      return Object.assign({}, state, {
        chatBoxRecentSearchInputText:
          action.payload.chatBoxRecentSearchInputText,
      });
    case CHAT_BOX_RECENT_SEARCH_TEXT:
      return Object.assign({}, state, {
        chatBoxRecentSearchText: action.payload.chatBoxRecentSearchText,
      });
    case CHAT_BOX_RECENT_CHAT_LIST_DATA:
      return Object.assign({}, state, {
        chatBoxRecentChatListData: action.payload.chatBoxRecentChatListData,
      });

    case CHAT_BOX_SELECTED_CHATS_ON_FLOATING:
      return Object.assign({}, state, {
        chatBoxSelectedChatsOnFloating:
          action.payload.chatBoxSelectedChatsOnFloating,
      });
    case CHAT_BOX_MESSAGE_DATA:
      return Object.assign({}, state, {
        chatBoxMessageData: action.payload.chatBoxMessageData,
      });
    case CHAT_BOX_LABELS_POPOVER_ANCHOR_EL:
      return Object.assign({}, state, {
        chatBoxLabelsPopoverAnchorEl:
          action.payload.chatBoxLabelsPopoverAnchorEl,
      });
    case CHAT_BOX_CUSTOMER_FORM_DATA:
      return Object.assign({}, state, {
        chatBoxCustomerFormData: action.payload.chatBoxCustomerFormData,
      });
    case CHAT_BOX_MASSAGE_TEXT_INPUT:
      return Object.assign({}, state, {
        chatBoxMessageTextInput: action.payload.chatBoxMessageTextInput,
      });
    case CHAT_BOX_WINDOW_SIZE:
      return Object.assign({}, state, {
        chatBoxWindowSize: action.payload.chatBoxWindowSize,
      });
    case CHAT_BOX_RECENT_CHAT_LIST_SEARCH_FILTER_DATA:
      return Object.assign({}, state, {
        chatBoxRecentChatListSearchSearchFilterData:
          action.payload.chatBoxRecentChatListSearchSearchFilterData,
      });
      case CHAT_BOX_FACEBOOK_IDS_WITH_PROFILE_DETAILS:
        return Object.assign({}, state, {
          chatBoxFacebookIDsWithProfileDetails:
            action.payload.chatBoxFacebookIDsWithProfileDetails,
        });
    default:
      return state;
  }
};
