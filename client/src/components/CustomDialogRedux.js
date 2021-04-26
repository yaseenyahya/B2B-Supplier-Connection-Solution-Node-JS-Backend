import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { connect } from "react-redux";
import { setDialogOpen } from "../store/actions/DialogActions";
const CustomDialogRedux = (props) => {

  return (
  
    <Dialog
      open={props.dialogOpen}
      onClose={() => {
        props.setDialogOpen(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.dialogContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
      {props.dialogCancelText && (
        <Button
          onClick={() => {
            props.setDialogOpen(false);
          }}
          color="primary"
        >
          {props.dialogCancelText}
        </Button>
          )}
        {props.dialogOkText && (
          <Button onClick={props.dialogOkClick} color="secondary" autoFocus>
            {props.dialogOkText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
const mapStateToProps = (state) => {
  return { ...state.DialogReducer };
};
export default connect(mapStateToProps, {
  setDialogOpen,
})(CustomDialogRedux);
