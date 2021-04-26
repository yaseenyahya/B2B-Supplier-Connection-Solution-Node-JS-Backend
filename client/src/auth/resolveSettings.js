import PanelType from "./PanelType";
import _ from "lodash";
export default class resolveSettings {
  superAdminSettings = {
    Users: {
      Add_User: true,
      Edit_User: true,
      Delete_User: true,
    },
    Designations: {
      Add_Designation: true,
      Edit_Designation: true,
      Delete_Designation: true,
    },
    Profiles: {
      Add_Profile: true,
      Edit_Profile: true,
      Delete_Profile: true,
    },
    Pages: {
      Add_Pages: true,
      Delete_Pages: true,
    },
    Other: {
      Get_Online: true,
    },
  };
  adminSettings = {
    Users: {
      Show_Users: true,
      Add_User: false,
      Edit_User: false,
      Delete_User: false,
    },
    Designations: {
      Show_Designations: true,
      Add_Designation: false,
      Edit_Designation: false,
      Delete_Designation: false,
    },
    Profiles: {
      Show_Profiles: true,
      Add_Profile: false,
      Edit_Profile: false,
      Delete_Profile: false,
    },
    Pages: {
      Show_Pages: false,
      Add_Pages: false,
      Delete_Pages: false,
    },
    Other: {
      Get_Online: false,
    },
  };
  agentSettings = {
    Show_Filter: true,
    Show_history: true,
  };
  resolveSettings(settings, panelType) {
    var defaultSettings = null;
    if (panelType == PanelType.SUPERADMIN)
      defaultSettings = _.cloneDeep(this.superAdminSettings);
    else if (panelType == PanelType.ADMIN)
      defaultSettings = _.cloneDeep(this.adminSettings);
    else defaultSettings = _.cloneDeep(this.agentSettings);

    if (settings && settings != "" && panelType != PanelType.SUPERADMIN) {
      try {
        for (var property in defaultSettings) {
          if (defaultSettings.hasOwnProperty(property)) {
            if (Object.keys(defaultSettings[property]).length > 0) {
              for (var property_ in defaultSettings[property]) {
                defaultSettings[property][property_] =
                  settings[property][property_];
              }
            } else {
              defaultSettings[property] = settings[property];
            }
            // Do things here
          }
        }
      } catch (e) {
        if (panelType == PanelType.SUPERADMIN)
          defaultSettings = _.cloneDeep(this.superAdminSettings);
        else if (panelType == PanelType.ADMIN)
          defaultSettings = _.cloneDeep(this.adminSettings);
        else defaultSettings = _.cloneDeep(this.agentSettings);
      }
    }

    return defaultSettings;
  }
}
