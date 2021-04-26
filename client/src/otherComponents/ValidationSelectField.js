import React, { useEffect, useState,useRef } from "react";
import {
  Select,
  InputLabel,
  FormHelperText,
  FormControl,
  MenuItem 
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  formControl: {
   width: 213
  },
  formHelperText: {
    color: "#f44336" 
  },
}));
const ValidationSelectField = (props) => {

  const classes = useStyles();

  const [value, setValue] = useState(props.value);
  const [error, setError] = useState("");

  const selectField = useRef(null);
  useEffect(()=>{
    if(props.value != value){
  
    setValue(props.value);

    }
  },[props.value])
  
  props.validate(() => validate_(value));

  function validate_(value) {
    let valid = true;

    if (props.notEmpty) {

      if ((value && value.length == 0) || value == undefined) {
        setError("This field is required.");
        valid = false;
      } else {
        setError("");
      }
    }
    return valid;
  }

  function handleChange(e) {
    console.log(e.target.value)
  
    setValue(e.target.value);
    validate_(e.target.value);
    props.onChange && props.onChange(e);
  }

 
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel htmlFor="native-simple">{props.label}</InputLabel>
      <Select ref={selectField}

        {...props}
        inputProps={{
          id: "native-simple",
        }}
        value={value}
        onChange={handleChange}
        error={error != ""}
      >
        <option aria-label="None" value="" />
        {props.values && props.values.map((values) => {
          return <MenuItem  value={values[0]} >{values[1]}</MenuItem>;
        })}
      </Select>
      {error ? (
        <FormHelperText className={classes.formHelperText}>{error}</FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default ValidationSelectField;
