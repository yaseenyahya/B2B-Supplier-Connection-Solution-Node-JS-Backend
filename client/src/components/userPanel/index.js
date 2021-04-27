import React, { useEffect, useRef } from "react";

import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import expressConfig from "../../config/express.json";
import {
  setUserPanelFullscreenToggle,
  setUserPanelAppBarHeight,
  setUserPanelChatOnline,
  setUserpanelWsSubscriptionReady,
} from "../../store/actions/UserPanelActions";
import Fullscreen from "fullscreen-react";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import ProfilePictureMenu from "./ProfilePictureMenu";
import NotificationMenu from "../NotificationMenu";
import { Redirect } from "react-router-dom";
import { setRedirectToPath } from "../../store/actions/RedirectToPathActions";
import SettingsMenu from "./SettingsMenu";
import ChatBox from "../chatBox";
import ChatBoxCustomerFormModal from "../chatBox/ChatBoxCustomerFormModal";
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    background: "white",
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "white",
    boxShadow:
      "0px 2px 4px -1px rgb(18 17 17 / 1%), 0px 4px 5px 0px rgb(0 0 0 / 18%), 0px 1px 10px 0px rgb(48 48 48 / 13%)",
  },
  appBarShift: {},
  appBarShiftInverse: {},
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  textFieldInputRoot: {
    width: "100%",

    borderRadius: "0!important",
    "&:before": {
      borderBottom: "0!important",
    },
    "&:after": {
      borderBottom: "0!important",
    },
    padding: "0",
  },
  searchTodayChatsTextField: { width: "100%" },
  textField: { width: "100%" },
  textFieldInput: {
    width: "100%",
    border: 0,
    height: "1.1876em",
    margin: 0,
    display: "block",
    padding: 11.3,
  },

  fullscreenIcon: {
    fontSize: 35,
  },

  userInfoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  usernameText: {
    fontSize: 20,
    marginRight: 15,
    color: "black",
  },
  onlineStatusSwitchLabel: {
    color: "black",
    fontSize: 21,
  },
  recentPagesLeftPane: {
    borderRight: "1px solid #dedede",
    flex: 0.2,
    margin: 0,
  },
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
  },
  listItemButton: {
    borderBottom: "1px solid #d0cfcf",
  },
  profilePic: {
    paddingBottom: 0,
    paddingTop: 5,
  },
  logo: {
    width: 65,
    margin: "0 15px",
  },
}));

const UserPanel = (props) => {
  const classes = useStyles();

  const drawerRef = useRef(null);

  const handleFullScreenToggle = () => {
    if (props.userPanelFullscreenToggle)
      props.setUserPanelFullscreenToggle(false);
    else props.setUserPanelFullscreenToggle(true);
  };

  useEffect(() => {
    if (props.userPanelChatOnline && props.authUserId) {
      const env = process.env.NODE_ENV || "development";
      const config = expressConfig[env];
console.log("props.userPanelChatOnline, props.authUserId","triggered tryReconnect");
      props.wsLink.subscriptionClient.url = `${config.graphql_subscription_domain}:${config.port}/${config.graphql_subscription_endpoint}?userId=${props.authUserId}`;
      props.wsLink.subscriptionClient.connect();
      //wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () =>
     // wsLink.subscriptionClient.maxConnectTimeGenerator.max;
      props.setUserpanelWsSubscriptionReady(true);
    } else {
      console.log("props.userPanelChatOnline, props.authUserId","triggered close");
     console.log("stauts",props.wsLink.subscriptionClient.checkConnection())
      props.wsLink.subscriptionClient.close(true,true);
      props.setUserpanelWsSubscriptionReady(false);
    }
  }, [props.userPanelChatOnline, props.authUserId]);

  const MeQuery = gql`
    query Me($accessToken: String) {
      me(accessToken: $accessToken) {
        id
        name
        picture
        pseudonym
        designation {
          name
        }
      }
    }
  `;

  let {
    loading: meQueryLoading,
    error: meQueryQueryError,
    data: meQueryResult,
  } = useQuery(MeQuery, {
    fetchPolicy: "network-only",
  });

  const appBarRef = useRef(null);

  if (props.redirectToPath) {
    const path = props.redirectToPath;
    props.setRedirectToPath(null);
    return <Redirect to={{ pathname: path }} />;
  }

  return (
    <Fullscreen isEnter={props.userPanelFullscreenToggle}>
      <Container
        maxWidth={false}
        disableGutters={true}
        className={classes.mainContainer}
      >
        <AppBar
          onLoad={() => {
            if (appBarRef.current)
              props.setUserPanelAppBarHeight(appBarRef.current.clientHeight);
          }}
          ref={appBarRef}
          position="fixed"
          className={clsx(classes.appBarShift, classes.appBar)}
        >
          <Toolbar disableGutters={true}>
            <img
              className={classes.logo}
              src={process.env.PUBLIC_URL + "/greenmarketingicon.png"}
              alt="logo"
            ></img>

            <IconButton onClick={handleFullScreenToggle}>
              {!props.userPanelFullscreenToggle ? (
                <FullscreenIcon className={classes.fullscreenIcon} />
              ) : (
                <FullscreenExitIcon className={classes.fullscreenIcon} />
              )}
            </IconButton>

            <FormControlLabel
              classes={{ label: classes.onlineStatusSwitchLabel }}
              control={
                <Switch
                  checked={Boolean(props.userPanelChatOnline)}
                  onChange={(event) => {
                    props.setUserPanelChatOnline(event.target.checked);
                  }}
                  name="onlineStatus"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              }
              label={props.userPanelChatOnline ? "Online" : "Offline"}
            />

            <Box
              flex={1}
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
            >
              <Container
                maxWidth={false}
                disableGutters={true}
                className={classes.userInfoContainer}
              >
                <Typography
                  variant="h6"
                  noWrap
                  className={classes.usernameText}
                >
                  {meQueryResult && meQueryResult.me.name}
                </Typography>
                <ProfilePictureMenu
                  profilePicClassName={classes.profilePic}
                  profilePicture={meQueryResult && meQueryResult.me.picture}
                />
              </Container>
              <NotificationMenu />
              <SettingsMenu />
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          width="100%"
          display="flex"
          style={{
            marginTop: props.userPanelAppBarHeight,
            height: "calc(100vh - " + props.userPanelAppBarHeight + "px)",
          }}
        >
          <ChatBox />
          {props.chatBoxCustomerFormData.map((data) => {
            return (
              <ChatBoxCustomerFormModal
                modalData={data.modalData}
                customerData={data.customerData}
                formData={data.formData}
              />
            );
          })}
        </Box>
      </Container>
    </Fullscreen>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.UserPanelReducer,
    ...state.RedirectToPathReducer,
    ...state.AuthReducer,
    ...state.ChatBoxReducer,
  };
};
export default connect(mapStateToProps, {
  setRedirectToPath,
  setUserPanelFullscreenToggle,
  setUserPanelAppBarHeight,
  setUserPanelChatOnline,
  setUserpanelWsSubscriptionReady,
})(UserPanel);
