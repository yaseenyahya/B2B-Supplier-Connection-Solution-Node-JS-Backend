import React, { useState, useEffect } from "react";

import { Checkbox, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
  },
  facebookPageImg: {
    width: 50,
    height: 50,
    marginTop: 3,
    marginBottom: 5,
    borderRadius: "50%",
  },
  facebookPageName: {
    marginLeft: 20,
    display: "flex",
    alignItems: "center",
    fontSize: 20,
  },
}));
const FacebookList = (props) => {
  const classes = useStyles();
  const [facebookPageImg, setFacebookPageImg] = useState("");
  useEffect(() => {
    window.FB.api(
      `/${props.facebookPageId}/picture`,
      {
        redirect: "0",
      },
      function (responsePicture) {
        if (responsePicture && !responsePicture.error) {

          setFacebookPageImg(responsePicture.data.url);
        }
      }
    );
  }, [props.facebookPageId]);

  return (
    <Container disableGutters={true} className={classes.mainContainer}>
      {props.checkBox && (
        <Checkbox
      
          onChange={(event) => {
            props.onChange(event.target.checked,props.facebookPageId);
          }}
        ></Checkbox>
      )}
      <img className={classes.facebookPageImg} src={facebookPageImg}></img>
      <Typography className={classes.facebookPageName}>
        {props.facebookPageName}
      </Typography>
    </Container>
  );
};

export default FacebookList;
