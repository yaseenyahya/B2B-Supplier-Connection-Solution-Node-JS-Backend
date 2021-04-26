import React, { Component, useEffect, useRef } from "react";

import {
  IconButton,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Paper,
  Popper,
  Grow,
  Avatar,
  Typography,
  Container,
} from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  setNotificationMenuAnchorEl,
  setNotificationMenuData,
  setNotificationMenuShowAlert,
} from "../store/actions/NotificationMenuActions";
import {
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
} from "../store/actions/ChatBoxActions";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import moment from "moment";
import { Flicker, Jitter, Blink } from "react-flicker";
import clsx from "clsx";
import _ from "lodash";
import includes from "./chatBox/includes";
import FacebookAvatar from "./chatBox/FacebookAvatar";
import FacebookTypography from "./chatBox/FacebookTypography";
const useStyles = makeStyles((theme) => ({
  notificationIcon: {
    fontSize: 30,
    color: "gray",
  },

  notificationCountIcon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    position: "absolute",
    top: -2,
    right: -2,
    background: "#ff000082",
    fontSize: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 600,
    color: "white",
  },
  notificationMenuPaper: {
    background: "white",
    borderRadius: 0,
    border: "1px solid gray",
    borderRadius: 5,
  },
  notificationMenuItem: {
    color: "black",
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 3,
    borderBottom: "1px solid #cecaca",
    display: "flex",
    flexDirection: "column",
  },
  notificationMenuItemNotRead: {
    borderLeft: "2px solid #ff000082",
  },
  followupDetailText: {
    display: "block",
    fontSize: 11,
    color: "gray",
    marginTop: 8,
  },
  customerDetailText: {},
  pageImage: {
    width: 30,
    height: 30,
    marginRight: 4,
  },
  customerImage: {
    width: 30,
    height: 30,
    marginRight: 4,
  },
  customerDetailsContainer: {
    display: "flex",
  },
}));

