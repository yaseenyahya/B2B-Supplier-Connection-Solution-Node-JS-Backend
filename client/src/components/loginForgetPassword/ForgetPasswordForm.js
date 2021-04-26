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
  setForgetPasswordEmailText,
  setForgetPasswordIsLoading,
  setLoginForgetPasswordToggleFormName,
  setForgetPasswordRequested
} from "../../store/actions/LoginForgetPasswordActions";
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
  successText:{
    marginTop:10,
    marginBottom:30
  },
  form: {
    display: "block",
    marginBottom: "15px",
    marginTop: "15px",
  },
  textFieldRoot: {
    borderRadius: 0,
  },
  textField: {
    width: "100%",
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

const ForgetPasswordForm = (props) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  let ForgetPasswordQuery = gql`
    mutation RequestResetToken($email: String!) {
      requestresettoken(email: $email) {
        success
        error
      }
    }
  `;

  const [
    requestResetToken,
    {
      loading: requestResetTokenQueryLoading,
      error: requestResetTokenQueryError,
      data: requestResetTokenQueryResult,
    },
  ] = useMutation(ForgetPasswordQuery);

  useEffect(() => {
    if (requestResetTokenQueryError) {
      requestResetTokenQueryError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [requestResetTokenQueryError]);

  useEffect(() => {
   
    if (
      requestResetTokenQueryResult &&
      requestResetTokenQueryResult.requestresettoken
    ) {
      if (requestResetTokenQueryResult.requestresettoken.error)
        enqueueSnackbar(requestResetTokenQueryResult.requestresettoken.error, {
          variant: "error",
        });
      else props.setForgetPasswordRequested(true);
    }
  }, [requestResetTokenQueryResult]);

  let emailTextFieldRef = React.useRef();
  let submitButtonRef = React.useRef();

  let emailValidate = null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (props.requestResetTokenQueryLoading) return;
    let isValid = true;
    if (!emailValidate()) {
      isValid = false;
    
    }

    if (!isValid) return;

    try {
      await requestResetToken({
        variables: {
          email: props.forgetPasswordEmailText,
        },
      });
    } catch (e) {}
  };

  return (
    <Container name="forgetPasswordContainer" className={classes.formContainer}>
      {props.forgetPasswordRequested ? (
        <Typography className={classes.successText}>
          Check your email for a link to reset your password. If it doesn’t
          appear within a few minutes, check your spam folder.
        </Typography>
      ) : (
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
              InputProps={{
                classes: {
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
              }}
              ref={emailTextFieldRef}
              validate={(validate) => {
                emailValidate = validate;
              }}
              Email={true}
              disabled={requestResetTokenQueryLoading}
              onInput={(e) => props.setForgetPasswordEmailText(e.target.value)}
              id="emailTextField"
              label="Email"
              variant="outlined"
              notEmpty={true}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <Button
              variant="contained"
              type="submit"
              disabled={requestResetTokenQueryLoading}
              className={classes.submitButton}
              ref={submitButtonRef}
            >
              {requestResetTokenQueryLoading && (
                <CircularProgress size={25} />
              )}
              {!requestResetTokenQueryLoading && "Reset my account"}
            </Button>
          </FormControl>
        </form>
      )}
      <Typography align="center">
        <Link
          component="button"
          onClick={() => {
            props.setForgetPasswordRequested(false);
            props.setLoginForgetPasswordToggleFormName("login");
          }}
        >
          Back to login
        </Link>
      </Typography>
    </Container>
  );
};
const mapStateToProps = (state) => {
  return { ...state.LoginForgetPasswordReducer };
};
export default connect(mapStateToProps, {
  setForgetPasswordEmailText,
  setForgetPasswordIsLoading,
  setLoginForgetPasswordToggleFormName,
  setForgetPasswordRequested
})(ForgetPasswordForm);
