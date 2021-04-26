import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ChatContainer from "./ChatContainer";
import includes from "./includes";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { setChatBoxFacebookIDsWithProfileDetails } from "../../store/actions/ChatBoxActions";

const useStyles = makeStyles((theme) => ({}));

const FacebookTypography = (props) => {
  const classes = useStyles();

  const [pageName, setPageName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const { item } = props;
  const includesObj = new includes();
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    includesObj.resolvePageInfo(
      window.FB,
      item.pageId,
      props.chatBoxFacebookIDsWithProfileDetails,
      props.setChatBoxFacebookIDsWithProfileDetails,
      pageCallBack
    );

    includesObj.resolveClientInfo(
      window.FB,
      item.customerId,
      props.chatBoxFacebookIDsWithProfileDetails,
      props.setChatBoxFacebookIDsWithProfileDetails,
      customerCallBack
    );
  };
  const pageCallBack = (result) => {
    setPageName(result.name);
    props.pageNameChange &&  props.pageNameChange(result.name);
  };
  const customerCallBack = (result) => {
    setCustomerName(result.name);
    props.customerNameChange &&  props.customerNameChange(result.name);
  };
  return (
    <Typography className={props.className}>
      {`${customerName}  @${pageName}`}
    </Typography>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state.ChatBoxReducer,
  };
};
export default connect(mapStateToProps, {
  setChatBoxFacebookIDsWithProfileDetails,
})(FacebookTypography);