const NotificationMenu = (props) => {
  const classes = useStyles();
  const NOTIFICATION_INTERVAL_TIMER = 30000;
  const GetFollowupByAgentIdQuery = gql`
    query GetFollowupByAgentId {
      getfollowupbyagentid {
        success
        error
        result
      }
    }
  `;

  let [
    getFollowupByAgentId,
    {
      loading: getFollowupByAgentIdQueryQueryLoading,
      error: getFollowupByAgentIdQueryQueryError,
      data: getFollowupByAgentIdQueryQueryResult,
    },
  ] = useLazyQuery(GetFollowupByAgentIdQuery, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (
      getFollowupByAgentIdQueryQueryResult &&
      getFollowupByAgentIdQueryQueryResult.getfollowupbyagentid
    ) {
      if (getFollowupByAgentIdQueryQueryResult.getfollowupbyagentid.success) {
        var parseData = JSON.parse(
          getFollowupByAgentIdQueryQueryResult.getfollowupbyagentid.result
        );

        var haveNewNotification = false;
        parseData.map((item) => {
          if (!haveNewNotification) {
            var itemAvail = _.find(
              props.notificationMenuData,
              (notityItem) => notityItem.id == item.id
            );
            if (!itemAvail) haveNewNotification = true;
          }
        });

        if (haveNewNotification) props.setNotificationMenuShowAlert(true);

        props.setNotificationMenuData(_.reverse(parseData));
      }
    }
  }, [getFollowupByAgentIdQueryQueryResult]);

  var notificationInterval = null;
  useEffect(() => {
    notificationInterval = setInterval(() => {
      getFollowupByAgentId();
    }, NOTIFICATION_INTERVAL_TIMER);
    getFollowupByAgentId();
    return () => {
      clearInterval(notificationInterval);
    };
  }, []);

  const MarkReadChatQuery = gql`
    mutation MarkReadChat($id: ID!) {
      markreadchat(id: $id) {
        success
        error
      }
    }
  `;

  let [
    markReadChat,
    {
      loading: markReadChatQueryLoading,
      error: markReadChatQueryError,
      data: markReadChatQueryResult,
    },
  ] = useMutation(MarkReadChatQuery);

  useEffect(() => {
    if (markReadChatQueryResult && markReadChatQueryResult.markreadchat) {
      if (markReadChatQueryResult.markreadchat.success) {
        getFollowupByAgentId();
      } else {
        //error
      }
    }
  }, [markReadChatQueryResult]);
  const handleNotificationMenuClick = (event) => {
    if (props.notificationMenuData && props.notificationMenuData.length > 0) {
      props.setNotificationMenuAnchorEl(event.currentTarget);
      props.setNotificationMenuShowAlert(false);
    }
  };

  const handleNotificationPicMenuClose = () => {
    props.setNotificationMenuAnchorEl(null);
  };
  const mainContainerRef = useRef(null);
  return (
    <div ref={mainContainerRef}>
      <IconButton onClick={handleNotificationMenuClick}>
        {props.notificationMenuData &&
          props.notificationMenuData.length > 0 &&
          (props.notificationMenuShowAlert ? (
            <Blink>
              <span className={classes.notificationCountIcon}>
                {props.notificationMenuData.length}
              </span>
            </Blink>
          ) : (
            <span className={classes.notificationCountIcon}>
              {props.notificationMenuData.length}
            </span>
          ))}
        <NotificationsNoneIcon className={classes.notificationIcon} />
      </IconButton>
      <Popper
        open={Boolean(props.notificationMenuAnchorEl)}
        anchorEl={props.notificationMenuAnchorEl}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper className={classes.notificationMenuPaper}>
              <ClickAwayListener onClickAway={handleNotificationPicMenuClose}>
                <MenuList
                  autoFocusItem={Boolean(props.notificationMenuAnchorEl)}
                  id="menu-list-grow"
                  keepMounted
                >
                  {props.notificationMenuData.map((item) => {
                    var text = JSON.parse(item.textJson);
                    return (
                      <MenuItem
                        className={clsx(classes.notificationMenuItem, {
                          [classes.notificationMenuItemNotRead]: !item.read,
                        })}
                        onClick={async () => {
                          new includes().bindItemToMainChat(
                            {
                              pageId: item.pageId,
                              customerId: item.customerId,
                              pageName: "",
                              customerName: "",
                              lastMessage: null,
                              lastMessageTimeStamp: null,
                              selected: false,
                              messageId: null,
                              read: item.read,
                              loading: false,
                            },
                            props.chatBoxRecentChatListData,
                            props.setChatBoxRecentChatListData,
                            props.chatBoxSelectedChatsOnFloating,
                            props.setChatBoxSelectedChatsOnFloating
                          );

                          markReadChat({
                            variables: {
                              id: item.id,
                            },
                          });
                          handleNotificationPicMenuClose();
                        }}
                      >
                        <Container
                          className={classes.customerDetailsContainer}
                          disableGutters={true}
                        >
                          <FacebookAvatar
                            item={item}
                            type={"page"}
                            variant={"rounded"}
                            className={classes.pageImage}
                          ></FacebookAvatar>
                          <FacebookAvatar
                            item={item}
                            type={"customer"}
                            variant={"rounded"}
                            className={classes.customerImage}
                          ></FacebookAvatar>
                          <FacebookTypography
                            item={item}
                            className={classes.customerDetailText}
                          ></FacebookTypography>
                        </Container>
                        <Typography className={classes.followupDetailText}>
                          {`${text[0]} at ${moment(
                            text[1],
                            "yyyy-MM-DDTHH:mm"
                          ).format("yyyy-MM-DD hh:mm A")}`}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { ...state.NotificationMenuReducer, ...state.ChatBoxReducer };
};
export default connect(mapStateToProps, {
  setNotificationMenuAnchorEl,
  setNotificationMenuData,
  setNotificationMenuShowAlert,
  setChatBoxRecentChatListData,
  setChatBoxSelectedChatsOnFloating,
})(NotificationMenu);
