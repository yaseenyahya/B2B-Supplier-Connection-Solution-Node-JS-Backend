import React, { useState, useEffect, useRef } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  Dialog,
  Button,
  DialogContent,
  DialogActions,
  Typography,
  DialogTitle,
  CircularProgress,
  IconButton,
  FormControl,
  Container,
  FilledInput,
  Divider,
} from "@material-ui/core";
import { connect } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import ValidationTextField from "../otherComponents/ValidationTextField";
import _ from "lodash";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import {
  setCropImageModalImage,
  setCropImageModalToggle,
  setCropImageModalLoading,
} from "../store/actions/CropImageModalActions";
import {
  setAccountUserInfoSettingsModalCurrentPassword,
  setAccountUserInfoSettingsModalNewPassword,
  setAccountUserInfoSettingsModalToggle,
  setAccountUserInfoSettingsModalId,
  setAccountUserInfoSettingsModalName,
  setAccountUserInfoSettingsModalPseudonym,
  setAccountUserInfoSettingsModalPicture,
  setAccountUserInfoSettingsModalUsername,
  setAccountUserInfoSettingsModalEmail,
  setAccountUserInfoSettingsModalNumber,
  setAccountUserInfoSettingsModalReset,
} from "../store/actions/AccountUserInfoSettingsModalActions";
import ImageCropper from "../otherComponents/ImageCropper";
import { useSnackbar } from "notistack";
import clsx from "clsx";
const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "white",
  },

  textFieldRoot: {
    borderRadius: 0,
  },
  textField: {
    width: "100%",
  },
  dialogTitle: {
    background: "rgb(46 62 78)",
  },
  dialogTitleText: {
    color: "white",
  },
  dialogActions: {
    padding: 0,
  },
  submitButton: {
    fontSize: 17,
    width: "100%",
    borderRadius: 0,
    background: "rgb(102, 192, 71)",
    color: "#FFFFFF",

    "&:hover": {
      backgroundColor: "rgb(118 208 87)",
    },
  },
  formControl: {
    padding: 6,
    display: "block",
  },
  profilePicAddButton: {
    width: 100,
    border: "1px dashed gray",
    height: 100,
    borderRadius: "50%",
    padding: 0,
    margin: "auto",
    display: "block",
  },
  profilePictureAddImage: {
    width: "100px",
    borderRadius: "50%",
    height: "100px",
    marginRight: 5,
  },
  dialogContent: {
    minWidth: 220,
  },
  newPasswordTextField: {
    background: "#e3ffe5",
  },
}));

