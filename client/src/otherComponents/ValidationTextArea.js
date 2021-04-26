import React, { useState, useEffect } from "react";
import validator from "validator";
import { Container } from "@material-ui/core";
import clsx from "clsx";
const ValidationTextArea = (props, ref) => {
  const valueDefault = props.value ? props.value : "";
  const [value, setValue] = useState(valueDefault);
  const [error, setError] = useState("");

  const inputRef = React.useRef();

  props.validate(() => validate_(value));

  useEffect(() => {
    var timeout = null;
    props.focus &&
      props.focus(() => {
        timeout = setTimeout(() => {
          inputRef.current.focus();
        }, 1000);
      });
    return () => {
      props.focus && clearTimeout(timeout);
    };
  }, []);

  function validate_(value) {
    let valid = true;
    if (props.notEmpty) {
      if (value.length < props.minValue) {
        setError(props.minValueErrorText);
        valid = false;
      }
      if (value === "") {
        setError("This field is required.");
        valid = false;
      }
      if (valid) {
        setError("");
      }
    }
    return valid;
  }

  return (
    <Container
      disableGutters={true}
      style={{
        border: error ? "1px solid red" : "1px solid #969090",
        height: "calc(100% - 10px - 2px)",
        marginBottom: 2,
        padding: "10px 10px",
      }}
    >
      {error && <label className={props.labelClassName}>{error}</label>}
      <textarea
        multiline
        ref={ref}
        autoComplete={"off"}
        {...props}
        onChange={(e) => {
          setValue(e.target.value);
          validate_(e.target.value);
          props.onChange && props.onChange(e);
        }}
      />
    </Container>
  );
};

export default React.forwardRef(ValidationTextArea);
