import React, { useRef } from "react";

import {
  Container,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  Typography,
  IconButton,
  Box,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { connect } from "react-redux";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { makeStyles } from "@material-ui/core/styles";
import { BrowserRouter } from "react-router-dom";
import clsx from "clsx";
import {
  setAdminPanelDrawerToggle,
  setAdminPanelFullscreenToggle,
  setAdminPanelAppBarHeight,
  setAdminPanelClosedDrawerToggle,
  setAdminPanelChatOnline,
} from "../../store/actions/AdminpanelActions";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import Fullscreen from "fullscreen-react";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import NavigationList from "./NavigationList";
import MainContentContainer from "./MainContentContainer";
import ProfilePictureMenu from "./ProfilePictureMenu";
import { Redirect } from "react-router-dom";
import { setRedirectToPath } from "../../store/actions/RedirectToPathActions";
import SettingsMenu from "./SettingsMenu";
const drawerWidth = 240;
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
      "0px 2px 4px -1px rgb(0 0 0 / 5%), 0px 4px 5px 0px rgb(0 0 0 / 5%), 0px 1px 10px 0px rgb(0 0 0 / 5%)",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarShiftInverse: {
    marginLeft: theme.spacing(7) + 2,
    width: `calc(100% - ${theme.spacing(7) + 2}px)`,
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(9) + 2,
      width: `calc(100% - ${theme.spacing(9) + 2}px)`,
    },
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    background: "#1a2733",
    position: "absolute",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  drawerPaper: {
    background: "#1a2733",
    scrollbarWidth: "thin",
    scrollbarColor: "var(--thumbBG) var(--scrollbarBG)",
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#87939f",
      outline: "1px solid slategrey",
    },
  },
  drawerToolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    background: "#2e3e4e",
    ...theme.mixins.toolbar,
  },

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
  fullscreenIcon: {
    fontSize: 35,
  },
  drawerLogoIcon: {
    width: 40,
    margin: "auto",
  },
  drawerLogoLarge: {
    width: "100%",
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
}));

const AdminPanel = (props) => {
  const classes = useStyles();

  const drawerRef = useRef(null);

  const handleFullScreenToggle = () => {
    if (props.adminPanelFullscreenToggle)
      props.setAdminPanelFullscreenToggle(false);
    else props.setAdminPanelFullscreenToggle(true);
  };
  const handleDrawerToggle = () => {
    if (props.adminPanelDrawerToggle) {
      props.setAdminPanelDrawerToggle(false);
      props.setAdminPanelClosedDrawerToggle(true);
    } else {
      props.setAdminPanelDrawerToggle(true);
      props.setAdminPanelClosedDrawerToggle(false);
    }
  };
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
    <Fullscreen isEnter={props.adminPanelFullscreenToggle}>
      <Container
        maxWidth={false}
        disableGutters={true}
        className={classes.mainContainer}
      >
        <AppBar
          onLoad={() => {
            if (appBarRef.current)
              props.setAdminPanelAppBarHeight(appBarRef.current.clientHeight);
          }}
          ref={appBarRef}
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: props.adminPanelDrawerToggle,
            [classes.appBarShiftInverse]: !props.adminPanelDrawerToggle,
          })}
        >
          <Toolbar disableGutters={true}>
            <IconButton onClick={handleDrawerToggle}>
              {props.adminPanelDrawerToggle ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
            <IconButton onClick={handleFullScreenToggle}>
              {!props.adminPanelFullscreenToggle ? (
                <FullscreenIcon className={classes.fullscreenIcon} />
              ) : (
                <FullscreenExitIcon className={classes.fullscreenIcon} />
              )}
            </IconButton>
            {props.authSettings &&
              props.authSettings.Other &&
              props.authSettings.Other.Get_Online && (
                <FormControlLabel
                  classes={{ label: classes.onlineStatusSwitchLabel }}
                  control={
                    <Switch
                      checked={Boolean(props.adminPanelChatOnline)}
                      onChange={(event) => {
                        props.setAdminPanelChatOnline(event.target.checked);
                      }}
                      name="onlineStatus"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  }
                  label={props.adminPanelChatOnline ? "Online" : "Offline"}
                />
              )}

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
                  profilePicture={meQueryResult && meQueryResult.me.picture}
                />
              </Container>
              <IconButton onClick={() => {}}>
                <span className={classes.notificationCountIcon}>0</span>
                <NotificationsNoneIcon className={classes.notificationIcon} />
              </IconButton>
              <SettingsMenu />
            </Box>
          </Toolbar>
        </AppBar>
        <BrowserRouter>
          <Drawer
            ref={drawerRef}
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: props.adminPanelDrawerToggle,
              [classes.drawerClose]: !props.adminPanelDrawerToggle,
            })}
            classes={{
              paper: clsx(classes.drawerPaper, {
                [classes.drawerOpen]: props.adminPanelDrawerToggle,
                [classes.drawerClose]: !props.adminPanelDrawerToggle,
              }),
            }}
          >
            <div className={classes.drawerToolbar}>
              {props.adminPanelDrawerToggle ? (
                <img
                  className={classes.drawerLogoLarge}
                  key="logolarge"
                  src={process.env.PUBLIC_URL + "/greenmarketinglogo.png"}
                  alt="logolarge"
                />
              ) : (
                <img
                  className={classes.drawerLogoIcon}
                  key="logosmall"
                  src={process.env.PUBLIC_URL + "/greenmarketingicon.png"}
                  alt="logosmall"
                />
              )}
            </div>
            <Divider />
            <NavigationList />
          </Drawer>

          <MainContentContainer />
        </BrowserRouter>
      </Container>
    </Fullscreen>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.AdminPanelReducer,
    ...state.RedirectToPathReducer,
    ...state.AuthReducer,
  };
};
export default connect(mapStateToProps, {
  setRedirectToPath,
  setAdminPanelDrawerToggle,
  setAdminPanelFullscreenToggle,
  setAdminPanelAppBarHeight,
  setAdminPanelClosedDrawerToggle,
  setAdminPanelChatOnline,
})(AdminPanel);