const AccountUserInfoSettingsModal = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  let usernameValidate = null;
  let currentPasswordValidate = null;
  let nameValidate = null;
  let pseudonymValidate = null;
  let emailValidate = null;
  let mobileValidate = null;
  let newPasswordValidate = null;

  const profilePicAddButtonRef = useRef(null);
  const handleClose = () => {
    props.setAccountUserInfoSettingsModalToggle();
    props.setAccountUserInfoSettingsModalReset();
  };
  const MeQuery = gql`
    query Me($accessToken: String) {
      me(accessToken: $accessToken) {
        id
        picture
        name
        pseudonym
        username
        email
        number
      }
    }
  `;
  let [
    getMe,
    { loading: meQueryLoading, error: meQueryQueryError, data: meQueryResult },
  ] = useLazyQuery(MeQuery, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (props.accountUserInfoSettingsModalToggle) {
      getMe();
    }
  }, [props.accountUserInfoSettingsModalToggle]);

  useEffect(() => {
    if (meQueryResult && meQueryResult.me) {
      props.setAccountUserInfoSettingsModalId(meQueryResult.me.id);
      props.setAccountUserInfoSettingsModalPicture(meQueryResult.me.picture);
      props.setAccountUserInfoSettingsModalUsername(meQueryResult.me.username);
      props.setAccountUserInfoSettingsModalName(meQueryResult.me.name);
      props.setAccountUserInfoSettingsModalPseudonym(
        meQueryResult.me.pseudonym
      );
      props.setAccountUserInfoSettingsModalEmail(meQueryResult.me.email);
      props.setAccountUserInfoSettingsModalNumber(meQueryResult.me.number);
    }
  }, [meQueryResult]);
  const EditMeMutation = gql`
    mutation UpdateMe(
      $id: ID!
      $username: String!
      $currentpassword: String!
      $name: String!
      $pseudonym: String
      $picture: String
      $email: String!
      $number: String
      $newpassword: String
    ) {
      updateme(
        id: $id
        username: $username
        currentpassword: $currentpassword
        name: $name
        pseudonym: $pseudonym
        picture: $picture
        email: $email
        number: $number
        newpassword: $newpassword
      ) {
        success
        error
      }
    }
  `;
  const [
    editMe,
    {
      loading: editMeMutationLoading,
      error: editMeMutationError,
      data: editMeMutationResult,
    },
  ] = useMutation(EditMeMutation);

  useEffect(() => {
    if (editMeMutationError) {
      editMeMutationError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [editMeMutationError]);

  useEffect(() => {
    if (editMeMutationResult && editMeMutationResult.updateme) {
      if (editMeMutationResult.updateme.success) {
        enqueueSnackbar("User update successfully.", { variant: "success" });
        window.location.reload(false);
        handleClose();
      } else {
        enqueueSnackbar(editMeMutationResult.updateme.error, {
          variant: "error",
        });
      }
    }
  }, [editMeMutationResult]);

  let isLoading = editMeMutationLoading || meQueryLoading;
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    let isValid = true;
    if (!usernameValidate()) {
      isValid = false;
    }
    if (!currentPasswordValidate()) {
      isValid = false;
    }
    if (!nameValidate()) {
      isValid = false;
    }
    if (!pseudonymValidate()) {
      isValid = false;
    }
    if (!emailValidate()) {
      isValid = false;
    }
    if (!mobileValidate()) {
      isValid = false;
    }

    if (!newPasswordValidate()) {
      isValid = false;
    }

    if (isValid) {
      try {
        await editMe({
          variables: {
            id: props.accountUserInfoSettingsModalId,
            username: props.accountUserInfoSettingsModalUsername,
            currentpassword: props.accountUserInfoSettingsModalCurrentPassword,
            name: props.accountUserInfoSettingsModalName,
            pseudonym: props.accountUserInfoSettingsModalPseudonym,
            picture: props.accountUserInfoSettingsModalPicture,
            email: props.accountUserInfoSettingsModalEmail,
            number: props.accountUserInfoSettingsModalNumber,
            newpassword: props.accountUserInfoSettingsModalNewPassword,
          },
        });
      } catch (e) {}
    }
  };

  return (
    <Dialog
      container={props.mainContainerRef.current}
      aria-labelledby="customized-dialog-title"
      open={props.accountUserInfoSettingsModalToggle}
      onClose={handleClose}
    >
      <DialogTitle
        onClose={handleClose}
        id="customized-dialog-title"
        className={classes.dialogTitle}
      >
        <Typography variant="h6" className={classes.dialogTitleText}>
          Edit Account Info
        </Typography>

        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className={classes.dialogContent}>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <FormControl className={classes.formControl}>
            <input
              onChange={(event) => {
                if (event.target.files.length > 0) {
                  let reader = new FileReader();
                  reader.readAsDataURL(event.target.files[0]);
                  reader.onload = function () {
                    props.setCropImageModalImage(reader.result);
                    props.setCropImageModalToggle(true);
                  };
                  reader.onerror = function (error) {
                    alert("Error: ", error);
                  };
                }
              }}
              ref={profilePicAddButtonRef}
              accept="image/*"
              disabled={isLoading}
              className={classes.profilePicAddButton}
              style={{ display: "none" }}
              id="raised-button-file"
              name="raised-button-file"
              multiple={false}
              type="file"
            />

            <Button
              onClick={() => {
                profilePicAddButtonRef.current.click();
              }}
              className={classes.profilePicAddButton}
            >
              {props.accountUserInfoSettingsModalPicture ? (
                <img
                  className={classes.profilePictureAddImage}
                  src={props.accountUserInfoSettingsModalPicture}
                />
              ) : (
                <img
                  className={classes.profilePictureAddImage}
                  src={process.env.PUBLIC_URL + "/noprofileimagesmall.jpg"}
                />
              )}
            </Button>
            <ImageCropper
              onImageCropCompleted={(croppedImage) => {
                props.setAccountUserInfoSettingsModalPicture(croppedImage);
              }}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <ValidationTextField
              type="text"
              className={classes.textField}
              InputProps={{
                classes: {
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
              }}
              validate={(validate) => {
                usernameValidate = validate;
              }}
              value={props.accountUserInfoSettingsModalUsername}
              notEmpty={true}
              disabled={isLoading}
              onInput={(e) =>
                props.setAccountUserInfoSettingsModalUsername(e.target.value)
              }
              label="Username"
              variant="outlined"
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <ValidationTextField
              type="text"
              className={classes.textField}
              value={props.accountUserInfoSettingsModalName}
              InputProps={{
                classes: {
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
              }}
              validate={(validate) => {
                nameValidate = validate;
              }}
              notEmpty={true}
              disabled={isLoading}
              onInput={(e) =>
                props.setAccountUserInfoSettingsModalName(e.target.value)
              }
              label="Name"
              variant="outlined"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <ValidationTextField
              type="text"
              className={classes.textField}
              value={props.accountUserInfoSettingsModalPseudonym}
              InputProps={{
                classes: {
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
              }}
              validate={(validate) => {
                pseudonymValidate = validate;
              }}
              notEmpty={false}
              disabled={isLoading}
              onInput={(e) =>
                props.setAccountUserInfoSettingsModalPseudonym(e.target.value)
              }
              label="Pseudonym"
              variant="outlined"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <ValidationTextField
              type="text"
              Email={true}
              className={classes.textField}
              value={props.accountUserInfoSettingsModalEmail}
              InputProps={{
                classes: {
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
              }}
              validate={(validate) => {
                emailValidate = validate;
              }}
              notEmpty={true}
              disabled={isLoading}
              onInput={(e) =>
                props.setAccountUserInfoSettingsModalEmail(e.target.value)
              }
              label="Email"
              variant="outlined"
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <ValidationTextField
              className={classes.textField}
              value={props.accountUserInfoSettingsModalNumber}
              InputProps={{
                classes: {
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
              }}
              validate={(validate) => {
                mobileValidate = validate;
              }}
              mask={[
                "(",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                ")",
                " ",
                "-",
                " ",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              disabled={isLoading}
              onInput={(e) =>
                props.setAccountUserInfoSettingsModalNumber(e.target.value)
              }
              id="mobileTextField"
              label="Mobile"
              minValueErrorText="Not a valid mobile number."
              minValue={11}
              variant="outlined"
              notEmpty={false}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <ValidationTextField
              type="currentpassword"
              className={classes.textField}
              value={props.accountUserInfoSettingsModalCurrentPassword}
              InputProps={{
                classes: {
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
              }}
              validate={(validate) => {
                currentPasswordValidate = validate;
              }}
              notEmpty={true}
              disabled={isLoading}
              onInput={(e) =>
                props.setAccountUserInfoSettingsModalCurrentPassword(
                  e.target.value
                )
              }
              label={"Current Password"}
              variant="outlined"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <ValidationTextField
              type="newpassword"
              className={clsx(classes.textField, classes.newPasswordTextField)}
              value={props.accountUserInfoSettingsModalNewPassword}
              InputProps={{
                classes: {
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
              }}
              validate={(validate) => {
                newPasswordValidate = validate;
              }}
              notEmpty={false}
              disabled={isLoading}
              onInput={(e) =>
                props.setAccountUserInfoSettingsModalNewPassword(e.target.value)
              }
              label={"New Password"}
              variant="outlined"
            />
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions disableSpacing={true} className={classes.dialogActions}>
        <Container disableGutters={true}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            type="submit"
            disabled={isLoading}
            className={classes.submitButton}
          >
            {isLoading && <CircularProgress size={25} />}
            {!isLoading && "Save"}
          </Button>
        </Container>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return { ...state.AccountUserInfoSettingsModalReducer };
};
export default connect(mapStateToProps, {
  setCropImageModalImage,
  setCropImageModalToggle,
  setCropImageModalLoading,
  setAccountUserInfoSettingsModalCurrentPassword,
  setAccountUserInfoSettingsModalToggle,
  setAccountUserInfoSettingsModalId,
  setAccountUserInfoSettingsModalName,
  setAccountUserInfoSettingsModalPseudonym,
  setAccountUserInfoSettingsModalPicture,
  setAccountUserInfoSettingsModalUsername,
  setAccountUserInfoSettingsModalEmail,
  setAccountUserInfoSettingsModalNumber,
  setAccountUserInfoSettingsModalReset,
  setAccountUserInfoSettingsModalNewPassword,
})(AccountUserInfoSettingsModal);
