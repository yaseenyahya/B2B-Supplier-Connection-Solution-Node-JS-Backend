import {
  CHAT_BOX_RECENT_SEARCH_INPUT_TEXT,
  CHAT_BOX_RECENT_SEARCH_TEXT,
  CHAT_BOX_RECENT_CHAT_LIST_DATA,
  CHAT_BOX_MESSAGE_DATA,
  CHAT_BOX_SELECTED_CHATS_ON_FLOATING,
  CHAT_BOX_LABELS_POPOVER_ANCHOR_EL,
  CHAT_BOX_CUSTOMER_FORM_DATA,
  CHAT_BOX_MASSAGE_TEXT_INPUT ,
  CHAT_BOX_WINDOW_SIZE ,
  CHAT_BOX_RECENT_CHAT_LIST_SEARCH_FILTER_DATA ,
  CHAT_BOX_FACEBOOK_IDS_WITH_PROFILE_DETAILS

} from "../ActionTypes";

export const setChatBoxRecentSearchInputText = (chatBoxRecentSearchInputText) => {
  return {
    type: CHAT_BOX_RECENT_SEARCH_INPUT_TEXT,
    payload: {
      chatBoxRecentSearchInputText: chatBoxRecentSearchInputText,
    },
  };
};
export const setChatBoxRecentSearchText = (chatBoxRecentSearchText) => {
  return {
    type: CHAT_BOX_RECENT_SEARCH_TEXT,
    payload: {
      chatBoxRecentSearchText: chatBoxRecentSearchText,
    },
  };
};
export const setChatBoxRecentChatListData = (chatBoxRecentChatListData) => {
  return {
    type: CHAT_BOX_RECENT_CHAT_LIST_DATA,
    payload: {
      chatBoxRecentChatListData: chatBoxRecentChatListData,
    },
  };
};
export const setChatBoxSelectedChatsOnFloating = (chatBoxSelectedChatsOnFloating) => {
  return {
    type: CHAT_BOX_SELECTED_CHATS_ON_FLOATING,
    payload: {
      chatBoxSelectedChatsOnFloating: chatBoxSelectedChatsOnFloating,
    },
  };
};
export const setChatBoxMessageData = (chatBoxMessageData) => {
  return {
    type: CHAT_BOX_MESSAGE_DATA,
    payload: {
      chatBoxMessageData: chatBoxMessageData,
    },
  };
};
export const setChatBoxLabelsPopoverAnchorEl = (chatBoxLabelsPopoverAnchorEl) => {
  return {
    type: CHAT_BOX_LABELS_POPOVER_ANCHOR_EL,
    payload: {
      chatBoxLabelsPopoverAnchorEl: chatBoxLabelsPopoverAnchorEl,
    },
  };
};
export const setChatBoxCustomerFormData = (chatBoxCustomerFormData) => {
  return {
    type: CHAT_BOX_CUSTOMER_FORM_DATA,
    payload: {
      chatBoxCustomerFormData: chatBoxCustomerFormData,
    },
  };
};
export const setChatBoxMessageTextInput = (chatBoxMessageTextInput) => {
  return {
    type: CHAT_BOX_MASSAGE_TEXT_INPUT,
    payload: {
      chatBoxMessageTextInput: chatBoxMessageTextInput,
    },
  };
};
export const setChatBoxWindowSize = (chatBoxWindowSize) => {
  return {
    type: CHAT_BOX_WINDOW_SIZE,
    payload: {
      chatBoxWindowSize: chatBoxWindowSize,
    },
  };
};
export const setChatBoxRecentChatListSearchSearchFilterData = (chatBoxRecentChatListSearchSearchFilterData) => {
  return {
    type: CHAT_BOX_RECENT_CHAT_LIST_SEARCH_FILTER_DATA,
    payload: {
      chatBoxRecentChatListSearchSearchFilterData: chatBoxRecentChatListSearchSearchFilterData,
    },
  };
};
export const setChatBoxFacebookIDsWithProfileDetails = (chatBoxFacebookIDsWithProfileDetails) => {
  return {
    type:   CHAT_BOX_FACEBOOK_IDS_WITH_PROFILE_DETAILS,
    payload: {
      chatBoxFacebookIDsWithProfileDetails: chatBoxFacebookIDsWithProfileDetails,
    },
  };
};