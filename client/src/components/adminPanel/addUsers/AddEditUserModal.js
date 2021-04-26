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
import PanelType from "../../../auth/PanelType";
import { makeStyles } from "@material-ui/core/styles";
import ValidationTextField from "../../../otherComponents/ValidationTextField";
import ValidationSelectField from "../../../otherComponents/ValidationSelectField";
import ValidationTextArea from "../../../otherComponents/ValidationTextArea";
import _ from "lodash";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import {
  setCropImageModalImage,
  setCropImageModalToggle,
  setCropImageModalLoading,
} from "../../../store/actions/CropImageModalActions";
import {
  setAddEditUserModalToggle,
  setAddEditUserModalSelectedRowData,
  setAddEditUserModalPicture,
  setAddEditUserModalName,
  setAddEditUserModalPseudonym,
  setAddEditUserModalUsername,
  setAddEditUserModalPassword,
  setAddEditUserModalEmail,
  setAddEditUserModalDesignation,
  setAddEditUserModalManager,
  setAddEditUserModalStatus,
  setAddEditUserModalComments,
  setAddEditUserModalNumber,
  setAddEditUserModalReset,
  setAddEditUserModalSettings,
} from "../../../store/actions/AddEditUserModalActions";
import ImageCropper from "../../../otherComponents/ImageCropper";
import { useSnackbar } from "notistack";
import SettingsComponent from "./SettingsComponent";
import resolveSettings from "../../../auth/resolveSettings";
const useStyles = makeStyles((theme) => ({
  gridItem: {
    display: "flex",
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "white",
  },
  commentsTextField: {
    width: 223,
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
    padding: 12,
  },
  profilePicAddButton: {
    padding: 12,
    width: 213,
    height: 56,
    border: "1px dashed gray",
  },
  profilePictureAddImage: {
    width: 50,
    borderRadius: "50%",
    height: 50,
    marginRight: 5,
  },
  textArea: {
    width: "100%",
    padding: 0,
    font: "inherit",
    border: 0,
    outline: 0,
    resize: "none",
    height: "100%",
    "&::placeholder": {
      color: "rgb(177, 177, 177)",
    },
    unicodeBidi: "plaintext",
    fontSize: 16,
    fontFamily: "system-ui",
    overflowX: "hidden",
    width: 190,
  },
  textAreaLabel: {
    position: "absolute",
    margin: "20px",
    background: "#db3d44",
    padding: "3px 6px",
    color: "white",
    borderBottom: "4px solid #272727",
    borderRadius: "3px",
    "&::before": {
      top: "-4px",
      width: "20px",
      height: "10px",
      position: "absolute",
      transform: "skew(130deg)",
      background: "#db3d44",
      borderRadius: "8px",
      right: 0,
      content: "''",
    },
  },
}));

