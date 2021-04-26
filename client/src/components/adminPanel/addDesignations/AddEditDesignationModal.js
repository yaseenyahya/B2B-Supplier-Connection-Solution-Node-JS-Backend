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
  setAddEditDesignationModalToggle,
  setAddEditDesignationModalSelectedRowData,
  setAddEditDesignationModalName,
  setAddEditDesignationModalPanelType,
  setAddEditDesignationModalReset,
} from "../../../store/actions/AddEditDesignationModalActions";
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

const AddEditDesignationModal = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  let nameValidate = null;
  let paneltypeValidate = null;

  useEffect(() => {
    if (props.addEditDesignationModalSelectedRowData) {
      props.setAddEditDesignationModalName(
        props.addEditDesignationModalSelectedRowData.name
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
          item[1] == props.addEditDesignationModalSelectedRowData.paneltype
      );

      if (findPanelType) {
        props.setAddEditDesignationModalPanelType(findPanelType[0]);
      }
    }
  }, [props.addEditDesignationModalSelectedRowData]);

  const handleClose = () => {
    props.setAddEditDesignationModalReset();
  };
  const EditDesignationMutation = gql`
    mutation UpdateDesignation($id: ID!, $name: String!, $paneltype: ID!) {
      updatedesignation(id: $id, name: $name, paneltype: $paneltype) {
        success
        error
      }
    }
  `;
  const [
    editDesignation,
    {
      loading: editDesignationMutationLoading,
      error: editDesignationMutationError,
      data: editDesignationMutationResult,
    },
  ] = useMutation(EditDesignationMutation);

  useEffect(() => {
    if (editDesignationMutationError) {
      editDesignationMutationError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [editDesignationMutationError]);

  useEffect(() => {
    if (
      editDesignationMutationResult &&
      editDesignationMutationResult.updatedesignation
    ) {
      if (editDesignationMutationResult.updatedesignation.success) {
        enqueueSnackbar("Designation update successfully.", {
          variant: "success",
        });
        props.onChange();
        handleClose();
      } else {
        enqueueSnackbar(editDesignationMutationResult.updatedesignation.error, {
          variant: "error",
        });
      }
    }
  }, [editDesignationMutationResult]);

  const AddDesignationMutation = gql`
    mutation AddDesignation($name: String!, $paneltype: ID!) {
      adddesignation(name: $name, paneltype: $paneltype) {
        success
        error
      }
    }
  `;
  const [
    addDesignation,
    {
      loading: addDesignationMutationLoading,
      error: addDesignationMutationError,
      data: addDesignationMutationResult,
    },
  ] = useMutation(AddDesignationMutation);

  useEffect(() => {
    if (addDesignationMutationError) {
      addDesignationMutationError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [addDesignationMutationError]);

  useEffect(() => {
    if (
      addDesignationMutationResult &&
      addDesignationMutationResult.adddesignation
    ) {
      if (addDesignationMutationResult.adddesignation.success) {
        enqueueSnackbar("Designation added successfully.", {
          variant: "success",
        });
        props.onChange();
        handleClose();
      } else {
        enqueueSnackbar(addDesignationMutationResult.adddesignation.error, {
          variant: "error",
        });
      }
    }
  }, [addDesignationMutationResult]);

  let isLoading =
    addDesignationMutationLoading || editDesignationMutationLoading;
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
        if (props.addEditDesignationModalSelectedRowData) {
          await editDesignation({
            variables: {
              id: props.addEditDesignationModalSelectedRowData.id,
              name: props.addEditDesignationModalName,
              paneltype: props.addEditDesignationModalPanelType,
            },
          });
        } else {
          await addDesignation({
            variables: {
              name: props.addEditDesignationModalName,
              paneltype:
                props.addEditDesignationModalPanelType == null
                  ? 3
                  : props.addEditDesignationModalPanelType,
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
      open={props.addEditDesignationModalToggle}
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
          Add Designation
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
              value={props.addEditDesignationModalName}
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
                props.setAddEditDesignationModalName(e.target.value)
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
                props.addEditDesignationModalPanelType != null
                  ? props.addEditDesignationModalPanelType
                  : 3
              }
              values={[
                //  [0, "SUPERADMIN"],
                [1, "ADMIN"],
                [2, "MANAGER"],
                [3, "AGENT"],
                [4, "FINANCE"],
              ]}
              disabled={isLoading}
              onChange={(e) => {
                props.setAddEditDesignationModalPanelType(e.target.value);
              }}
              label="Select Paneltype"
              notEmpty={true}
            />
          </FormControl>
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
  return { ...state.AddEditDesignationModalReducer };
};
export default connect(mapStateToProps, {
  setAddEditDesignationModalToggle,
  setAddEditDesignationModalSelectedRowData,
  setAddEditDesignationModalName,
  setAddEditDesignationModalPanelType,
  setAddEditDesignationModalReset,
})(AddEditDesignationModal);
