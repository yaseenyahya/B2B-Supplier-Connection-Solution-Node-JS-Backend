import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxMessageData,
} from "../../store/actions/ChatBoxActions";

import _ from "lodash";
import moment from "moment";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const ChatSubscription = (props) => {
  const ChatDetailAddedSubscription = gql`
    subscription ChatDetailAdded {
      chatdetailadded {
        id
        customerId
        pageId
        messageId
        messagetext
        messagetimestamp
        messagetype
        agentId
        alternateagentId
      }
    }
  `;

  const {
    loading: chatDetailAddedSubscriptionLoading,
    error: chatDetailAddedSubscriptionError,
    data: chatDetailAddedSubscriptionResult,
  } = useSubscription(ChatDetailAddedSubscription);
  useEffect(() => {
    if (chatDetailAddedSubscriptionError) {
      alert(chatDetailAddedSubscriptionError);
    }
  }, [chatDetailAddedSubscriptionError]);

  useEffect(() => {
    if (
      chatDetailAddedSubscriptionResult &&
      chatDetailAddedSubscriptionResult.chatdetailadded
    ) {
      if (
        chatDetailAddedSubscriptionResult.chatdetailadded.agentId ==
        props.authUserId
      ) {
        var prevChatData = _.find(
          props.chatBoxMessageData,
          (itm) =>
            itm.customerId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.customerId &&
            itm.pageId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.pageId
        );

        var messageText =
          chatDetailAddedSubscriptionResult.chatdetailadded.messagetype ==
          "followuplabel"
            ? JSON.parse(
                chatDetailAddedSubscriptionResult.chatdetailadded.messagetext
              )
            : chatDetailAddedSubscriptionResult.chatdetailadded.messagetext;

        messageText =
          chatDetailAddedSubscriptionResult.chatdetailadded.messagetype ==
          "followuplabel"
            ? `${messageText[0]} at ${moment
                .unix(messageText[1] / 1000)
                .format("yyyy-MM-DD hh:mm A")}`
            : messageText;

        if (prevChatData) {
          var AddData = false;
          if (
            chatDetailAddedSubscriptionResult.chatdetailadded.messagetype ==
              "followuplabel" ||
            chatDetailAddedSubscriptionResult.chatdetailadded.messagetype ==
              "label"
          ) {
            AddData = true;
          } else {
            var findMessageIfExistByMessageId = _.find(
              prevChatData.messages,
              (item) =>
                item.messageId ==
                chatDetailAddedSubscriptionResult.chatdetailadded.messageId
            );
            AddData = !findMessageIfExistByMessageId;
          }
          console.log(
            "chatDetailAddedSubscriptionResult.chatdetailadded",
            chatDetailAddedSubscriptionResult.chatdetailadded
          );
          if (AddData) {
            prevChatData.messages.push({
              loading: false,
              messageId:
                chatDetailAddedSubscriptionResult.chatdetailadded.messageId,
              text: messageText,
              timestamp:
                chatDetailAddedSubscriptionResult.chatdetailadded
                  .messagetimestamp,
              type:
                chatDetailAddedSubscriptionResult.chatdetailadded.messagetype,
              read: false,
            });
            props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));
          }
        }

        _.remove(
          props.chatBoxRecentChatListData,
          (item) =>
            item.pageId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.pageId &&
            item.customerId ==
              chatDetailAddedSubscriptionResult.chatdetailadded.customerId
        );

        props.chatBoxRecentChatListData.unshift({
          pageId: chatDetailAddedSubscriptionResult.chatdetailadded.pageId,
          customerId:
            chatDetailAddedSubscriptionResult.chatdetailadded.customerId,
          pageName: "",
          customerName: "",
          lastMessage: messageText,
          lastMessageTimeStamp:
            chatDetailAddedSubscriptionResult.chatdetailadded.messagetimestamp,
          selected: false,
          messageId:
            chatDetailAddedSubscriptionResult.chatdetailadded.messageId,
          read: chatDetailAddedSubscriptionResult.chatdetailadded.read,
          loading: false,
        });

        props.setChatBoxRecentChatListData(
          _.cloneDeep(props.chatBoxRecentChatListData)
        );
      }
    }
  }, [chatDetailAddedSubscriptionResult]);
  return <div></div>;
};

const mapStateToProps = (state) => {
  return {
    ...state.UserPanelReducer,
    ...state.ChatBoxReducer,
    ...state.AuthReducer,
  };
};
export default connect(mapStateToProps, {
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxMessageData,
})(ChatSubscription);
