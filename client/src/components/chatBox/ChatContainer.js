import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Tooltip,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  CircularProgress,
  Popover,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxLabelsPopoverAnchorEl,
  setChatBoxCustomerFormData,
  setChatBoxMessageData,
  setChatBoxWindowSize,
  setChatBoxMessageTextInput,
} from "../../store/actions/ChatBoxActions";
import {
  setFollowUpDialogToggle,
  setFollowUpDialogDateTime,
} from "../../store/actions/FollowUpDialogActions";
import _ from "lodash";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import LabelsList from "./LabelsList";
import clsx from "clsx";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import ChatBoxCustomerFormModal from "./ChatBoxCustomerFormModal";
import moment from "moment";
import { useSnackbar } from "notistack";
import FollowUpDialog from "./FollowUpDialog";
import FacebookAvatar from "./FacebookAvatar";
import FacebookTypography from "./FacebookTypography";
import ErrorIcon from "@material-ui/icons/Error";
const useStyles = makeStyles((theme) => ({
  chatTabHeaderContainer: {
    display: "flex",
  },
  chatsTabText: {
    display: "inline",
    color: "white",
    marginLeft: 5,
    width: 150,
    whiteSpace: "nowrap",
    overflow: "hidden",
    flexGrow: 1,
  },
  chatsTabContainer: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },
  chatsCloseButton: {
    color: "white",
    marginLeft: 15,
  },
  chatsTabPageImage: {
    marginRight: 2,
    background: "#737272",
  },
  messageBox: {
    background: "white",
    overflow: "auto",
  },

  messageInputRoot: {
    width: "100%",
    background: "white",
    borderTop: "1px solid gray",
  },
  messageInput: {
    height: 41,

    padding: "0px 4px",
    borderBottom: 0,
  },
  sendMessageButton: {
    padding: "0 9px",
  },
  messageTextAndSendContainer: {
    display: "flex",
    background: "#b5b3b3",
  },
  incomingMessage: {
    background: "#cccbcb",
    borderRadius: 20,
    display: "inline-block",
    padding: 15,
    margin: 5,
  },
  outgoingMessage: {
    background: "#66c047",
    borderRadius: 20,
    display: "inline-block",
    color: "white",
    padding: 15,
    margin: 5,
  },
  outgoingMessageContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  loadingCircularProgress: {
    margin: "auto",
    display: "block",
    marginTop: 20,
  },
  formAddButton: {
    color: "white",
    background: "#f50057",
    marginRight: 5,
    "&:hover": {
      background: "#e14079",
    },
  },
  labelAddButton: {
    borderRadius: 0,
  },
  addLabelsPopoverPaper: {
    borderRadius: 0,
  },
  userLabel: {
    textAlign: "center",
    borderBottom: "1px solid gray",
    margin: "25px 55px",
    fontSize: 15,
  },
  chatMessageProgress: {
    width: "19px!important",
    height: "19px!important",
    marginTop: "auto",
    marginBottom: "auto",
  },
  errorMessage: {
    color: "#f50057",
    marginTop: "auto",
    marginBottom: "auto",
  },
}));
const ChatContainer = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const AddChatToFacebookQuery = gql`
    mutation AddChatToFacebook(
      $customerId: String!
      $pageId: String!
      $message: String!
      $outgoingMessageId: String!
    ) {
      addchattofacebook(
        customerId: $customerId
        pageId: $pageId
        message: $message
        outgoingMessageId: $outgoingMessageId
      ) {
        success
        error
        result
      }
    }
  `;

  let [
    addChatToFacebook,
    {
      loading: addChatToFacebookQueryLoading,
      error: addChatToFacebookQueryError,
      data: addChatToFacebookQueryResult,
    },
  ] = useMutation(AddChatToFacebookQuery);
  useEffect(() => {
    if (addChatToFacebookQueryError) {
      addChatToFacebookQueryError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [addChatToFacebookQueryError]);

  useEffect(() => {
    if (
      addChatToFacebookQueryResult &&
      addChatToFacebookQueryResult.addchattofacebook
    ) {
      if (addChatToFacebookQueryResult.addchattofacebook.success) {
        var result = JSON.parse(
          addChatToFacebookQueryResult.addchattofacebook.result
        );
        var findItem = _.find(
          messages.messages,
          (item) => item.outgoingMessageId == result.outgoingMessageId
        );

        if (findItem) {
          findItem.loading = false;
          findItem.messageId = result.message_id;
          props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));
        }
      } else {
        enqueueSnackbar(addChatToFacebookQueryResult.addchattofacebook.error, {
          variant: "error",
        });
        var result = JSON.parse(
          addChatToFacebookQueryResult.addchattofacebook.result
        );
        var findItem = _.find(
          messages.messages,
          (item) => item.outgoingMessageId == result.outgoingMessageId
        );

        if (findItem) {
          findItem.loading = false;
          findItem.error = addChatToFacebookQueryResult.addchattofacebook.error;
          props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));
        }
      }
    }
  }, [addChatToFacebookQueryResult]);

  const AddChatDetailQuery = gql`
    mutation AddChatDetail(
      $customerId: String!
      $pageId: String!
      $messageId: String
      $messagetext: String!
      $messagetimestamp: String!
      $messagetype: String!
      $agentId: ID!
      $alternateagentId: ID
    ) {
      addchatdetail(
        customerId: $customerId
        pageId: $pageId
        messageId: $messageId
        messagetext: $messagetext
        messagetimestamp: $messagetimestamp
        messagetype: $messagetype
        agentId: $agentId
        alternateagentId: $alternateagentId
      ) {
        success
        error
      }
    }
  `;

  let [
    addChatDetail,
    {
      loading: addChatDetailQueryLoading,
      error: addChatDetailQueryError,
      data: addChatDetailQueryResult,
    },
  ] = useMutation(AddChatDetailQuery);
  useEffect(() => {
    if (addChatDetailQueryError) {
      //error
    }
  }, [addChatDetailQueryError]);

  useEffect(() => {
    if (addChatDetailQueryResult && addChatDetailQueryResult.addchatdetail) {
      if (addChatDetailQueryResult.addchatdetail.success) {
      } else {
        //error
      }
    }
  }, [addChatDetailQueryResult]);

  const ChatDetailsByAgentCutomerPageIdQuery = gql`
    query ChatDetailsByAgentCutomerPageId(
      $customerId: String!
      $pageId: String!
    ) {
      chatdetailsbyagentcutomerpageid(
        customerId: $customerId
        pageId: $pageId
      ) {
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
    chatDetailsByAgentCutomerPageId,
    {
      loading: chatDetailsByAgentCutomerPageIdQueryLoading,
      error: chatDetailsByAgentCutomerPageIdQueryError,
      data: chatDetailsByAgentCutomerPageIdQueryResult,
    },
  ] = useLazyQuery(ChatDetailsByAgentCutomerPageIdQuery, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    if (chatDetailsByAgentCutomerPageIdQueryError) {
      setTimeout(() => {
        callChatDetailsByAgentCutomerPageId();
      }, 1000);
    }
  }, [chatDetailsByAgentCutomerPageIdQueryError]);

  useEffect(() => {
    if (
      chatDetailsByAgentCutomerPageIdQueryResult &&
      chatDetailsByAgentCutomerPageIdQueryResult.chatdetailsbyagentcutomerpageid
    ) {
      var chatData = {
        pageId: props.itemData.pageId,
        customerId: props.itemData.customerId,
        messages: [],
      };
      chatDetailsByAgentCutomerPageIdQueryResult.chatdetailsbyagentcutomerpageid.map(
        (messages) => {
          var messageText =
            messages.messagetype == "followuplabel"
              ? JSON.parse(messages.messagetext)
              : messages.messagetext;

          messageText =
            messages.messagetype == "followuplabel"
              ? `${messageText[0]} at ${moment(
                  messageText[1],
                  "yyyy-MM-DDTHH:mm"
                ).format("yyyy-MM-DD hh:mm A")}`
              : messageText;

          chatData.messages.push({
            loading: false,
            text: messageText,
            timestamp: messages.messagetimestamp,
            type: messages.messagetype,
            messageId: messages.messageId,
          });
        }
      );
      var prevChatData = _.find(
        props.chatBoxMessageData,
        (itm) =>
          itm.customerId == props.itemData.customerId &&
          itm.pageId == props.itemData.pageId
      );
      if (!prevChatData) {
        props.chatBoxMessageData.push(chatData);
      } else {
        prevChatData.messages = chatData.messages;
      }

      props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));
    }
  }, [chatDetailsByAgentCutomerPageIdQueryResult]);

  useEffect(() => {
    if (props.itemData) callChatDetailsByAgentCutomerPageId();
  }, [props.itemData]);

  useEffect(() => {
    if (props.userPanelChatOnline)
      if (props.itemData) callChatDetailsByAgentCutomerPageId();
  }, [props.userPanelChatOnline]);

  const callChatDetailsByAgentCutomerPageId = () => {
    chatDetailsByAgentCutomerPageId({
      variables: {
        customerId: props.itemData.customerId,
        pageId: props.itemData.pageId,
      },
    });
  };
  var messages = _.find(
    props.chatBoxMessageData,
    (itm) => itm.customerId == props.itemData.customerId
  );
  const messageContainerRef = useRef(null);
  useEffect(() => {
    if (messageContainerRef.current)
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
  }, [messages]);

  const popoverActions = React.useRef();
  const mainContainerRef = React.useRef();

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      props.setChatBoxWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  function guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }

  const addMessageInputText = () => {
    if (props.chatBoxMessageTextInput != "") {
      var uid = guidGenerator();
      addChatToFacebook({
        variables: {
          customerId: props.itemData.customerId,
          pageId: props.itemData.pageId,
          message: props.chatBoxMessageTextInput,
          outgoingMessageId: uid,
        },
      });

      messages.messages.push({
        loading: true,
        text: props.chatBoxMessageTextInput,
        timestamp: null,
        type: "outgoing",
        messageId: null,
        outgoingMessageId: uid,
      });

      props.setChatBoxMessageData(_.cloneDeep(props.chatBoxMessageData));

      props.setChatBoxMessageTextInput("");
    }
  };

  return (
    <Container
      maxWidth={false}
      ref={mainContainerRef}
      disableGutters={true}
      className={props.chatMainContainerStyles}
    >
      {!messages || chatDetailsByAgentCutomerPageIdQueryLoading ? (
        <CircularProgress
          className={classes.loadingCircularProgress}
          size={24}
        />
      ) : (
        <>
          <Container
            maxWidth={false}
            disableGutters={true}
            className={clsx(
              classes.chatTabHeaderContainer,
              props.chatTabHeaderStyles
            )}
          >
            <FollowUpDialog
              addFollowLabel={() => {
                addChatDetail({
                  variables: {
                    customerId: props.itemData.customerId,
                    pageId: props.itemData.pageId,
                    messageId: null,
                    messagetext: JSON.stringify([
                      "Follow Up",
                      props.followUpDialogDateTime,
                    ]),
                    messagetimestamp: new Date().toString(),
                    messagetype: "followuplabel",
                    agentId: props.authUserId,
                    alternateagentId: props.authUserId,
                  },
                });
                props.setFollowUpDialogToggle(false);
              }}
            />
            <Button
              className={classes.formAddButton}
              onClick={() => {
                props.chatBoxCustomerFormData.push({
                  modalData: {
                    modalWidth: 350,
                    modalHeight:
                      props.chatBoxWindowSize.height -
                      props.userPanelAppBarHeight -
                      50,
                    modalX: 0,
                    modalY: 0,
                  },
                  customerData: props.itemData,
                  formData: [],
                });
                props.setChatBoxCustomerFormData(
                  _.cloneDeep(props.chatBoxCustomerFormData)
                );
              }}
            >
              <NoteAddIcon className={classes.formAddButtonIcon} />
              <Typography className={classes.formAddButtonText}>
                Add Form
              </Typography>
            </Button>
            <Tooltip
              title={`${props.itemData.customerName}  @${props.itemData.pageName}`}
              aria-label={`${props.itemData.customerName}  @${props.itemData.pageName}`}
            >
              <span className={classes.chatsTabContainer}>
                <FacebookAvatar
                  type={"page"}
                  item={props.itemData}
                  variant={"rounded"}
                  className={classes.chatsTabPageImage}
                ></FacebookAvatar>
                <FacebookAvatar
                  type={"customer"}
                  item={props.itemData}
                  variant={"rounded"}
                  className={classes.chatsTabCustomerImage}
                ></FacebookAvatar>
                <FacebookTypography
                  pageNameChange={(name) => {
                    var findItem = _.find(
                      props.chatBoxSelectedChatsOnFloating,
                      (list) =>
                        list.pageId == props.itemData.pageId &&
                        list.customerId == props.itemData.customerId
                    );
                    if (findItem) {
                      if (findItem.pageName != name) {
                        findItem.pageName = name;
                        props.setChatBoxSelectedChatsOnFloating(
                          _.cloneDeep(props.chatBoxSelectedChatsOnFloating)
                        );
                      }
                    }
                  }}
                  customerNameChange={(name) => {
                    var findItem = _.find(
                      props.chatBoxSelectedChatsOnFloating,
                      (list) =>
                        list.pageId == props.itemData.pageId &&
                        list.customerId == props.itemData.customerId
                    );

                    if (findItem) {
                      if (findItem.customerName != name) {
                        findItem.customerName = name;
                        props.setChatBoxSelectedChatsOnFloating(
                          _.cloneDeep(props.chatBoxSelectedChatsOnFloating)
                        );
                      }
                    }
                  }}
                  item={props.itemData}
                  className={classes.chatsTabText}
                ></FacebookTypography>
                <IconButton
                  className={classes.chatsCloseButton}
                  size="small"
                  onClick={() => {
                    _.remove(
                      props.chatBoxSelectedChatsOnFloating,
                      (itm) => itm.customerId == props.itemData.customerId
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
          </Container>
          <Container maxWidth={false} disableGutters={true}>
            <Container
              ref={messageContainerRef}
              maxWidth={false}
              disableGutters={true}
              style={{
                height:
                  props.chatBoxSelectedChatsOnFloating.length > 1
                    ? `calc(100vh - ${props.userPanelAppBarHeight}px - 144.5px)`
                    : `calc(100vh - ${props.userPanelAppBarHeight}px - 92px)`,
              }}
              className={classes.messageBox}
            >
              {chatDetailsByAgentCutomerPageIdQueryLoading ? (
                <CircularProgress
                  className={classes.loadingCircularProgress}
                  size={24}
                />
              ) : (
                messages.messages.map((item) => {
                  console.log(item.error);
                  return item.type == "outgoing" ? (
                    <div className={classes.outgoingMessageContainer}>
                      {item.loading && (
                        <CircularProgress
                          className={classes.chatMessageProgress}
                        ></CircularProgress>
                      )}
                      {item.error && (
                        <Tooltip
                          arrow={true}
                          placement={"left"}
                          title={item.error}
                          className={classes.errorMessageContainer}
                        >
                          <ErrorIcon className={classes.errorMessage} />
                        </Tooltip>
                      )}
                      <Tooltip
                        arrow={true}
                        placement={"left"}
                        title={moment
                          .unix(item.timestamp / 1000)
                          .format("DD MMM YYYY hh:mm a")}
                        className={classes.outgoingMessage}
                      >
                        <span>{item.text}</span>
                      </Tooltip>
                    </div>
                  ) : item.type == "incoming" ? (
                    <div>
                      <Tooltip
                        arrow={true}
                        placement={"right"}
                        title={moment
                          .unix(item.timestamp / 1000)
                          .format("DD MMM YYYY hh:mm a")}
                        className={classes.incomingMessage}
                      >
                        <span>{item.text}</span>
                      </Tooltip>
                    </div>
                  ) : (
                    <div>
                      <Tooltip
                        arrow={true}
                        placement={"top"}
                        title={moment
                          .unix(item.timestamp / 1000)
                          .format("DD MMM YYYY hh:mm a")}
                        className={classes.userLabel}
                      >
                        <Typography>{item.text}</Typography>
                      </Tooltip>
                    </div>
                  );
                })
              )}
            </Container>
            <Box className={classes.messageTextAndSendContainer}>
              <Button
                disabled={!props.userPanelChatOnline}
                aria-describedby={
                  Boolean(props.chatBoxLabelsPopoverAnchorEl)
                    ? "addLabelButton"
                    : undefined
                }
                variant="contained"
                color="primary"
                onClick={(event) => {
                  props.setChatBoxLabelsPopoverAnchorEl(event.currentTarget);
                }}
                className={classes.labelAddButton}
              >
                Labels
              </Button>
              <Popover
                action={popoverActions}
                container={mainContainerRef.current}
                PaperProps={{ square: true }}
                id={"addLabelButton"}
                open={Boolean(props.chatBoxLabelsPopoverAnchorEl)}
                anchorEl={props.chatBoxLabelsPopoverAnchorEl}
                onClose={() => {
                  props.setChatBoxLabelsPopoverAnchorEl(null);
                }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <LabelsList
                  onItemClick={(item) => {
                    if (item.id == 0) {
                      props.setFollowUpDialogToggle(true);
                    } else {
                      addChatDetail({
                        variables: {
                          customerId: props.itemData.customerId,
                          pageId: props.itemData.pageId,
                          messageId: null,
                          messagetext: item.text,
                          messagetimestamp: new Date().toString(),
                          messagetype: "label",
                          agentId: props.authUserId,
                          alternateagentId: props.authUserId,
                        },
                      });
                    }
                  }}
                  update={() => {
                    if (popoverActions.current) {
                      popoverActions.current.updatePosition();
                    }
                  }}
                />
              </Popover>
              <TextField
                disabled={!props.userPanelChatOnline}
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    addMessageInputText();
                  }
                }}
                value={props.chatBoxMessageTextInput}
                onInput={(e) =>
                  props.setChatBoxMessageTextInput(e.target.value)
                }
                InputProps={{
                  classes: {
                    input: classes.messageInput,
                  },
                }}
                classes={{
                  root: classes.messageInputRoot,
                }}
                placeholder={"Type message"}
                autoFocus
              ></TextField>
              <IconButton
                disabled={!props.userPanelChatOnline}
                onClick={() => {
                  addMessageInputText();
                }}
                className={classes.sendMessageButton}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Container>
        </>
      )}
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    ...state.ChatBoxReducer,
    ...state.UserPanelReducer,
    ...state.AuthReducer,
    ...state.FollowUpDialogReducer,
  };
};
export default connect(mapStateToProps, {
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
  setChatBoxLabelsPopoverAnchorEl,
  setChatBoxCustomerFormData,
  setChatBoxMessageData,
  setFollowUpDialogToggle,
  setFollowUpDialogDateTime,
  setChatBoxWindowSize,
  setChatBoxMessageTextInput,
})(ChatContainer);
