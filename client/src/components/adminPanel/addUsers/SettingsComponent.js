import React, { useState, useEffect, useRef } from "react";
import { Checkbox, Container, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { setAddEditUserModalSettings } from "../../../store/actions/AddEditUserModalActions";
import { connect } from "react-redux";
import _ from "lodash";
const useStyles = makeStyles((theme) => ({
  controlField: {
    padding: "10px 10px 10px 10px",
    border: "1px solid gray",
    margin: 10,
  },
}));

const SettingsComponent = (props) => {
  const classes = useStyles();
  const [controls, setControls] = useState([]);

  useEffect(() => {
    var newControls = [];

    if (
      props.addEditUserModalSettings != null &&
      props.addEditUserModalSettings != ""
    ) {
      for (var property in props.addEditUserModalSettings) {
        if (props.addEditUserModalSettings.hasOwnProperty(property)) {
          var control = { childrens: [], name: property };
          if (
            props.addEditUserModalSettings[property] && Object.keys(props.addEditUserModalSettings[property]).length > 0
          ) {
            for (var property_ in props.addEditUserModalSettings[property]) {
              if (
                props.addEditUserModalSettings[property].hasOwnProperty(
                  property_
                )
              ) {
                control.childrens.push({
                  name: property_,
                  value: props.addEditUserModalSettings[property][property_],
                });
              }
            }
          } else {
            control.value = props.addEditUserModalSettings[property];
          }
        }
        //alert("renew")
        newControls.push(control);
      }

      setControls(newControls);
    }
  }, [props.addEditUserModalSettings]);

  const childrenControls = (control) => {
    return control.childrens.map((controlChild) => {
      return (
        <FormControlLabel
          classes={{ label: classes.checkboxLabel }}
          control={
            <Checkbox
              checked={controlChild.value}
              onChange={(event) => {
                //event.target.checked
                //alert( event.target.checked)
                props.addEditUserModalSettings[control.name][
                  controlChild.name
                ] = event.target.checked;

                props.setAddEditUserModalSettings(
                  _.cloneDeep(props.addEditUserModalSettings)
                );
              }}
              name={controlChild.name}
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          }
          label={controlChild.name.split("_").join(" ")}
        />
      );
    });
  };
  return (
    <Container disableGutters={true}>
      {controls.map((control) => {
        if (control.childrens.length > 0) {
          return (
            <Container className={classes.controlField}>
              {childrenControls(control)}
            </Container>
          );
        } else {
          return (
            <Container className={classes.controlField}>
              <FormControlLabel
                classes={{ label: classes.checkboxLabel }}
                control={
                  <Checkbox
                    checked={control.value}
                    onChange={(event) => {
                      props.addEditUserModalSettings[control.name] =
                        event.target.checked;
                      props.setAddEditUserModalSettings(
                        _.cloneDeep(props.addEditUserModalSettings)
                      );
                    }}
                    name={control.name}
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                }
                label={control.name.split("_").join(" ")}
              />
            </Container>
          );
        }
      })}
    </Container>
  );
};
const mapStateToProps = (state) => {
  return { ...state.AddEditUserModalReducer };
};
export default connect(mapStateToProps, {
  setAddEditUserModalSettings,
})(SettingsComponent);
