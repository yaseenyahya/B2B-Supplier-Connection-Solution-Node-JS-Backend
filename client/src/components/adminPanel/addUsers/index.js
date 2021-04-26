import React, { Component, useEffect,useRef } from "react";

import { CircularProgress,Container } from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { SimpleDataGrid } from "../../SimpleDataGrid";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  setAddEditUserModalToggle,
  setAddEditUserModalSelectedRowData,
} from "../../../store/actions/AddEditUserModalActions";
import AddEditUserModal from "./AddEditUserModal";
import { useSnackbar } from "notistack";
import PanelType from "../../../auth/PanelType";
import _ from "lodash";
const useStyles = makeStyles((theme) => ({
  circularProgress: {
    width: 54,
    height: 54,
    margin: "20px auto",
    display: "block",
  },
}));

const AddUsers = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const GetUsers = gql`
    query Users {
      users {
        id
        picture
        name
        pseudonym
        username
        email
        number
        designation {
          id
          name
          paneltype
        }
        status
        comments
        managerId {
          id
          name
        }
        settings
      }
    }
  `;

  let [
    getUsers,
    {
      loading: getUsersQueryLoading,
      error: getUsersQueryError,
      data: getUsersQueryResult,
    },
  ] = useLazyQuery(GetUsers, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    window.Object.freeze = function(obj) { return obj }
    getUsers();
  }, []);

  const DeleteUserMutation = gql`
    mutation DeleteUser($id: ID!) {
      deleteuser(id: $id) {
        success
        error
      }
    }
  `;

  let [deleteUser] = useMutation(DeleteUserMutation);

  const loadingComponent = (
    <div className={classes.circularProgress}>
      <CircularProgress size={24} />
    </div>
  );
  const gridColumns = [
    {
      title: "",
      field: "picture",
      render: (rowData) => (
        <img
          src={rowData.picture}
          style={{
            width: 50,
            height: 50,
            marginTop: 3,
            marginBottom: 5,
            borderRadius: "50%",
          }}
        />
      ),
      export: false,
    },
    { title: "Name", field: "name" },
    { title: "Pseudonym", field: "pseudonym" },
    { title: "Username", field: "username" },
    { title: "Email", field: "email" },
    { title: "Mobile Number", field: "number" },
    { title: "Designation", field: "designation.name" },
    { title: "Manager", field: "managerId.name" },
    { title: "Status", field: "status" },
    { title: "comments", field: "comments" },
  ];
  const isEditableDeleteable = (rowData) => {
    return (
      props.authUserId == rowData.id ||
      !(
        props.authPanelType == PanelType.SUPERADMIN ||
        (props.authPanelType != PanelType.SUPERADMIN &&
          rowData.designation.paneltype != PanelType.SUPERADMIN)
      )
    );
  };
  const mainContainerRef = useRef(null);
  return (
    <>
      {getUsersQueryLoading ? (
        loadingComponent
      ) : (
        <Container
          maxWidth={false}
          disableGutters={true}
          ref={mainContainerRef}
        >
          <SimpleDataGrid
            isDeleteHidden={(rowData) => {
              return isEditableDeleteable(rowData);
            }}
            isEditHidden={(rowData) => {
              return isEditableDeleteable(rowData);
            }}
            notAllowEdit={
              props.authSettings && !props.authSettings.Users.Edit_User
            }
            exportFileName={"Users"}
            onRowDelete={
              props.authSettings && props.authSettings.Users.Delete_User
                ? (oldData) => {
                    return new Promise((resolve, reject) => {
                      deleteUser({
                        variables: {
                          id: oldData.id,
                        },
                      })
                        .then(({ data }) => {
                          resolve();
                          if (data.deleteuser && data.deleteuser.error) {
                            enqueueSnackbar(data.deleteuser.error, {
                              variant: "error",
                            });
                          } else {
                            getUsers();
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
            deleteText={"Are you sure you want to delete this user?"}
            editTooltip={"Edit User"}
            deleteTooltip={"Delete User"}
            addTooltip={"Add User"}
            title={"Users"}
            onActionAddClick={
              props.authSettings && props.authSettings.Users.Add_User
                ? () => {
                    props.setAddEditUserModalToggle(true);
                  }
                : null
            }
            onActionEditClick={(event, rowData) => {
              if (props.authUserId == rowData.id) {
                enqueueSnackbar("Cannot edit logged in user.", {
                  variant: "error",
                });
              } else if (isEditableDeleteable(rowData)) {
                enqueueSnackbar("Cannot edit user.", {
                  variant: "error",
                });
              } else {
                props.setAddEditUserModalSelectedRowData(rowData);
                props.setAddEditUserModalToggle(true);
              }
            }}
            columns={gridColumns}
            data={
              getUsersQueryLoading
                ? null
                : getUsersQueryResult && getUsersQueryResult.users
            }
          />
          <AddEditUserModal
            mainContainerRef={mainContainerRef}
            onChange={() => {
              getUsers();
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
  setAddEditUserModalToggle,
  setAddEditUserModalSelectedRowData,
})(AddUsers);
