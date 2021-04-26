export const auth = {
  isAuthenticated() {
    if (this.getIsSwitchAccount())
      return localStorage.getItem("SwitchAccountIsAuthenticated");
    else return localStorage.getItem("IsAuthenticated");
  },
  setToSwitchAccount(){
    localStorage.setItem("IsSwitchAccount",true);
  },
  removeSwitchAccount(){
    localStorage.removeItem("IsSwitchAccount");
  },
  getIsSwitchAccount(){
   return localStorage.getItem("IsSwitchAccount") != null;
  },
  getAuthSettings() {
    if (this.getIsSwitchAccount())
    return localStorage.getItem("SwitchAccountSettings");
    else
    return localStorage.getItem("Settings");
  },
  setIsAuthenticated(value) {
    if (this.getIsSwitchAccount())
      localStorage.setItem("SwitchAccountIsAuthenticated", value);
    else localStorage.setItem("IsAuthenticated", value);
  },

  setAuthSettings(value) {
    if (this.getIsSwitchAccount()) localStorage.setItem("SwitchAccountSettings", value);
    else localStorage.setItem("Settings", value);
  },
  removeIsAuthenticated() {
    if (this.getIsSwitchAccount())
      localStorage.removeItem("SwitchAccountIsAuthenticated");
    else localStorage.removeItem("IsAuthenticated");
  },

  removeAuthSettings() {
    if (this.getIsSwitchAccount()) localStorage.removeItem("SwitchAccountSettings");
    else localStorage.removeItem("Settings");
  },
  getStartupFolderId() {
    if (this.getIsSwitchAccount())
      return localStorage.getItem("SwitchAccountStartupFolderId");
    else return localStorage.getItem("StartupFolderId");
  },
  setStartupFolderId(value) {
    if (this.getIsSwitchAccount())
      localStorage.setItem("SwitchAccountStartupFolderId", value);
    else localStorage.setItem("StartupFolderId", value);
  },
  removeStartupFolderId() {
   
    if (this.getIsSwitchAccount())
      localStorage.removeItem("SwitchAccountStartupFolderId");
    else localStorage.removeItem("StartupFolderId");
  },
};
