import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  CircularProgress,
  ListItem,
  List,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import _ from "lodash";
import AddIcon from "@material-ui/icons/Add";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import { useSnackbar } from "notistack";
import {
  setLabelListData,
  setLabelListTextInput
 } from "../../store/actions/LabelListActions";
 import { connect } from "react-redux";
const useStyles = makeStyles((theme) => ({
  mainContainerRoot: {
    padding: 2,
    border: "1px solid #bab9b9",
    borderRadius: 0,
  },
  listItemButton: {
    borderBottom: "1px solid #d0cfcf",
    display: "flex",
  },
  loadingCircularProgress: {
    margin: "auto",
    display: "block",
    marginTop: 20,
  },
  listItemButtonText: {
    padding: 5,
    border: "1p solid gray",
    color: "black",
    flex: 1,
  },
  listItem: {
 

    background: "white",
  },
  labelAddForm: {
    margin: 10,
    display: "flex",
  },
  labelAddFormButton: {
    color: "white",
    background: "#f50057",

    "&:hover": {
      background: "#e14079",
    },
    marginLeft: 10,
  },
  labelTextInput: {
    padding: 14,
  },
  labelAddFormButtonIcon: {
    fontSize: 30,
  },
  deleteButton: {
    color: "#f40057",
  },
  followUpIcon: {
    marginRight: 12,
  },
}));

const LabelsList = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const UpdateLabelsQuery = gql`
    mutation UpdateLabels($labels: String!) {
      updatelabels(labels: $labels) {
        success
        error
      }
    }
  `;
  let [
    updateLabels,
    {
      loading: updateLabelsQueryLoading,
      error: updateLabelsQueryError,
      data: updateLabelsQueryResult,
    },
  ] = useMutation(UpdateLabelsQuery);

  useEffect(() => {
    if (updateLabelsQueryError) {
      updateLabelsQueryError.graphQLErrors.map(({ message }, i) => {
        enqueueSnackbar(message, { variant: "error" });
      });
    }
  }, [updateLabelsQueryError]);

  useEffect(() => {
    if (updateLabelsQueryResult && updateLabelsQueryResult.updatelabels) {
      if (updateLabelsQueryResult.updatelabels.success) {
      } else {
        enqueueSnackbar(updateLabelsQueryResult.updatelabels.error, {
          variant: "error",
        });
      }
    }
  }, [updateLabelsQueryResult]);

  const LabelsQuery = gql`
    query Me($accessToken: String) {
      me(accessToken: $accessToken) {
        id
        labels
      }
    }
  `;
  let [
    getLabels,
    {
      loading: labelsQueryLoading,
      error: labelsQueryError,
      data: labelsQueryResult,
    },
  ] = useLazyQuery(LabelsQuery, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getLabels();
  }, []);

  useEffect(() => {
    if (labelsQueryResult && labelsQueryResult.me) {
      var listData_ = [{ id: 0, text: "Follow Up" }];
      var decodeResult = JSON.parse(labelsQueryResult.me.labels);

      decodeResult &&
        decodeResult.map((item) => {
          listData_.push(item);
        });

        props.setLabelListData(_.cloneDeep(listData_));
    }
  }, [labelsQueryResult]);


  const isLoading = labelsQueryLoading;

  useEffect(() => {
    props.update();
  }, [props.labelListData]);

  const addItem = () => {
    var id = props.labelListData[props.labelListData.length - 1].id + 1;
    var text = props.labelListTextInput;
    var listData_ = _.cloneDeep(props.labelListData);
    if (text != "") {
      var alreadyExist = _.find(listData_, (itm) => itm.text == text);
      if (!alreadyExist) {
        listData_.push({ id: id, text: text });
        props.setLabelListData(_.cloneDeep(listData_));
        props.setLabelListTextInput("");
      } else {
        props.setLabelListTextInput("");
      }
      _.remove(listData_, (itm) => itm.id == 0);
      updateLabels({
        variables: {
          labels: JSON.stringify(listData_),
        },
      });
    }
  };
  return props.isLoading ? (
    <CircularProgress className={classes.loadingCircularProgress} size={24} />
  ) : (
    <Container
      classes={{
        root: classes.mainContainerRoot,
      }}
    >
      <Container disableGutters={true} className={classes.labelAddForm}>
        <TextField
          value={props.labelListTextInput}
          onKeyDown={(e) => {
            if (e.keyCode == 13) {
              addItem();
            }
          }}
          InputProps={{
            classes: {
              input: classes.labelTextInput,
            },
          }}
          onInput={(e) => props.setLabelListTextInput(e.target.value)}
          autoFocus
          variant={"outlined"}
          placeholder={"Label Text"}
        />
        <Button
          onClick={() => {
            addItem();
          }}
          className={classes.labelAddFormButton}
        >
          <AddIcon className={classes.labelAddFormButtonIcon} />
        </Button>
      </Container>
      <List style={{ height: props.containerHeight }}>
        {props.labelListData.map((item) => {
          return (
            <ListItem
              classes={{
                root: classes.listItem,
              }}
             
              button
              className={classes.listItemButton}
            >
              <Typography  onClick={(e) => {
                props.onItemClick && props.onItemClick(item);
              }} className={classes.listItemButtonText}>
                {item.text}
              </Typography>
              {item.id != 0 ? (
                <IconButton
                  className={classes.deleteButton}
                  onClick={() => {
                    var listData_ = props.labelListData;
                    _.remove(listData_, (itm) => itm.id == item.id);
                    props.setLabelListData(_.cloneDeep(listData_));

                    _.remove(listData_, (itm) => itm.id == 0);
                    updateLabels({
                      variables: {
                        labels: JSON.stringify(listData_),
                      },
                    });
                  }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              ) : (
                <AddAlertIcon className={classes.followUpIcon} />
              )}
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    ...state.LabelListReducer 
  };
};

export default connect(mapStateToProps, {
  setLabelListData,
  setLabelListTextInput
})(LabelsList);;
