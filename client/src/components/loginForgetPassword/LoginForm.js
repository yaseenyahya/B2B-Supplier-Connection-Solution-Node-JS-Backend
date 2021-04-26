import React, { useState, useEffect, useRef } from "react";
import {
  FormControl,
  Container,
  Button,
  CircularProgress,
  Link,
  Typography,
} from "@material-ui/core";
import ValidationTextField from "../../otherComponents/ValidationTextField";
import * as Scroll from "react-scroll";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import {
  setLoginUsernameText,
  setLoginPasswordText,
  setLoginForgetPasswordToggleFormName,
} from "../../store/actions/LoginForgetPasswordActions";
import { setRedirectToPath } from "../../store/actions/RedirectToPathActions";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    background: "white",

    width: "100%",
    padding: "40px",
    margin: "15px 0",
  },

  form: {
    display: "block",
    marginBottom: "15px",
    marginTop: "15px",
  },
  textField: {
    width: "100%",
    borderRadius: 0,
  },
  textFieldRoot: {
    borderRadius: 0,
  },
  submitButton: {
    fontSize: 17,
    width: "100%",
    background: "#81ba53",
    color: "#FFFFFF",
    borderRadius: 0,
    "&:hover": {
      backgroundColor: "#81ba53",
    },
  },
  textFieldNotchedOutline: {
    borderWidth: "1px!important",
    top: "0px",
    borderRadius:0
  },
  textFieldInput: {
    padding: "15px 14px",
  },
  formControl: {
    display: "block",
    marginBottom: "15px",
    marginTop: "15px",
  },
}));

const LoginForm = (props) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const scrollToRef = (ref) => {
    var refBoundingClientRect = ref.current.getBoundingClientRect();

    Scroll.animateScroll.scrollTo(
      refBoundingClientRect.top +
        window.scrollY -
        refBoundingClientRect.height -
        30
    );
  };

  let passwordTextFieldRef = React.useRef();
  let submitButtonRef = React.useRef();

  let usernameValidate = null;
  let passwordValidate = null;

  let LoginQuery = gql`
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        name
        designation {
          name
          paneltype
        }
      }
    }
  `;

  const [
    getLogin,
    {
      loading: loginQueryLoading,
      error: loginQueryError,
      data: loginQueryResult,
    },
  ] = useMutation(LoginQuery);

  useEffect(() => {
    if (loginQueryError) {
      loginQueryError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [loginQueryError]);

  useEffect(() => {
    if (loginQueryResult && loginQueryResult.login) {
      if (
        loginQueryResult.login.designation.paneltype == "SUPERADMIN" ||
        loginQueryResult.login.designation.paneltype == "ADMIN"
      ) {
        props.setRedirectToPath("/admin");
      } else {
        props.setRedirectToPath("/user");
      }
    }
  }, [loginQueryResult]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loginQueryLoading) return;

    let isValid = true;
    if (!usernameValidate()) {
      isValid = false;
    }
    if (!passwordValidate()) {
      isValid = false;
    }
    if (!isValid) return;
    try {
      await getLogin({
        variables: {
          username: props.loginUsernameText,
          password: props.loginPasswordText,
        },
      });
    } catch (e) {}
  };

  return (
    <Container name="loginContainer" className={classes.formContainer}>
      <form
        noValidate
        autoComplete="off"
        className={classes.form}
        onSubmit={handleSubmit}
      >
        <FormControl className={classes.formControl}>
          <ValidationTextField
            className={classes.textField}
            focus={(focus) => focus()}
            onFocus={() => {
              scrollToRef(passwordTextFieldRef);
            }}
            InputProps={{
              classes: {
                root: classes.textFieldRoot,
                input: classes.textFieldInput,
                notchedOutline: classes.textFieldNotchedOutline,
              },
            }}
            value={props.loginUsername}
            validate={(validate) => {
              usernameValidate = validate;
            }}
            disabled={loginQueryLoading}
            onInput={(e) => props.setLoginUsernameText(e.target.value)}
            id="usernameTextField"
            label="Username"
            variant="outlined"
            notEmpty={true}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <ValidationTextField
            className={classes.textField}
            onFocus={() => {
              scrollToRef(submitButtonRef);
            }}
            ref={passwordTextFieldRef}
            InputProps={{
              classes: {
                root: classes.textFieldRoot,
                input: classes.textFieldInput,
                notchedOutline: classes.textFieldNotchedOutline,
              },
            }}
            value={props.loginPassword}
            validate={(validate) => {
              passwordValidate = validate;
            }}
            disabled={loginQueryLoading.loading}
            type="password"
            onInput={(e) => props.setLoginPasswordText(e.target.value)}
            id="passwordTextField"
            label="Password"
            variant="outlined"
            notEmpty={true}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <Button
            variant="contained"
            type="submit"
            disabled={loginQueryLoading}
            className={classes.submitButton}
            ref={submitButtonRef}
          >
            {loginQueryLoading && <CircularProgress size={25} />}
            {!loginQueryLoading && "Login"}
          </Button>
        </FormControl>
      </form>
      <Typography align="center">
        <Link
          component="button"
          onClick={() => {
            props.setLoginForgetPasswordToggleFormName("forgetpassword");
          }}
        >
          Forgotten password?
        </Link>
      </Typography>
    </Container>
  );
};
const mapStateToProps = (state) => {
  return { ...state.LoginForgetPasswordReducer };
};
export default connect(mapStateToProps, {
  setLoginUsernameText,
  setLoginPasswordText,
  setLoginForgetPasswordToggleFormName,
  setRedirectToPath,
})(LoginForm);
