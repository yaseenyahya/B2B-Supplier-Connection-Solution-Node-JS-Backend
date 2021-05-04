import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  setFollowUpDialogToggle,
  setFollowUpDialogDateTime,
} from "../../store/actions/FollowUpDialogActions";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
const useStyles = makeStyles((theme) => ({
  chatMainContainer: {
    paddingTop: 3,
    paddingRight: 3,
    paddingLeft: 3,
  },
  chatTabHeader: {},
}));

const FollowUpDialog = (props) => {
  const classes = useStyles();
  useEffect(() => {
    if(props.followUpDialogToggle)
    props.setFollowUpDialogDateTime(moment().unix() * 1000);
  }, [props.followUpDialogToggle]);
  return (
    <Dialog
      open={props.followUpDialogToggle}
      onClose={() => {
        props.setFollowUpDialogToggle(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Follow Up</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <TextField
            id="datetime-local"
            type="datetime-local"
            defaultValue={moment.unix(props.followUpDialogDateTime / 1000).format("yyyy-MM-DDTHH:mm")}
            InputProps={{
              inputProps: { min: moment().format("yyyy-MM-DDTHH:mm") },
            }}
            className={classes.textField}
            onChange={(e) => {
              props.setFollowUpDialogDateTime(
                moment(e.target.value, "yyyy-MM-DDTHH:mm").unix() * 1000
              );
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.setFollowUpDialogToggle(false);
          }}
          color="primary"
        >
          Cancel
        </Button>

        <Button
          onClick={() => {
            props.addFollowLabel && props.addFollowLabel();
          }}
          color="secondary"
          autoFocus
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const mapStateToProps = (state) => {
  return { ...state.FollowUpDialogReducer };
};
export default connect(mapStateToProps, {
  setFollowUpDialogToggle,
  setFollowUpDialogDateTime,
})(FollowUpDialog);
