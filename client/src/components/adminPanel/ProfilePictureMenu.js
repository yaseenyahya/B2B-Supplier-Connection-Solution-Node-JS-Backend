import React, { Component,useEffect } from "react";

import {
  IconButton,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Paper,
  Popper,
  Grow,
} from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { setAdminPanelProfilePicMenuAnchorEl } from "../../store/actions/AdminpanelActions";
import LazyLoad from "react-lazyload";
import Auth from "../../auth/auth";
import { setRedirectToPath } from "../../store/actions/RedirectToPathActions";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const useStyles = makeStyles((theme) => ({
  profilePicture: {
    width: 55,
    border: "1px solid #beb7b7",
    borderRadius: "50%",
    height: 55
  },
  profilePicMenuPaper: {
    background: "rgb(26 39 51 / 73%)",
    borderRadius: 0,
  },
  profilePicMenuItem: {
    color: "white",
  },
}));

const ProfilePictureMenu = (props) => {
  const classes = useStyles();

  const handleProfilePicMenuClick = (event) => {
    props.setAdminPanelProfilePicMenuAnchorEl(event.currentTarget);
  };

  const handleProfilePicMenuClose = () => {
    props.setAdminPanelProfilePicMenuAnchorEl(null);
  };
  const LogoutQuery = gql`
    mutation {
      logout {
        success
        error
      }
    }
  `;

  let [
    logout,
    {
      loading: logoutQueryLoading,
      error: logoutQueryError,
      data: logoutQueryResult,
    },
  ] = useMutation(LogoutQuery);
  useEffect(() => {
    if (logoutQueryResult && logoutQueryResult.logout) {
      window.location = "/login";
    }
  }, [logoutQueryResult]);

  return (
    <>
      <IconButton
        onClick={handleProfilePicMenuClick}
        aria-controls={
          Boolean(props.adminPanelProfilePicMenuAnchorEl)
            ? "menu-list-grow"
            : undefined
        }
        aria-haspopup="true"
      >
        <LazyLoad height={200}>
          {props.profilePicture ? (
            <img src={props.profilePicture}  className={classes.profilePicture}/>
          ) : (
            <img
              className={classes.profilePicture}
              src={process.env.PUBLIC_URL + "/noprofileimagesmall.jpg"}
            />
          )}
        </LazyLoad>
      </IconButton>
      <Popper
        open={Boolean(props.adminPanelProfilePicMenuAnchorEl)}
        anchorEl={props.adminPanelProfilePicMenuAnchorEl}
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
            <Paper className={classes.profilePicMenuPaper}>
              <ClickAwayListener onClickAway={handleProfilePicMenuClose}>
                <MenuList
                  autoFocusItem={Boolean(
                    props.adminPanelProfilePicMenuAnchorEl
                  )}
                  id="menu-list-grow"
                  keepMounted
                >
                  <MenuItem
                    className={classes.profilePicMenuItem}
                    onClick={async () => {
                      logout();
                      handleProfilePicMenuClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

const mapStateToProps = (state) => {
  return { ...state.AdminPanelReducer };
};
export default connect(mapStateToProps, {
  setAdminPanelProfilePicMenuAnchorEl,
  setRedirectToPath,
})(ProfilePictureMenu);
