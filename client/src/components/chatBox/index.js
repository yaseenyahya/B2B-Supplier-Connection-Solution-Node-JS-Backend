import React, { useEffect, useState, useRef } from "react";

import {
  Container,
  IconButton,
  Tabs,
  Tab,
  Ta,
  TextField,
  Typography,
  Avatar,
  Tooltip,
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  setChatBoxRecentSearchInputText,
  setChatBoxRecentSearchText,
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxFacebookIDsWithProfileDetails,
} from "../../store/actions/ChatBoxActions";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ClearIcon from "@material-ui/icons/Clear";
import ChatList from "./ChatList";
import _ from "lodash";
import CloseIcon from "@material-ui/icons/Close";
import ChatTabPanel from "./ChatTabPanel";
import SplitterLayout from "../../otherComponents/react-splitter-layout/components/SplitterLayout";
import "../../otherComponents/react-splitter-layout/stylesheets/index.css";
import ChatContainer from "./ChatContainer";
import ChatSubscription from "./ChatSubscription";
import { useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useSnackbar } from "notistack";
import { Facebook } from "../../auth/Facebook";
import moment from "moment";
import includes from "./includes";
import FacebookAvatar from "./FacebookAvatar";
import FacebookTypography from "./FacebookTypography";
const useStyles = makeStyles((theme) => ({
  searchTodayChatsTextField: { width: "100%" },

  textFieldInputRoot: {
    width: "100%",
    background: "white",
  },
  textFieldInput: {
    height: 41,

    padding: "0px 4px",
    borderBottom: 0,
  },
  recentPagesLeftPane: {
    borderRight: "1px solid #dedede",
    flex: 0.26,
    margin: 0,
  },
  clearSearchButton: {
    padding: 0,
    marginRight: 9,
    order: 1,
  },
  bottomChatsTabs: {
    position: "fixed",
    bottom: 0,
    zIndex: 1000,
    height: 52,
    maxWidth: "100%",
  },
  bottomChatsTab: {
    background: "#1a2733",
    maxWidth: 300,

    marginRight: 6,
  },
  bottomChatsTabText: {
    display: "inline",
    color: "white",
    marginLeft: 5,
    width: 150,
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  bottomChatsTabContainer: {
    display: "flex",
    alignItems: "center",
  },
  bottomChatsCloseButton: {
    color: "white",
    marginLeft: 15,
  },
  bottomChatsTabPageImage: {
    marginRight: 2,
    background: "#737272",
  },
  bottomChatsTabPanel: {
    zIndex: 1000,
    background: "#1a2733",
    position: "fixed",
    bottom: 0,
    right: 0,
    width: 400,
  },
  bottomChatsTabScrollButtons: {
    background: "#66c047",
    color: "white",
  },
  chatMainContainer: {},
  chatTabHeader: {
    padding: 5,
    background: "#1a2733",
  },
  chatBoxRecentSearchList: {
    overflowY: "auto",
    overflowX: "hidden",
  },
}));

const ChatBox = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  var splitterLayoutRef = React.useRef(null);
  var splitterLayoutRef = React.useRef(null);

  var selectedChatsOnFloatingTabpanelItem = _.find(
    props.chatBoxSelectedChatsOnFloating,
    (itm) => itm.selected == true
  );

  ///////////////
  const classes = useStyles();
  var searchTodayChatsTextFieldTimeOut = null;
  useEffect(() => {
    if (searchTodayChatsTextFieldTimeOut)
      searchTodayChatsTextFieldTimeOut.clear();

    searchTodayChatsTextFieldTimeOut = setTimeout(() => {
      props.setChatBoxRecentSearchText(props.chatBoxRecentSearchInputText);
    }, 500);
  }, [props.chatBoxRecentSearchInputText]);

  const ChatLastDetailsQuery = gql`
    query ChatLastDetailsById {
      chatlastdetailsbyid {
        id
        customerId
        pageId
        messageId
        messagetext
        messagetimestamp
        messagetype
        agentId
        alternateagentId
        read
      }
    }
  `;
  let [
    getChatlastDetails,
    {
      loading: chatLastDetailsQueryLoading,
      error: chatLastDetailsQueryError,
      data: chatLastDetailsQueryResult,
    },
  ] = useLazyQuery(ChatLastDetailsQuery, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    Facebook.fbInt();
    getChatlastDetails();
  }, []);

  useEffect(() => {
    if(props.userPanelChatOnline)
    getChatlastDetails();
  }, [props.userPanelChatOnline]);
  useEffect(() => {
    if (
      chatLastDetailsQueryResult &&
      chatLastDetailsQueryResult.chatlastdetailsbyid
    ) {
      var chatBoxRecentChatListData = [];
      chatLastDetailsQueryResult.chatlastdetailsbyid.map((item) => {
        

        var messageText =
          item.messagetype == "followuplabel"
            ? JSON.parse(item.messagetext)
            : item.messagetext;

        messageText =
          item.messagetype == "followuplabel"
            ? `${messageText[0]} at ${moment(
                messageText[1],
                "yyyy-MM-DDTHH:mm"
              ).format("yyyy-MM-DD hh:mm A")}`
            : messageText;

        chatBoxRecentChatListData.push({
          pageId: item.pageId,
          customerId: item.customerId,
          pageName:  "",
          customerName:  "",
          lastMessage: messageText,
          lastMessageTimeStamp: item.messagetimestamp,
          selected: false,
          messageId: item.messageId,
          read: item.read,
          loading: false,
        });
      });

      props.setChatBoxRecentChatListData(chatBoxRecentChatListData);
    }
  }, [chatLastDetailsQueryResult]);

  useEffect(() => {
    if (chatLastDetailsQueryError) {
      chatLastDetailsQueryError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
      getChatlastDetails();
    }
  }, [chatLastDetailsQueryError]);

  var includesObj = new includes();
  var isChatListLoading = chatLastDetailsQueryLoading;
  return (
    <SplitterLayout
      ref={splitterLayoutRef}
      percentage={true}
      secondaryInitialSize={75}
      layoutHeight={
        props.chatBoxSelectedChatsOnFloating.length > 1
          ? "calc(100vh - 52px - " + props.userPanelAppBarHeight + "px)"
          : "calc(100vh - " + props.userPanelAppBarHeight + "px)"
      }
    >
      <Container disableGutters={true} className={classes.recentPagesLeftPane}>
        {props.userPanelChatOnline && props.userpanelWsSubscriptionReady && (
          <ChatSubscription  />
        )}
        <TextField
          value={props.chatBoxRecentSearchInputText}
          onInput={(e) => {
            props.setChatBoxRecentSearchInputText(e.target.value);
          }}
          InputProps={{
            startAdornment:
              props.chatBoxRecentSearchText == "" ? null : (
                <IconButton
                  className={classes.clearSearchButton}
                  onClick={() => {
                    props.setChatBoxRecentSearchText("");
                    props.setChatBoxRecentSearchInputText("");
                  }}
                >
                  <ClearIcon color="disabled" fontSize="small" />
                </IconButton>
              ),
            classes: {
              input: classes.textFieldInput,
            },
          }}
          classes={{
            root: classes.textFieldInputRoot,
          }}
          InputAdornmentProps={{
            position: "end",
            style: { order: 2, marginLeft: 0 },
          }}
          placeholder="Search by customer or page name"
        ></TextField>
        <ChatList
          className={classes.chatBoxRecentSearchList}
          containerHeight={
            props.chatBoxSelectedChatsOnFloating.length > 1
              ? `calc(100vh - ${props.userPanelAppBarHeight}px - 104px)`
              : `calc(100vh - ${props.userPanelAppBarHeight}px - 52px)`
          }
          searchText={props.chatBoxRecentSearchText}
          onItemClick={(item) => {
            includesObj.bindItemToMainChat(
              item,
              props.chatBoxRecentChatListData,
              props.setChatBoxRecentChatListData,
              props.chatBoxSelectedChatsOnFloating,
              props.setChatBoxSelectedChatsOnFloating
            );
          }}
          isLoading={isChatListLoading}
          data={props.chatBoxRecentChatListData}
        />
        <Tabs
          classes={{ scrollButtons: classes.bottomChatsTabScrollButtons }}
          value={_.findIndex(
            props.chatBoxSelectedChatsOnFloating,
            (itm) => itm.selected == true
          )}
          onChange={(event, newValue) => {
            var isCloseButtonClick = false;
            var el = event.target;
            while ((el = el.parentElement)) {
              if (el.id == "closeButton") {
                isCloseButtonClick = true;
                break;
              }
            }
            if (!isCloseButtonClick) {
              var findPreviousChatsOnFloatingSelectedItem = _.find(
                props.chatBoxSelectedChatsOnFloating,
                (itm) => itm.selected == true
              );

              if (findPreviousChatsOnFloatingSelectedItem) {
                findPreviousChatsOnFloatingSelectedItem.selected = false;
              }
              var findItem = _.find(
                props.chatBoxSelectedChatsOnFloating,
                (itm) => itm.customerId == newValue
              );
              if (findItem) findItem.selected = true;

              props.setChatBoxSelectedChatsOnFloating(
                _.cloneDeep(props.chatBoxSelectedChatsOnFloating)
              );
            }
          }}
          className={classes.bottomChatsTabs}
          variant="scrollable"
          aria-label="chat tabs"
        >
          {_.filter(
            props.chatBoxSelectedChatsOnFloating,
            (itm) => !itm.selected
          ).map((item) => {
            return (
              <Tab
                key={`simple-tab-${item.customerId}`}
                value={item.customerId}
                aria-controls={`simple-tabpanel-${item.customerId}`}
                className={classes.bottomChatsTab}
                label={
                  <Tooltip
                    title={`${item.customerName}  @${item.pageName}`}
                    aria-label={`${item.customerName}  @${item.pageName}`}
                  >
                    <span className={classes.bottomChatsTabContainer}>
                      <FacebookAvatar
                        item={item}
                        type="page"
                        variant={"rounded"}
                        className={classes.bottomChatsTabPageImage}
                      ></FacebookAvatar>
                      <FacebookAvatar
                        item={item}
                        type="customer"
                        variant={"rounded"}
                        className={classes.bottomChatsTabCustomerImage}
                      ></FacebookAvatar>
                      <FacebookTypography item={item} className={classes.bottomChatsTabText}>
                       
                      </FacebookTypography>
                      <IconButton
                        id={"closeButton"}
                        className={classes.bottomChatsCloseButton}
                        size="small"
                        onClick={() => {
                          _.remove(
                            props.chatBoxSelectedChatsOnFloating,
                            (itm) => itm.customerId == item.customerId
                          );
                          props.setChatBoxSelectedChatsOnFloating(
                            _.cloneDeep(props.chatBoxSelectedChatsOnFloating)
                          );
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                }
              />
            );
          })}
        </Tabs>
      </Container>
      <Container
        maxWidth={false}
        disableGutters={true}
        className={classes.mainChatBox}
      >
        {selectedChatsOnFloatingTabpanelItem && (
          <ChatContainer
            chatBoxMessageBoxDynamicHeight={true}
            chatTabHeaderStyles={classes.chatTabHeader}
            chatMainContainerStyles={classes.chatMainContainer}
            itemData={selectedChatsOnFloatingTabpanelItem}
          ></ChatContainer>
        )}
      </Container>
    </SplitterLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.UserPanelReducer,
    ...state.ChatBoxReducer,
  };
};
export default connect(mapStateToProps, {
  setChatBoxRecentSearchInputText,
  setChatBoxRecentSearchText,
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxFacebookIDsWithProfileDetails,
})(ChatBox);
