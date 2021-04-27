import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ChatContainer from "./ChatContainer";
import includes from "./includes";
import { Avatar } from "@material-ui/core";
import { connect } from "react-redux";
import { setChatBoxFacebookIDsWithProfileDetails } from "../../store/actions/ChatBoxActions";

const useStyles = makeStyles((theme) => ({}));

const FacebookAvatar = (props) => {
  const classes = useStyles();

  const [src, setSrc] = useState(null);
  const { item, type } = props;
  const includesObj = new includes();
  useEffect(() => {

    getData();
  }, [item]);

  const getData = () => {
    if (type == "page")
      includesObj.resolvePageInfo(
        window.FB,
        item.pageId,
        props.chatBoxFacebookIDsWithProfileDetails,
        props.setChatBoxFacebookIDsWithProfileDetails,
        setImageCallBack,
        props.authPagesData
      );
    else if (type == "customer") {
      includesObj.resolveClientInfo(
        window.FB,
        item.customerId,
        item.pageId,
        props.chatBoxFacebookIDsWithProfileDetails,
        props.setChatBoxFacebookIDsWithProfileDetails,
        setImageCallBack,
        props.authPagesData
      );
    }
  };
  const setImageCallBack = (result) => {
    console.log("facebookAvatar",result)
    if(result)
    setSrc(result.image);
  };
  return (
    <Avatar key={src}
      className={props.className}
      src={src}
      variant={props.variant}
    ></Avatar>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.ChatBoxReducer,
    ...state.AuthReducer
  };
};
export default connect(mapStateToProps, {
  setChatBoxFacebookIDsWithProfileDetails,
})(FacebookAvatar);
