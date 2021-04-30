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
import { Facebook } from "../../../auth/Facebook";
import expressConfig from "../../../config/express.json";
import axios from "axios";
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
  const env = process.env.NODE_ENV || "development";
  const config = expressConfig[env];
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
                ?  (oldData) => {
             
                    window.FB.login(
                      async  (responseLogin) => {
                    
                        var longAccessToken = null;
                        if (responseLogin.status === "connected") {
                          try {
                          const response = await axios
                            .get(
                        
                              `https://graph.facebook.com/oauth/access_token?  
                              grant_type=fb_exchange_token&          
                              client_id=${config.facebook_app_id}&
                              client_secret=${config.facebook_app_secret}&
                              fb_exchange_token=${responseLogin.authResponse.accessToken}`
                              )
                              console.log("Long Live Access Token");
                              longAccessToken = response.data.access_token;
                            } catch (error) {
                              console.log("long lived token error ",error)
                            }
                            
                     if(longAccessToken){
                       
                          window.FB.api(
                            `/${responseLogin.authResponse.userID}/accounts?access_token=${longAccessToken}`,
                            (responseAccount) => {
                              console.log(responseAccount);
                              if (responseAccount && !responseAccount.error) {
                                var filterData = responseAccount.data;
                                console.log("pages_result", filterData);
                                getPagesQueryResult.pages.map((item) => {
                                  filterData = _.filter(
                                    filterData,
                                    (responseData) =>
                                      responseData.id != item.pageId
                                  );
                                });

                                props.setaddEditPagesModalPages(filterData);
                                props.setAddEditPagesModalToggle(true);
                              } else if (
                                responseAccount &&
                                responseAccount.error
                              ) {
                                enqueueSnackbar(responseAccount.error.message, {
                                  variant: "error",
                                });
                              }
                            }
                          );
                        }
                      }
                        //console.log(response.authResponse.accessToken);
                      },
                      { scope: "pages_show_list,pages_messaging" }
                    );
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
  return { ...state.AddEditPagesModalReducer, ...state.AuthReducer };
};

export default connect(mapStateToProps, {
  setAddEditPagesModalToggle,
  setaddEditPagesModalPages,
})(AddPages);
