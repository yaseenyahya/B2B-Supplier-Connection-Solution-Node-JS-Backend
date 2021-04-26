import React, { Component, useEffect,useRef } from "react";

import { CircularProgress,Container } from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { SimpleDataGrid } from "../../SimpleDataGrid";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  setAddEditProfileModalToggle,
  setAddEditProfileModalSelectedRowData,
} from "../../../store/actions/AddEditProfileModalActions";
import AddEditProfileModal from "./AddEditProfileModal";
import { useSnackbar } from "notistack";
const useStyles = makeStyles((theme) => ({
  circularProgress: {
    width: 54,
    height: 54,
    margin: "20px auto",
    display: "block",
  },
}));

const AddProfiles = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const GetProfiles = gql`
    query Profiles {
      profiles {
        id
        name
        paneltype
        settings
      }
    }
  `;

  let [
    getProfiles,
    {
      loading: getProfilesQueryLoading,
      error: getProfilesQueryError,
      data: getProfilesQueryResult,
    },
  ] = useLazyQuery(GetProfiles, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getProfiles();
  }, []);

  const DeleteProfileMutation = gql`
    mutation DeleteProfile($id: ID!) {
      deleteprofile(id: $id) {
        success
        error
      }
    }
  `;

  let [deleteProfile] = useMutation(DeleteProfileMutation);

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
      {getProfilesQueryLoading ? (
        loadingComponent
      ) : (
        <Container
        maxWidth={false}
        disableGutters={true}
        ref={mainContainerRef}
      >
          <SimpleDataGrid
            notAllowEdit={
              props.authSettings && !props.authSettings.Profiles.Edit_Profile
            }
            exportFileName={"Profiles"}
            onRowDelete={
              props.authSettings && props.authSettings.Profiles.Delete_Profile
                ? (oldData) => {
                    return new Promise((resolve, reject) => {
                      deleteProfile({
                        variables: {
                          id: oldData.id,
                        },
                      })
                        .then(({ data }) => {
                          resolve();
                          if (data.deleteprofile && data.deleteprofile.error) {
                            enqueueSnackbar(data.deleteprofile.error, {
                              variant: "error",
                            });
                          } else {
                            getProfiles();
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
            deleteText={"Are you sure you want to delete this profile?"}
            editTooltip={"Edit Profile"}
            deleteTooltip={"Delete Profile"}
            addTooltip={"Add Profile"}
            title={"Profiles"}
            onActionAddClick={
              props.authSettings && props.authSettings.Profiles.Add_Profile
                ? () => {
                    props.setAddEditProfileModalToggle(true);
                  }
                : null
            }
            onActionEditClick={(event, rowData) => {
              props.setAddEditProfileModalSelectedRowData(rowData);
              props.setAddEditProfileModalToggle(true);
            }}
            columns={gridColumns}
            data={
              getProfilesQueryLoading
                ? null
                : getProfilesQueryResult && getProfilesQueryResult.profiles
            }
          />
          <AddEditProfileModal
           mainContainerRef={mainContainerRef}
            onChange={() => {
              getProfiles();
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
  setAddEditProfileModalToggle,
  setAddEditProfileModalSelectedRowData,
})(AddProfiles);
