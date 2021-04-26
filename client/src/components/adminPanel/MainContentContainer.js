import React from "react";
import { Typography } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { setAdminPanelDrawerToggle } from "../../store/actions/AdminpanelActions";
import AddUsers from "./addUsers";
import AddDesignations from "./addDesignations";
import AddProfiles from "./addProfiles";
import AddPages from "./addPages";
const useStyles = makeStyles((theme) => ({
  mainContentContainer: {
    flexGrow: 1,
    padding: 0,
  },
  drawerShift: {
    marginLeft: 240,
    width: `calc(100% - ${240}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerShiftInverse: {
    marginLeft: theme.spacing(7) + 2,
    width: `calc(100% - ${theme.spacing(7) + 2}px)`,
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(9) + 2,
      width: `calc(100% - ${theme.spacing(9) + 2}px)`,
    },
  },
}));

const MainContentContainer = (props) => {
  const classes = useStyles();

  return (
    <main
      className={clsx(classes.mainContentContainer, {
        [classes.drawerShift]: props.adminPanelDrawerToggle,
        [classes.drawerShiftInverse]: !props.adminPanelDrawerToggle,
      })}
      style={{
        marginTop: props.adminPanelAppBarHeight,
        width: `calc(100% - ${props.adminPanelDrawerWidth}px)`,
      }}
    >
      <Switch>
        <Route exact path={["/addusers", "/admin", "/"]}>
          <AddUsers />
        </Route>
        <Route path="/adddesignations">
          <AddDesignations />
        </Route>
        <Route path="/addprofiles">
          <AddProfiles />
        </Route>
        <Route path="/addpages">
          <AddPages />
        </Route>
      </Switch>
    </main>
  );
};

const mapStateToProps = (state) => {
  return { ...state.AdminPanelReducer };
};
export default connect(mapStateToProps, {
  setAdminPanelDrawerToggle,
})(MainContentContainer);
