import React, { useEffect, useRef, useState } from "react";
import { Container, Grid, useMediaQuery } from "@material-ui/core";

import { Redirect } from "react-router-dom";
import { auth } from "../../auth/auth";
import { connect } from "react-redux";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import { AnimateGroup } from "react-animation";
import LoginForm from "./LoginForm";
import ForgetPasswordForm from "./ForgetPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { setRedirectToPath } from "../../store/actions/RedirectToPathActions";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    background: "#2e3e4e",
  },

  logoImg: {
    width: "70%",
    display: "block",
    margin: "auto",
  },
  logoImgSmallScreen: {
    display: "block",
    margin: "auto",
    marginBottom: "15px",
    marginTop: "5px",
    width: "50%",
  },
  fullHeight: {
    minHeight: "100vh",
  },
}));

const LoginForgetPassword = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const isScreenSmall = useMediaQuery(theme.breakpoints.only("sm"));
  const isScreenExtraSmall = useMediaQuery(theme.breakpoints.only("xs"));

  useEffect(() => {
    if (props.loginForgetPasswordToggleFormName == "login")
      document.title = props.titleLogin;
    else document.title = props.titleForgetPassword;
  }, [props.loginForgetPasswordToggleFormName]);

  if (props.redirectToPath) {
    const path = props.redirectToPath;
    props.setRedirectToPath(null);
    return <Redirect to={{ pathname: path }} />;
  }

  const logoImg = (
    <img
      className={clsx({
        [classes.logoImgSmallScreen]: isScreenExtraSmall || isScreenSmall,
        [classes.logoImg]: !isScreenExtraSmall && !isScreenSmall,
      })}
      src={process.env.PUBLIC_URL + "/greenmarketinglogo.png"}
      alt="logo"
    ></img>
  );

  const loginForgetPasswordToggleFormName =
    props.match.path == "/resetpassword/:token"
      ? "resetpassword"
      : props.loginForgetPasswordToggleFormName;

  return (
    <Container
      maxWidth={false}
      className={clsx(classes.mainContainer, classes.fullHeight)}
    >
      <Container disableGutters={true}>
        <Grid
          direction={isScreenExtraSmall || isScreenSmall ? "column" : "row"}
          container
          className={classes.fullHeight}
          alignItems={"center"}
        >
          {!isScreenSmall && !isScreenExtraSmall ? (
            <Grid item xs={0} sm={0} md={6} lg={6} xl={6}>
              {logoImg}
            </Grid>
          ) : null}
          <Grid item alignContent="center" xs={12} sm={12} md={6} lg={6} xl={6}>
            {isScreenSmall || isScreenExtraSmall ? logoImg : null}
            <AnimateGroup animation="fade">
              {loginForgetPasswordToggleFormName == "login" ? (
                <LoginForm key="login" />
              ) : loginForgetPasswordToggleFormName == "forgetpassword" ? (
                <ForgetPasswordForm key="forgetpassword" />
              ) : (
                <ResetPasswordForm
                  token={props.match.params.token}
                  key="resetpassword"
                />
              )}
            </AnimateGroup>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    ...state.LoginForgetPasswordReducer,
    ...state.RedirectToPathReducer,
  };
};
export default connect(mapStateToProps, { setRedirectToPath })(
  LoginForgetPassword
);