const AddEditUserModal = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  let usernameValidate = null;
  let passwordValidate = null;
  let nameValidate = null;
  let pseudonymValidate = null;
  let emailValidate = null;
  let mobileValidate = null;
  let statusValidate = null;
  let designationIdValidate = null;
  let managerIdValidate = null;
  let commentsValidate = null;

  useEffect(() => {
    if (props.addEditUserModalSelectedRowData) {
      props.setAddEditUserModalPicture(
        props.addEditUserModalSelectedRowData.picture
      );
      props.setAddEditUserModalName(props.addEditUserModalSelectedRowData.name);
      props.setAddEditUserModalPseudonym(
        props.addEditUserModalSelectedRowData.pseudonym
      );
      props.setAddEditUserModalUsername(
        props.addEditUserModalSelectedRowData.username
      );
      //props.setAddEditUserModalPassword(props.addEditUserModalSelectedRowData.);
      props.setAddEditUserModalEmail(
        props.addEditUserModalSelectedRowData.email
      );
      props.setAddEditUserModalSettings(
        props.addEditUserModalSelectedRowData.settings
      );
      props.setAddEditUserModalDesignation(
        props.addEditUserModalSelectedRowData.designation.id
      );
      props.setAddEditUserModalManager(
        props.addEditUserModalSelectedRowData.managerId
          ? props.addEditUserModalSelectedRowData.managerId.id
          : null
      );
      var statusArray = [
        [0, "ACTIVE"],
        [1, "BLOCKED"],
        [2, "DEAD"],
      ];
      var findStatus = _.find(
        statusArray,
        (item) => item[1] == props.addEditUserModalSelectedRowData.status
      );

      if (findStatus) {
        props.setAddEditUserModalStatus(findStatus[0]);
      }
      props.setAddEditUserModalComments(
        props.addEditUserModalSelectedRowData.comments
      );
      props.setAddEditUserModalNumber(
        props.addEditUserModalSelectedRowData.number
      );
    }
  }, [props.addEditUserModalSelectedRowData]);
  const profilePicAddButtonRef = useRef(null);
  const handleClose = () => {
    props.setAddEditUserModalReset();
  };
  const EditUserMutation = gql`
    mutation UpdateUser(
      $id: ID!
      $username: String!
      $password: String!
      $name: String!
      $pseudonym: String
      $picture: String
      $email: String!
      $number: String
      $status: ID!
      $comments: String
      $designationId: ID!
      $managerId: ID
      $settings: String
    ) {
      updateuser(
        id: $id
        username: $username
        password: $password
        name: $name
        pseudonym: $pseudonym
        picture: $picture
        email: $email
        number: $number
        status: $status
        comments: $comments
        designationId: $designationId
        managerId: $managerId
        settings: $settings
      ) {
        success
        error
      }
    }
  `;
  const [
    editUser,
    {
      loading: editUserMutationLoading,
      error: editUserMutationError,
      data: editUserMutationResult,
    },
  ] = useMutation(EditUserMutation);

  useEffect(() => {
    if (editUserMutationError) {
      editUserMutationError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [editUserMutationError]);

  useEffect(() => {
    if (editUserMutationResult && editUserMutationResult.updateuser) {
      if (editUserMutationResult.updateuser.success) {
        enqueueSnackbar("User update successfully.", { variant: "success" });
        props.onChange();
        handleClose();
      } else {
        enqueueSnackbar(editUserMutationResult.updateuser.error, {
          variant: "error",
        });
      }
    }
  }, [editUserMutationResult]);

  const AddUserMutation = gql`
    mutation AddUser(
      $username: String!
      $password: String!
      $name: String!
      $pseudonym: String
      $picture: String
      $email: String!
      $number: String
      $status: ID!
      $comments: String
      $designationId: ID!
      $managerId: ID
      $settings: String
    ) {
      adduser(
        username: $username
        password: $password
        name: $name
        pseudonym: $pseudonym
        picture: $picture
        email: $email
        number: $number
        status: $status
        comments: $comments
        designationId: $designationId
        managerId: $managerId
        settings: $settings
      ) {
        success
        error
      }
    }
  `;
  const [
    addUser,
    {
      loading: addUserMutationLoading,
      error: addUserMutationError,
      data: addUserMutationResult,
    },
  ] = useMutation(AddUserMutation);

  useEffect(() => {
    if (addUserMutationError) {
      addUserMutationError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [addUserMutationError]);

  useEffect(() => {
    if (addUserMutationResult && addUserMutationResult.adduser) {
      if (addUserMutationResult.adduser.success) {
        enqueueSnackbar("User added successfully.", { variant: "success" });
        props.onChange();
        handleClose();
      } else {
        enqueueSnackbar(addUserMutationResult.adduser.error, {
          variant: "error",
        });
      }
    }
  }, [addUserMutationResult]);

  const DesignationsQuery = gql`
    query Designations {
      designations {
        id
        name
        paneltype
      }
    }
  `;

  const {
    loading: designationsQueryLoading,
    error: designationsQueryError,
    data: designationsQueryResult,
  } = useQuery(DesignationsQuery);

  const ManagersQuery = gql`
    query Managers($managersOnly: Boolean = true) {
      users(managersOnly: $managersOnly) {
        id
        name
      }
    }
  `;

  const [
    getManagers,
    {
      loading: managersQueryLoading,
      error: managersQueryError,
      data: managersQueryResult,
    },
  ] = useLazyQuery(ManagersQuery);

  let isLoading =
    designationsQueryLoading ||
    managersQueryLoading ||
    addUserMutationLoading ||
    editUserMutationLoading;
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    let isValid = true;
    if (!usernameValidate()) {
      isValid = false;
    }
    if (!passwordValidate()) {
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
    if (!statusValidate()) {
      isValid = false;
    }
    if (!designationIdValidate()) {
      isValid = false;
    }
    if (managerIdValidate && !managerIdValidate()) {
      isValid = false;
    }
    if (!commentsValidate()) {
      isValid = false;
    }
    if (isValid) {
      try {
        if (props.addEditUserModalSelectedRowData) {
          await editUser({
            variables: {
              id: props.addEditUserModalSelectedRowData.id,
              username: props.addEditUserModalUsername,
              password: props.addEditUserModalPassword,
              name: props.addEditUserModalName,
              pseudonym: props.addEditUserModalPseudonym,
              picture: props.addEditUserModalPicture,
              email: props.addEditUserModalEmail,
              number: props.addEditUserModalNumber,
              status: props.addEditUserModalStatus,
              comments: props.addEditUserModalComments,
              designationId: props.addEditUserModalDesignation,
              managerId: props.addEditUserModalManager,
              settings: JSON.stringify(props.addEditUserModalSettings),
            },
          });
        } else {
          await addUser({
            variables: {
              username: props.addEditUserModalUsername,
              password: props.addEditUserModalPassword,
              name: props.addEditUserModalName,
              pseudonym: props.addEditUserModalPseudonym,
              picture: props.addEditUserModalPicture,
              email: props.addEditUserModalEmail,
              number: props.addEditUserModalNumber,
              status:
                props.addEditUserModalStatus == null
                  ? 0
                  : props.addEditUserModalStatus,
              comments: props.addEditUserModalComments,
              designationId: props.addEditUserModalDesignation,
              managerId: props.addEditUserModalManager,
              settings: JSON.stringify(props.addEditUserModalSettings),
            },
          });
        }
      } catch (e) {}
    }
  };

  const convertObjectToArray = (key, value, data) => {
    var objects = [];

    for (var dataKey in data) {
      var item = data[dataKey];
      objects.push([item[key], item[value]]);
    }
    return objects;
  };

  var visibleManagerField = false;

  if (designationsQueryResult) {
    let selectedDesignation = _.find(
      designationsQueryResult.designations,
      (item) => item.id == props.addEditUserModalDesignation
    );
    if (
      selectedDesignation &&
      selectedDesignation.panelType == PanelType.AGENT
    ) {
      visibleManagerField = true;
    }
  }

  useEffect(() => {
    getManagers();
  }, [props.addEditUserModalDesignation, visibleManagerField]);

  useEffect(() => {
    if (
      props.addEditUserModalDesignation &&
      designationsQueryResult &&
      designationsQueryResult.designations
    ) {
      var parsedSettings = props.addEditUserModalSettings;
      try {
        parsedSettings = JSON.parse(parsedSettings);
      } catch (e) {
        
      }
      props.setAddEditUserModalSettings(
        new resolveSettings().resolveSettings(
          parsedSettings,
          _.find(
            designationsQueryResult.designations,
            (item) => item.id == props.addEditUserModalDesignation
          ).paneltype
        )
      );
    }
  }, [props.addEditUserModalDesignation, designationsQueryResult]);

  return (
    <Dialog
    container={props.mainContainerRef.current}
      aria-labelledby="customized-dialog-title"
      open={props.addEditUserModalToggle}
      onClose={handleClose}
      fullScreen
      style={{ margin: 20 }}
    >
      <DialogTitle
        onClose={handleClose}
        id="customized-dialog-title"
        className={classes.dialogTitle}
      >
        <Typography variant="h6" className={classes.dialogTitleText}>
          Add User
        </Typography>

        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
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
              {props.addEditUserModalPicture && (
                <img
                  className={classes.profilePictureAddImage}
                  src={props.addEditUserModalPicture}
                />
              )}
              Upload Picture
            </Button>
            <ImageCropper
              onImageCropCompleted={(croppedImage) => {
                props.setAddEditUserModalPicture(croppedImage);
              }}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <ValidationTextField
              focus={(focus) => {
                if (props.addEditUserModalSelectedRowData == null) focus();
              }}
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
              value={props.addEditUserModalUsername}
              notEmpty={true}
              disabled={isLoading}
              onInput={(e) => props.setAddEditUserModalUsername(e.target.value)}
              label="Username"
              variant="outlined"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <ValidationTextField
              type="password"
              className={classes.textField}
              value={props.addEditUserModalPassword}
              InputProps={{
                classes: {
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput,
                  notchedOutline: classes.textFieldNotchedOutline,
                },
              }}
              validate={(validate) => {
                passwordValidate = validate;
              }}
              notEmpty={props.addEditUserModalSelectedRowData == null}
              disabled={isLoading}
              onInput={(e) => props.setAddEditUserModalPassword(e.target.value)}
              label={
                props.addEditUserModalSelectedRowData == null
                  ? "Password"
                  : "New Password"
              }
              variant="outlined"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <ValidationTextField
              type="text"
              className={classes.textField}
              value={props.addEditUserModalName}
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
              onInput={(e) => props.setAddEditUserModalName(e.target.value)}
              label="Name"
              variant="outlined"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <ValidationTextField
              type="text"
              className={classes.textField}
              value={props.addEditUserModalPseudonym}
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
                props.setAddEditUserModalPseudonym(e.target.value)
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
              value={props.addEditUserModalEmail}
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
              onInput={(e) => props.setAddEditUserModalEmail(e.target.value)}
              label="Email"
              variant="outlined"
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <ValidationTextField
              className={classes.textField}
              value={props.addEditUserModalNumber}
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
              onInput={(e) => props.setAddEditUserModalNumber(e.target.value)}
              id="mobileTextField"
              label="Mobile"
              minValueErrorText="Not a valid mobile number."
              minValue={11}
              variant="outlined"
              notEmpty={false}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <ValidationSelectField
              validate={(validate) => {
                statusValidate = validate;
              }}
              className={classes.textFieldRoot}
              value={
                props.addEditUserModalStatus != null
                  ? props.addEditUserModalStatus
                  : 0
              }
              values={[
                [0, "ACTIVE"],
                [1, "BLOCKED"],
                [2, "DEAD"],
              ]}
              disabled={isLoading}
              onChange={(e) => {
                props.setAddEditUserModalStatus(e.target.value);
              }}
              label="Select Status"
              notEmpty={true}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <ValidationSelectField
              validate={(validate) => {
                designationIdValidate = validate;
              }}
              value={props.addEditUserModalDesignation}
              className={classes.textFieldRoot}
              values={
                !designationsQueryLoading &&
                designationsQueryResult &&
                designationsQueryResult.designations &&
                convertObjectToArray(
                  "id",
                  "name",
                  designationsQueryResult.designations
                )
              }
              disabled={isLoading}
              onChange={(e) => {
                props.setAddEditUserModalDesignation(e.target.value);
              }}
              label="Select Designation"
              notEmpty={true}
            />
          </FormControl>
          {visibleManagerField && (
            <FormControl className={classes.formControl}>
              <ValidationSelectField
                validate={(validate) => {
                  managerIdValidate = validate;
                }}
                className={classes.textFieldRoot}
                value={props.addEditUserModalManager}
                values={
                  managersQueryResult &&
                  convertObjectToArray("id", "name", managersQueryResult.users)
                }
                disabled={isLoading}
                onChange={(e) =>
                  props.setAddEditUserModalManager(e.target.value)
                }
                label="Select Manager"
                notEmpty={true}
              />
            </FormControl>
          )}
          <FormControl className={classes.formControl}>
            <ValidationTextArea
              labelClassName={classes.textAreaLabel}
              className={classes.textArea}
              value={props.addEditUserModalComments}
              disabled={isLoading}
              onChange={(e) => {
                props.setAddEditUserModalComments(e.target.value);
              }}
              notEmpty={false}
              placeholder={"Comments"}
              validate={(validate) => {
                commentsValidate = validate;
              }}
            />
          </FormControl>
          <Divider />
          {props.addEditUserModalDesignation ? (
            <SettingsComponent></SettingsComponent>
          ) : null}
        </form>
      </DialogContent>
      <DialogActions disableSpacing={true} className={classes.dialogActions}>
        <Container maxWidth={false} disableGutters={true}>
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
  return { ...state.AddEditUserModalReducer };
};
export default connect(mapStateToProps, {
  setAddEditUserModalToggle,
  setAddEditUserModalSelectedRowData,
  setAddEditUserModalPicture,
  setAddEditUserModalName,
  setAddEditUserModalPseudonym,
  setAddEditUserModalUsername,
  setAddEditUserModalPassword,
  setAddEditUserModalEmail,
  setAddEditUserModalDesignation,
  setAddEditUserModalManager,
  setAddEditUserModalStatus,
  setAddEditUserModalComments,
  setCropImageModalImage,
  setCropImageModalToggle,
  setCropImageModalLoading,
  setAddEditUserModalNumber,
  setAddEditUserModalReset,
  setAddEditUserModalSettings,
})(AddEditUserModal);
