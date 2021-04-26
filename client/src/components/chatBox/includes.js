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
    callback
  ) {
    var isWait = false;
    while (!WindowFB) {
      isWait = true;
      await this.timer(1000);
    }
    if(isWait)
    await this.timer(2000);
    var result = null;
    var findItemAvail = _.find(
      chatBoxFacebookIDsWithProfileDetails,
      (item) => item.id == pageId
    );

    if (!findItemAvail) {
      WindowFB &&
        WindowFB.api(
          `/${pageId}?fields=name,picture&access_token=${"EAAClnXIorPcBALaqEOTfZA2vZCLk0s4UUejZB95P2F9Eh9YU6aiwRMzEQA3X4CnYMRdLRPf5fC784E1I4CZCqjsfbScQBCPS4UeU5ShDvyynS0uOyIIHjNzuxopZCZAXrCjYGzZB7jZCrgax9IjUmlmAYAN44rIYblMnPa97ivUjRQZDZD"}`,
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
    } else {
      callback(findItemAvail);
    }
  }
  async resolveClientInfo(
    WindowFB,
    customerId,
    chatBoxFacebookIDsWithProfileDetails,
    setChatBoxFacebookIDsWithProfileDetails,
    callback
  ) {
    while (!WindowFB) {
      await this.timer(1000);
    }

    var result = null;
    var findItemAvail = _.find(
      chatBoxFacebookIDsWithProfileDetails,
      (item) => item.id == customerId
    );

    if (!findItemAvail) {
    WindowFB &&
      window.FB.api(
        `/${customerId}?fields=first_name,last_name,profile_pic&access_token=${"EAAClnXIorPcBALaqEOTfZA2vZCLk0s4UUejZB95P2F9Eh9YU6aiwRMzEQA3X4CnYMRdLRPf5fC784E1I4CZCqjsfbScQBCPS4UeU5ShDvyynS0uOyIIHjNzuxopZCZAXrCjYGzZB7jZCrgax9IjUmlmAYAN44rIYblMnPa97ivUjRQZDZD"}`,
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
                responsePicture.first_name + " " + responsePicture.last_name,
            };
            chatBoxFacebookIDsWithProfileDetails.push(result);
            setChatBoxFacebookIDsWithProfileDetails(
              chatBoxFacebookIDsWithProfileDetails
            );
            callback(result);
          }
        }
      );
    }else{
      callback(findItemAvail);
    }
  }
}
