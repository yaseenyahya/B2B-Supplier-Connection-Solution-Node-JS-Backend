import React, { Component } from "react";

import { List, Divider, Container } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { connect } from "react-redux";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { setAdminPanelDrawerToggle } from "../../store/actions/AdminpanelActions";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import FacebookIcon from "@material-ui/icons/Facebook";
import MessageIcon from "@material-ui/icons/Message";
import { useLocation } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  navListItem: {
    "&:hover": {
      "& *": {
        color: "white",
        fontWeight: "500",
        transition: theme.transitions.create(["color"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
          delay: 100,
        }),
      },
    },
  },
  navListIcon: {
    color: "rgb(255 255 255 / 80%)",
    fontSize: 35,
  },
  navListText: {
    color: "rgb(255 255 255 / 80%)",
  },
  listLink: {
    textDecoration: "none",
    marginLeft: 5,
    display: "block",
  },
  linkSelected: {
    borderLeft: "5px solid #79c646",
    marginLeft: 0,
  },
}));

const NavigationList = (props) => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <Container
      disableGutters={true}
      onMouseEnter={() => {
        if (!props.adminPanelDrawerToggle && props.adminPanelClosedDrawerToggle)
          props.setAdminPanelDrawerToggle(true);
      }}
      onMouseLeave={() => {
        if (props.adminPanelDrawerToggle && props.adminPanelClosedDrawerToggle)
          props.setAdminPanelDrawerToggle(false);
      }}
    >
      <List disablePadding={true}>
        <Link
          to="/addusers"
          className={clsx(classes.listLink, {
            [classes.linkSelected]:
              location.pathname == "/addusers" || location.pathname == "/admin" || location.pathname == "/",
          })}
        >
          <ListItem button key={"addusers"} className={classes.navListItem}>
            <ListItemIcon>
              <GroupAddIcon className={classes.navListIcon} />
            </ListItemIcon>
            <ListItemText
              className={classes.navListText}
              primary={"Add Users"}
            />
          </ListItem>
        </Link>
        <Link
          to="/adddesignations"
          className={clsx(classes.listLink, {
            [classes.linkSelected]:
              location.pathname == "/adddesignations" ,
          })}
        >
          <ListItem
            button
            key={"adddesignations"}
            className={classes.navListItem}
          >
            <ListItemIcon>
              <SupervisorAccountIcon className={classes.navListIcon} />
            </ListItemIcon>
            <ListItemText
              className={classes.navListText}
              primary={"Add Designations"}
            />
          </ListItem>
        </Link>
        <Link
          to="/addprofiles"
          className={clsx(classes.listLink, {
            [classes.linkSelected]:
              location.pathname == "/addprofiles" ,
          })}
        >
          <ListItem button key={"addprofiles"} className={classes.navListItem}>
            <ListItemIcon>
              <AssignmentIndIcon className={classes.navListIcon} />
            </ListItemIcon>
            <ListItemText
              className={classes.navListText}
              primary={"Add Profiles"}
            />
          </ListItem>
        </Link>
        <Link
          to="/addpages"
          className={clsx(classes.listLink, {
            [classes.linkSelected]:
              location.pathname == "/addpages" ,
          })}
        >
          <ListItem button key={"addpages"} className={classes.navListItem}>
            <ListItemIcon>
              <FacebookIcon className={classes.navListIcon} />
            </ListItemIcon>
            <ListItemText
              className={classes.navListText}
              primary={"Add Pages"}
            />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        <Link
          to="/chat"
          className={clsx(classes.listLink, {
            [classes.linkSelected]:
              location.pathname == "/chat" ,
          })}
        >
          <ListItem button key={"Chat"}>
            <ListItemIcon>
              <MessageIcon className={classes.navListIcon} />
            </ListItemIcon>
            <ListItemText className={classes.navListText} primary={"Chat"} />
          </ListItem>
        </Link>
      </List>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return { ...state.AdminPanelReducer };
};
export default connect(mapStateToProps, {
  setAdminPanelDrawerToggle,
})(NavigationList);
