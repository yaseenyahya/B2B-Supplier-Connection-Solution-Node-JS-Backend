import React, { Component, useEffect,useRef } from "react";

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
import SettingsIcon from "@material-ui/icons/Settings";
import { setUserPanelSettingsMenuAnchorEl } from "../../store/actions/UserPanelActions";
import { setAccountUserInfoSettingsModalToggle } from "../../store/actions/AccountUserInfoSettingsModalActions";
import AccountUserInfoSettingsModal from "../AccountUserInfoSettingsModal";
const useStyles = makeStyles((theme) => ({
  settingsIcon: {
    fontSize: 30,
    color: "gray",
  },
  settingsMenuPaper: {
    background: "rgb(26 39 51 / 73%)",
    borderRadius: 0,
  },
  settingsMenuItem: {
    color: "white",
  },
}));

const SettingsMenu = (props) => {
  const classes = useStyles();

  const handleSettingsMenuClick = (event) => {
    props.setUserPanelSettingsMenuAnchorEl(event.currentTarget);
  };

  const handleSettingsPicMenuClose = () => {
    props.setUserPanelSettingsMenuAnchorEl(null);
  };
  const mainContainerRef = useRef(null);
  return (
    <div ref={mainContainerRef}>
      <IconButton
        onClick={handleSettingsMenuClick}
        aria-controls={
          Boolean(props.userPanelSettingsMenuAnchorEl)
            ? "menu-list-grow"
            : undefined
        }
        aria-haspopup="true"
      >
        <SettingsIcon className={classes.settingsIcon} />
      </IconButton>
      <AccountUserInfoSettingsModal mainContainerRef={mainContainerRef}/>
      <Popper
        open={Boolean(props.userPanelSettingsMenuAnchorEl)}
        anchorEl={props.userPanelSettingsMenuAnchorEl}
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
            <Paper className={classes.settingsMenuPaper}>
              <ClickAwayListener onClickAway={handleSettingsPicMenuClose}>
                <MenuList
                  autoFocusItem={Boolean(props.userPanelSettingsMenuAnchorEl)}
                  id="menu-list-grow"
                  keepMounted
                >
                  <MenuItem
                    className={classes.settingsMenuItem}
                    onClick={async () => {
                      handleSettingsPicMenuClose();
                      props.setAccountUserInfoSettingsModalToggle(true);
                    }}
                  >
                    Account Settings
                  </MenuItem>
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
  return { ...state.UserPanelReducer };
};
export default connect(mapStateToProps, {
  setAccountUserInfoSettingsModalToggle,
  setUserPanelSettingsMenuAnchorEl,
})(SettingsMenu);