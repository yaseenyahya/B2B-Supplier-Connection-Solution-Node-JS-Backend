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
  setResetPasswordIsLoading,
  setResetPasswordChangePasswordText,
  setResetPasswordChangeConfirmPasswordText,
  setResetPasswordChangeSuccess,
  setLoginForgetPasswordToggleFormName
} from "../../store/actions/LoginForgetPasswordActions";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { setRedirectToPath } from "../../store/actions/RedirectToPathActions";

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

const ResetPasswordForm = (props) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  let ResetPasswordQuery = gql`
    mutation ChangePasswordFromValidResetToken(
      $token: String!
      $password: String!
    ) {
      changepasswordfromvalidresettoken(token: $token, password: $password) {
        success
        error
      }
    }
  `;

  const [
    resetPassword,
    {
      loading: resetPasswordQueryLoading,
      error: resetPasswordQueryError,
      data: resetPasswordQueryResult,
    },
  ] = useMutation(ResetPasswordQuery);

  useEffect(() => {
    if (resetPasswordQueryError) {
      resetPasswordQueryError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [resetPasswordQueryError]);

  useEffect(() => {
    if (
      resetPasswordQueryResult &&
      resetPasswordQueryResult.changepasswordfromvalidresettoken
    ) {
      if (resetPasswordQueryResult.changepasswordfromvalidresettoken.error)
        enqueueSnackbar(
          resetPasswordQueryResult.changepasswordfromvalidresettoken.error,
          {
            variant: "error",
          }
        );
      else props.setResetPasswordChangeSuccess(true);
    }
  }, [resetPasswordQueryResult]);

  let changePasswordValidate = null;
  let changeConfirmPasswordValidate = null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (props.loading) return;
    let isValid = true;
    if (!changePasswordValidate()) {
      isValid = false;
    }
    if (!changeConfirmPasswordValidate()) {
      isValid = false;
    }
    if (!isValid) return;

    try {
      await resetPassword({
        variables: {
          token: props.token,
          password: props.resetPasswordChangePasswordText,
        },
      });
    } catch (e) {}
  };

  return (
    <Container name="forgetPasswordContainer" className={classes.formContainer}>
      {props.resetPasswordChangeSuccess ? (
        <Typography className={classes.successText}>
          Password change successfully. You can now login with this password.
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
              type="password"
              className={classes.textField}
              focus={(focus) => focus()}
              InputProps={{
                classes: {
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
              }}
              validate={(validate) => {
                changePasswordValidate = validate;
              }}
              notEmpty={true}
              disabled={resetPasswordQueryLoading}
              onInput={(e) =>
                props.setResetPasswordChangePasswordText(e.target.value)
              }
              id="emailTextField"
              label="Password"
              variant="outlined"
              notEmpty={true}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <ValidationTextField
              type="password"
              className={classes.textField}
  
              InputProps={{
                classes: {
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
              }}
              validate={(validate) => {
                changeConfirmPasswordValidate = validate;
              }}
              validationMatch={{
                text: props.resetPasswordChangePasswordText,
                errorText: "Password not match",
              }}
              notEmpty={true}
              disabled={resetPasswordQueryLoading}
              onInput={(e) =>
                props.setResetPasswordChangeConfirmPasswordText(e.target.value)
              }
              id="emailTextField"
              label="Confirm Password"
              variant="outlined"
              notEmpty={true}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <Button
              variant="contained"
              type="submit"
              disabled={resetPasswordQueryLoading}
              className={classes.submitButton}
            >
              {resetPasswordQueryLoading && <CircularProgress size={25} />}
              {!resetPasswordQueryLoading && "Change password"}
            </Button>
          </FormControl>
        </form>
      )}
      <Typography align="center">
        <Link
          component="button"
          onClick={() => {
            window.location = "/login";
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
  setResetPasswordIsLoading,
  setResetPasswordChangePasswordText,
  setResetPasswordChangeConfirmPasswordText,
  setResetPasswordChangeSuccess,
  setLoginForgetPasswordToggleFormName,
  setRedirectToPath
})(ResetPasswordForm);
