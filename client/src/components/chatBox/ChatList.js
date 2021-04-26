import React, { useEffect, useRef, useState } from "react";

import {
  Container,
  CircularProgress,
  ListItem,
  List,
  Avatar,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { setChatBoxRecentChatListData } from "../../store/actions/ChatBoxActions";
import FacebookAvatar from "./FacebookAvatar";
import FacebookTypography from "./FacebookTypography";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ReactTimeAgo from "react-timeago";
import _ from "lodash";
import moment from "moment";
import { connect } from "react-redux";
const useStyles = makeStyles((theme) => ({
  pageIcon: {
    position: "absolute",
    left: 1,
    background: "#737272",
  },
  customerIcon: {
    marginLeft: 10,
  },
  listItemPrimaryText: {
    fontWeight: "bolder",
    flex: 1,
    wordBreak: "break-all",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "break-spaces",
    maxHeight: 24,
  },
  listItemButton: {
    borderBottom: "1px solid #d0cfcf",
    paddingRight: 4,
  },
  loadingCircularProgress: {
    margin: "auto",
    display: "block",
    marginTop: 20,
  },
  selectedListItem: {
    background: "#eaeaea",
    borderLeft: "7px solid #c9c8c8",
  },
  listItemContainer: {
    display: "flex",
    flexDirection: "column",
  },
  timeStamp: {
    textAlign: "right",
    fontSize: 10,
    color: "#7e7e7e",
  },
  listItemAvatarAndTextContainer: {
    display: "flex",
  },
  listItemSecondaryText: {
    whiteSpace: "nowrap",
  },
}));

const ChatList = (props) => {
  const classes = useStyles();
  const [filterData, setfilterData] = useState(null);

  useEffect(() => {
    if (props.searchText.length > 0) {
      setfilterData(
        _.filter(
          props.data,
          (itm) =>
            itm.customerName
              .toLowerCase()
              .includes(props.searchText.toLowerCase()) ||
            itm.pageName.toLowerCase().includes(props.searchText.toLowerCase())
        )
      );
    } else {
      setfilterData(null);
    }
  }, [props.searchText, props.data]);

  var dataArray = filterData != null ? filterData : props.data;
  return props.isLoading ? (
    <CircularProgress className={classes.loadingCircularProgress} size={24} />
  ) : (
    <List className={props.className} style={{ height: props.containerHeight }}>
      {dataArray.map((item) => {
        return (
          <ListItem
            classes={{
              root: clsx({
                [classes.selectedListItem]: item.selected,
              }),
            }}
            onClick={() => {
              props.onItemClick(item);
            }}
            button
            className={classes.listItemButton}
          >
            <Container
              disableGutters={true}
              className={classes.listItemContainer}
            >
              <Container
                disableGutters={true}
                className={classes.listItemAvatarAndTextContainer}
              >
                <ListItemAvatar>
                  <FacebookAvatar key={item.pageId}
                    className={classes.pageIcon}
                    item={item}
                    type="page"
                  ></FacebookAvatar>
                  <FacebookAvatar key={item.customerId}
                    className={classes.customerIcon}
                    type="customer"
                    item={item}
                  ></FacebookAvatar>
                </ListItemAvatar>
                <ListItemText
                  classes={{
                    primary: classes.listItemPrimaryText,
                    secondary: classes.listItemSecondaryText,
                  }}
                  primary={
                    <FacebookTypography key={item.customerId}
                      pageNameChange={(name) => {
                        var findItem = _.find(
                          props.chatBoxRecentChatListData,
                          (list) =>
                            list.pageId == item.pageId &&
                            list.customerId == item.customerId
                        );
                        if (findItem) {
                          if (findItem.pageName != name) {
                            findItem.pageName = name;
                            props.setChatBoxRecentChatListData(
                              props.chatBoxRecentChatListData
                            );
                          }
                        }
                      }}
                      customerNameChange={(name) => {
                        var findItem = _.find(
                          props.chatBoxRecentChatListData,
                          (list) =>
                            list.pageId == item.pageId &&
                            list.customerId == item.customerId
                        );

                        if (findItem) {
                          if (findItem.customerName != name) {
                            findItem.customerName = name;
                            props.setChatBoxRecentChatListData(
                              props.chatBoxRecentChatListData
                            );
                          }
                        }
                      }}
                      item={item}
                    />
                  }
                  secondary={item.lastMessage}
                />
              </Container>
              <ReactTimeAgo
                className={classes.timeStamp}
                date={moment.unix(item.lastMessageTimeStamp / 1000)}
                locale="en-US"
              />
            </Container>
          </ListItem>
        );
      })}
    </List>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.ChatBoxReducer,
  };
};
export default connect(mapStateToProps, {
  setChatBoxRecentChatListData,
})(ChatList);
