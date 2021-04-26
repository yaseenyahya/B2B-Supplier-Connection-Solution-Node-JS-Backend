export const LocalStorage =  {
  getAdminPanelChatOnline() {
    console.log("Asdasdahina",localStorage.getItem("adminPanelChatOnline"));
    return JSON.parse(localStorage.getItem("adminPanelChatOnline"));
  },
  setAdminPanelChatOnline(value) {

    localStorage.setItem("userPanelChatOnline", value);
  },
  getUserPanelChatOnline() {
    
    return JSON.parse(localStorage.getItem("userPanelChatOnline"));
  },
  setUserPanelChatOnline(value) {

    localStorage.setItem("userPanelChatOnline", value);
  }
}
