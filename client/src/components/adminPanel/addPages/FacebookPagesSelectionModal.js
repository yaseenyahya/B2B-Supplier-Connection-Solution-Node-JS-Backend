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
  setAddEditPagesModalSelectedPages,
  setAddEditPagesModalToggle,
  setAddEditPagesModalReset,
  setaddEditPagesModalPages,
} from "../../../store/actions/AddEditPagesModalActions";
import FacebookList from "./FacebookList";
import { useSnackbar } from "notistack";
const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "white",
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
  dialogContent: {
    minWidth: 300,
    minHeight: 200,
  },
}));

const FacebookPagesSelectionModal = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const AddPagesMutation = gql`
    mutation AddPages($objects: [pages_insert_input!]) {
      addpages(objects: $objects) {
        success
        error
      }
    }
  `;
  const [
    addPages,
    {
      loading: addPagesMutationLoading,
      error: addPagesMutationError,
      data: addPagesMutationResult,
    },
  ] = useMutation(AddPagesMutation);

  useEffect(() => {
    if (addPagesMutationError) {
      addPagesMutationError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [addPagesMutationError]);

  useEffect(() => {
    if (addPagesMutationResult && addPagesMutationResult.addpages) {
      if (addPagesMutationResult.addpages.success) {
        enqueueSnackbar("Pages added successfully.", {
          variant: "success",
        });
        props.onChange();
        handleClose();
      } else {
        enqueueSnackbar(addPagesMutationResult.addpages.error, {
          variant: "error",
        });
      }
    }
  }, [addPagesMutationResult]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (addPagesMutationLoading) return;

    const selectedPage = _.filter(
      props.addEditPagesModalPages,
      (item) => item.isChecked
    );
    var createPageObjectValue = [];
    selectedPage.forEach((item) =>
      createPageObjectValue.push({
        name: item.name,
        pageId: item.id,
        accesstoken: item.access_token,
      })
    );

    addPages({
      variables: {
        objects: createPageObjectValue,
      },
    });
  };

  const handleClose = () => {
    props.setAddEditPagesModalReset();
  };

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={props.addEditPagesModalToggle}
      onClose={handleClose}
    >
      <DialogTitle
        onClose={handleClose}
        id="customized-dialog-title"
        className={classes.dialogTitle}
      >
        <Typography variant="h6" className={classes.dialogTitleText}>
          Add Pages
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
          {props.addEditPagesModalPages &&
            props.addEditPagesModalPages.map((item) => {
              return (
                <FacebookList
                  isChecked={Boolean(item.isChecked)}
                  onChange={(checked, id) => {
                    const pageObject = _.find(
                      props.addEditPagesModalPages,
                      (itemPage) => itemPage.id == id
                    );
                    if (pageObject) {
                      pageObject.isChecked = checked;
                    }
                    props.setaddEditPagesModalPages(
                      _.cloneDeep(props.addEditPagesModalPages)
                    );
                  }}
                  checkBox={true}
                  facebookPageId={item.id}
                  facebookPageName={item.name}
                />
              );
            })}
        </form>
      </DialogContent>
      <DialogActions disableSpacing={true} className={classes.dialogActions}>
        <Container disableGutters={true}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            type="submit"
            disabled={addPagesMutationLoading}
            className={classes.submitButton}
          >
            {addPagesMutationLoading && <CircularProgress size={25} />}
            {!addPagesMutationLoading && "Save"}
          </Button>
        </Container>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return { ...state.AddEditPagesModalReducer };
};
export default connect(mapStateToProps, {
  setAddEditPagesModalSelectedPages,
  setAddEditPagesModalToggle,
  setaddEditPagesModalPages,
  setAddEditPagesModalReset,
})(FacebookPagesSelectionModal);
