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
  setAddEditProfileModalToggle,
  setAddEditProfileModalSelectedRowData,
  setAddEditProfileModalName,
  setAddEditProfileModalPanelType,
  setAddEditProfileModalSettings,
  setAddEditProfileModalReset,
} from "../../../store/actions/AddEditProfileModalActions";
import { useSnackbar } from "notistack";
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
    padding: 12,
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

const AddEditProfileModal = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  let nameValidate = null;
  let paneltypeValidate = null;

  useEffect(() => {
    if (props.addEditProfileModalSelectedRowData) {
      props.setAddEditProfileModalName(
        props.addEditProfileModalSelectedRowData.name
      );
      var panelTypeArray = [
        [1, "ADMIN"],
        [2, "MANAGER"],
        [3, "AGENT"],
        [4, "FINANCE"],
      ];
      var findPanelType = _.find(
        panelTypeArray,
        (item) =>
          item[1] == props.addEditProfileModalSelectedRowData.paneltype
      );

      if (findPanelType) {
        props.setAddEditProfileModalPanelType(findPanelType[0]);
      }
    }
  }, [props.addEditProfileModalSelectedRowData]);

  const handleClose = () => {
    props.setAddEditProfileModalReset();
  };
  const EditProfileMutation = gql`
    mutation UpdateProfile(
      $id: ID!
      $name: String!
      $paneltype: ID!
      $settings: String
    ) {
      updateprofile(
        id: $id
        name: $name
        paneltype: $paneltype
        settings: $settings
      ) {
        success
        error
      }
    }
  `;
  const [
    editProfile,
    {
      loading: editProfileMutationLoading,
      error: editProfileMutationError,
      data: editProfileMutationResult,
    },
  ] = useMutation(EditProfileMutation);

  useEffect(() => {
    if (editProfileMutationError) {
      editProfileMutationError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [editProfileMutationError]);

  useEffect(() => {
    if (
      editProfileMutationResult &&
      editProfileMutationResult.updateprofile
    ) {
      if (editProfileMutationResult.updateprofile.success) {
        enqueueSnackbar("Profile update successfully.", {
          variant: "success",
        });
        props.onChange();
        handleClose();
      } else {
        enqueueSnackbar(editProfileMutationResult.updateprofile.error, {
          variant: "error",
        });
      }
    }
  }, [editProfileMutationResult]);

  const AddProfileMutation = gql`
    mutation AddProfile($name: String!, $paneltype: ID!, $settings: String) {
      addprofile(name: $name, paneltype: $paneltype, settings: $settings) {
        success
        error
      }
    }
  `;
  const [
    addProfile,
    {
      loading: addProfileMutationLoading,
      error: addProfileMutationError,
      data: addProfileMutationResult,
    },
  ] = useMutation(AddProfileMutation);

  useEffect(() => {
    if (addProfileMutationError) {
      addProfileMutationError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [addProfileMutationError]);

  useEffect(() => {
    if (addProfileMutationResult && addProfileMutationResult.addprofile) {
      if (addProfileMutationResult.addprofile.success) {
        enqueueSnackbar("Profile added successfully.", {
          variant: "success",
        });
        props.onChange();
        handleClose();
      } else {
        enqueueSnackbar(addProfileMutationResult.addprofile.error, {
          variant: "error",
        });
      }
    }
  }, [addProfileMutationResult]);

  let isLoading = addProfileMutationLoading || editProfileMutationLoading;
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    let isValid = true;

    if (!nameValidate()) {
      isValid = false;
    }
    if (!paneltypeValidate()) {
      isValid = false;
    }

    if (isValid) {
      try {
        if (props.addEditProfileModalSelectedRowData) {
          await editProfile({
            variables: {
              id: props.addEditProfileModalSelectedRowData.id,
              name: props.addEditProfileModalName,
              paneltype: props.addEditProfileModalPanelType,
              settings: props.addEditProfileModalSettings,
            },
          });
        } else {
          await addProfile({
            variables: {
              name: props.addEditProfileModalName,
              paneltype:
                props.addEditProfileModalPanelType == null
                  ? 3
                  : props.addEditProfileModalPanelType,
              settings: props.addEditProfileModalSettings,
            },
          });
        }
      } catch (e) {}
    }
  };

  return (
    <Dialog
    container={props.mainContainerRef.current}
      aria-labelledby="customized-dialog-title"
      open={props.addEditProfileModalToggle}
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
          Add Profile
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
            <ValidationTextField
              type="text"
              className={classes.textField}
              value={props.addEditProfileModalName}
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
                props.setAddEditProfileModalName(e.target.value)
              }
              label="Name"
              variant="outlined"
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <ValidationSelectField
              validate={(validate) => {
                paneltypeValidate = validate;
              }}
              className={classes.textFieldRoot}
              value={
                props.addEditProfileModalPanelType != null
                  ? props.addEditProfileModalPanelType
                  : 3
              }
              values={[
                [1, "ADMIN"],
                [2, "MANAGER"],
                [3, "AGENT"],
                [4, "FINANCE"],
              ]}
              disabled={isLoading}
              onChange={(e) => {
                props.setAddEditProfileModalPanelType(e.target.value);
              }}
              label="Select Paneltype"
              notEmpty={true}
            />
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions disableSpacing={true} className={classes.dialogActions}>
        <Container maxWidth={false} disableGutters={true}>
          <Button maxWidth={false}
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
  return { ...state.AddEditProfileModalReducer };
};
export default connect(mapStateToProps, {
  setAddEditProfileModalToggle,
  setAddEditProfileModalSelectedRowData,
  setAddEditProfileModalName,
  setAddEditProfileModalPanelType,
  setAddEditProfileModalSettings,
  setAddEditProfileModalReset,
})(AddEditProfileModal);
