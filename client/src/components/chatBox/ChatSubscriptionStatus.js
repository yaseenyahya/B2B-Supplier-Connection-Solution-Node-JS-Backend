import React, { useEffect, useRef } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import clsx from "clsx";
const useStyles = makeStyles((theme) => ({
  statusContainer: {
    color: "white",
   
    display: "flex",
    padding: 8,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
  },
  backgroundConnected:{
    background: "rgb(102, 192, 71)",
  }, 
  backgroundDisconnected:{
    background: "#e14079",
  },

}));

const ChatSubscriptionStatus = (props) => {
  const classes = useStyles();

  return props.status ? (
    <Typography
      className={clsx(classes.statusContainer, {
        [classes.backgroundConnected]: props.status,
      })}
    >
      <DoneIcon className={classes.statusText} /> Connected
    </Typography>
  ) : (
    <Typography className={clsx(classes.statusContainer, {
      [classes.backgroundDisconnected]: !props.status,
    })}>
      <ClearIcon className={classes.statusText} /> Disconnected
    </Typography>
  );
};
export default ChatSubscriptionStatus;
