import _ from "lodash";
export default class includes {
  bindItemToMainChat(
    item,
    chatBoxRecentChatListData,
    setChatBoxRecentChatListData,
    chatBoxSelectedChatsOnFloating,

    setChatBoxSelectedChatsOnFloating
  ) {
    var findPreviousSelectedItem = _.find(
      chatBoxRecentChatListData,
      (itm) => itm.selected == true
    );

    if (findPreviousSelectedItem) {
      findPreviousSelectedItem.selected = false;
    }
    var findItem = _.find(
      chatBoxRecentChatListData,
      (itm) => itm.customerId == item.customerId
    );

    if (findItem) {
      findItem.selected = true;
      setChatBoxRecentChatListData(_.cloneDeep(chatBoxRecentChatListData));
    }

    var findPreviousChatsOnFloatingSelectedItem = _.find(
      chatBoxSelectedChatsOnFloating,
      (itm) => itm.selected == true
    );

    if (findPreviousChatsOnFloatingSelectedItem) {
      findPreviousChatsOnFloatingSelectedItem.selected = false;
    }
    // if (props.chatBoxSelectedChatOnMain) {
    var chatBoxSelectedChatsOnFloatingAlreadyAvailable = _.find(
      chatBoxSelectedChatsOnFloating,
      (itm) => itm.customerId == item.customerId
    );
    if (chatBoxSelectedChatsOnFloatingAlreadyAvailable == undefined)
      chatBoxSelectedChatsOnFloating.push(findItem);
    else chatBoxSelectedChatsOnFloatingAlreadyAvailable.selected = true;
    // } else {
    //   props.setChatBoxSelectedChatOnMain(findItem);
    // }
    setChatBoxSelectedChatsOnFloating(
      _.cloneDeep(chatBoxSelectedChatsOnFloating)
    );
  }
  timer = (ms) => new Promise((res) => setTimeout(res, ms));
  async resolvePageInfo(
    WindowFB,
    pageId,
    chatBoxFacebookIDsWithProfileDetails,
    setChatBoxFacebookIDsWithProfileDetails,
    callback,
    authPagesData
  ) {
    var isWait = false;
    while (!WindowFB) {
      isWait = true;
      await this.timer(1000);
    }
    if (isWait) await this.timer(2000);
    var result = null;
    var findItemAvail = _.find(
      chatBoxFacebookIDsWithProfileDetails,
      (item) => item.id == pageId
    );

    if (!findItemAvail) {
      var pageDataForAccessToken = _.find(
        authPagesData,
        (pages) => pages.pageId == pageId
      );

      if (pageDataForAccessToken) {
        WindowFB &&
          WindowFB.api(
            `/${pageId}?fields=name,picture&access_token=${pageDataForAccessToken.accesstoken}`,
            {
              redirect: "0",
            },
            function (responsePicture) {
              if (responsePicture && !responsePicture.error) {
                result = {
                  type: "page",
                  id: pageId,
                  image: responsePicture.picture.data.url,
                  name: responsePicture.name,
                };
                chatBoxFacebookIDsWithProfileDetails.push(result);
                setChatBoxFacebookIDsWithProfileDetails(
                  chatBoxFacebookIDsWithProfileDetails
                );
                callback(result);
              }
            }
          );
      }
    } else {
      callback(findItemAvail);
    }
  }
  async resolveClientInfo(
    WindowFB,
    customerId,
    pageId,
    chatBoxFacebookIDsWithProfileDetails,
    setChatBoxFacebookIDsWithProfileDetails,
    callback,
    authPagesData
  ) {
    console.log("trigger avatar abroo");
    while (!WindowFB) {
      await this.timer(1000);
    }
    console.log("trigger avatar abroo2");
    var result = null;
    var findItemAvail = _.find(
      chatBoxFacebookIDsWithProfileDetails,
      (item) => item.id == customerId
    );

    if (!findItemAvail) {
      console.log("trigger avatar abroo3");
      var pageDataForAccessToken = _.find(
        authPagesData,
        (pages) => pages.pageId == pageId
      );
      console.log(authPagesData);
      console.log(pageId);
      if (pageDataForAccessToken) {
        WindowFB &&
          window.FB.api(
            `/${customerId}?fields=first_name,last_name,profile_pic&access_token=${pageDataForAccessToken.accesstoken}`,
            {
              redirect: "0",
            },
            (responsePicture) => {
              if (responsePicture && !responsePicture.error) {
                result = {
                  type: "customer",
                  id: customerId,
                  image: responsePicture.profile_pic,
                  name:
                    responsePicture.first_name +
                    " " +
                    responsePicture.last_name,
                };
                chatBoxFacebookIDsWithProfileDetails.push(result);
                setChatBoxFacebookIDsWithProfileDetails(
                  chatBoxFacebookIDsWithProfileDetails
                );
                callback(result);
              }
            }
          );
      }
    } else {
      callback(findItemAvail);
    }
  }
}
