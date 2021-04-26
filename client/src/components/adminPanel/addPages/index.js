import React, { useEffect, useRef } from "react";

import { CircularProgress } from "@material-ui/core";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { SimpleDataGrid } from "../../SimpleDataGrid";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {
  setAddEditPagesModalToggle,
  setaddEditPagesModalPages,
} from "../../../store/actions/AddEditPagesModalActions";
import { useSnackbar } from "notistack";
import FacebookPagesSelectionModal from "./FacebookPagesSelectionModal";
import _ from "lodash";
import {Facebook} from "../../../auth/Facebook";
const useStyles = makeStyles((theme) => ({
  circularProgress: {
    width: 54,
    height: 54,
    margin: "20px auto",
    display: "block",
  },
  facebookMainButton: {
    display: "none",
  },
}));

const AddPages = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const GetPages = gql`
    query Pages {
      pages {
        id
        name
        pageId
        accesstoken
      }
    }
  `;

  let [
    getPages,
    {
      loading: getPagesQueryLoading,
      error: getUsersQueryError,
      data: getPagesQueryResult,
    },
  ] = useLazyQuery(GetPages, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getPages();
  }, []);

  const DeletePageMutation = gql`
    mutation DeletePage($id: ID!) {
      deletepage(id: $id) {
        success
        error
      }
    }
  `;

  let [deletePage] = useMutation(DeletePageMutation);

  const facebookAuthButtonClickRef = useRef(null);
  const loadingComponent = (
    <div className={classes.circularProgress}>
      <CircularProgress size={24} />
    </div>
  );
  const gridColumns = [
    { title: "Name", field: "name" },
    { title: "Page Id", field: "pageId" },

    { title: "AccessToken", field: "accesstoken" },
  ];
  useEffect(() => {
    Facebook.fbInt();
  }, []);
  return (
    <>
      {getPagesQueryLoading ? (
        loadingComponent
      ) : (
        <>
          <SimpleDataGrid
            notAllowEdit={true}
            exportFileName={"Pages"}
            onRowDelete={
              props.authSettings && props.authSettings.Pages.Delete_Pages
                ? (oldData) => {
                    return new Promise((resolve, reject) => {
                      deletePage({
                        variables: {
                          id: oldData.id,
                        },
                      })
                        .then(({ data }) => {
                          resolve();
                          if (data.deletepage && data.deletepage.error) {
                            enqueueSnackbar(data.deletepage.error, {
                              variant: "error",
                            });
                          } else {
                            getPages();
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
            deleteText={"Are you sure you want to delete this page?"}
            deleteTooltip={"Delete Pages"}
            addTooltip={"Add Page"}
            title={"Pages"}
            onActionAddClick={
              props.authSettings && props.authSettings.Pages.Add_Pages
                ? (oldData) => {
                    window.FB.login((responseLogin) => {
                    
                      if (responseLogin.status === "connected") {
                        window.FB.api(
                          `/${responseLogin.authResponse.userID}/accounts?access_token=${responseLogin.authResponse.accessToken}`,
                          (responseAccount) => {
                            console.log(responseAccount)
                            if (responseAccount && !responseAccount.error) {
                              var filterData = responseAccount.data;
                              getPagesQueryResult.pages.map((item) => {
                                filterData = _.filter(
                                  filterData,
                                  (responseData) =>
                                    responseData.id != item.pageId
                                );
                              });

                              props.setaddEditPagesModalPages(filterData);
                              props.setAddEditPagesModalToggle(true);
                            }else if(responseAccount && responseAccount.error){
                              enqueueSnackbar(responseAccount.error.message, {
                                variant: "error",
                              });
                            }
                          }
                        );
                      }

                      //console.log(response.authResponse.accessToken);
                    });
                    // FB.login(function (response) {
                    // alert("asda");
                    //});
                    // facebookAuthButtonClickRef.current.click();
                  }
                : null
            }
            columns={gridColumns}
            data={
              getPagesQueryLoading
                ? null
                : getPagesQueryResult && getPagesQueryResult.pages
            }
          />
          <FacebookPagesSelectionModal
            onChange={() => {
              getPages();
            }}
          />
        </>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return { ...state.AddEditPagesModalReducer,...state.AuthReducer };
};

export default connect(mapStateToProps, {
  setAddEditPagesModalToggle,
  setaddEditPagesModalPages,
})(AddPages);
