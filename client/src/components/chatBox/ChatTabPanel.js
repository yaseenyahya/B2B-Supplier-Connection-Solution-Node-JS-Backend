import React, { useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import  ChatContainer  from "./ChatContainer";

const useStyles = makeStyles((theme) => ({
  chatMainContainer: {
    paddingTop: 3,
    paddingRight: 3,
    paddingLeft: 3,
  },
  chatTabHeader:{

  }
}));

const ChatTabPanel = (props) => {
  const classes = useStyles();
    const { children, id, selectedValue, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={id !== selectedValue}
        id={`simple-tabpanel-${id}`}
        aria-labelledby={`simple-tab-${id}`}
        {...other}
      >
        
            <ChatContainer chatBoxMesageBoxHeight={380} chatTabHeaderStyles={classes.chatTabHeader} chatMainContainerStyles={classes.chatMainContainer} itemData={props.itemData}/>
   
      </div>
    )
};


export default ChatTabPanel;
