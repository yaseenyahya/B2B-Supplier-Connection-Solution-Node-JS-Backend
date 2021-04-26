import React, { useRef, useEffect } from "react";
import { CircularProgress, Container } from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { SimpleDataGrid } from "../../SimpleDataGrid";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  setAddEditDesignationModalToggle,
  setAddEditDesignationModalSelectedRowData,
} from "../../../store/actions/AddEditDesignationModalActions";
import AddEditDesignationModal from "./AddEditDesignationModal";
import { useSnackbar } from "notistack";
const useStyles = makeStyles((theme) => ({
  profilePicture: {
    width: 55,
  },
  profilePicMenuPaper: {
    background: "rgb(46 62 78)",
    borderRadius: 0,
  },
  profilePicMenuItem: {
    color: "white",
  },
  circularProgress: {
    width: 54,
    height: 54,
    margin: "20px auto",
    display: "block",
  },
}));

const AddDesignations = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const GetDesignations = gql`
    query Designations {
      designations {
        id
        name
        paneltype
      }
    }
  `;

  let [
    getDesignations,
    {
      loading: getDesignationsQueryLoading,
      error: getDesignationsQueryError,
      data: getDesignationsQueryResult,
    },
  ] = useLazyQuery(GetDesignations, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getDesignations();
  }, []);

  const DeleteDesignationMutation = gql`
    mutation DeleteDesignation($id: ID!) {
      deletedesignation(id: $id) {
        success
        error
      }
    }
  `;

  let [deleteDesignation] = useMutation(DeleteDesignationMutation);

  const loadingComponent = (
    <div className={classes.circularProgress}>
      <CircularProgress size={24} />
    </div>
  );
  const gridColumns = [
    { title: "Name", field: "name" },
    { title: "Paneltype", field: "paneltype" },
  ];
  const mainContainerRef = useRef(null);
  return (
    <>
      {getDesignationsQueryLoading ? (
        loadingComponent
      ) : (
        <Container maxWidth={false} disableGutters={true} ref={mainContainerRef}>
          <SimpleDataGrid
            notAllowEdit={
              props.authSettings &&
              !props.authSettings.Designations.Edit_Designation
            }
            exportFileName={"Designations"}
            onRowDelete={
              props.authSettings &&
              props.authSettings.Designations.Delete_Designation
                ? (oldData) => {
                    return new Promise((resolve, reject) => {
                      deleteDesignation({
                        variables: {
                          id: oldData.id,
                        },
                      })
                        .then(({ data }) => {
                          resolve();
                          if (
                            data.deletedesignation &&
                            data.deletedesignation.error
                          ) {
                            enqueueSnackbar(data.deletedesignation.error, {
                              variant: "error",
                            });
                          } else {
                            getDesignations();
                          }
                        })
                        .catch((e) => {
                          enqueueSnackbar(e, { variant: "error" });
                        });
                    });
                  }
                : null
            }
            onRowUpdateInline={null}
            inlineEdit={false}
            deleteText={"Are you sure you want to delete this designation?"}
            editTooltip={"Edit Designation"}
            deleteTooltip={"Delete Designation"}
            addTooltip={"Add Designation"}
            title={"Designations"}
            onActionAddClick={
              props.authSettings &&
              props.authSettings.Designations.Add_Designation
                ? () => {
                    props.setAddEditDesignationModalToggle(true);
                  }
                : null
            }
            onActionEditClick={(event, rowData) => {
              props.setAddEditDesignationModalSelectedRowData(rowData);
              props.setAddEditDesignationModalToggle(true);
            }}
            columns={gridColumns}
            data={
              getDesignationsQueryLoading
                ? null
                : getDesignationsQueryResult &&
                  getDesignationsQueryResult.designations
            }
          />
          <AddEditDesignationModal
            mainContainerRef={mainContainerRef}
            onChange={() => {
              getDesignations();
            }}
          />
        </Container>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return { ...state.AuthReducer };
};

export default connect(mapStateToProps, {
  setAddEditDesignationModalToggle,
  setAddEditDesignationModalSelectedRowData,
})(AddDesignations);
