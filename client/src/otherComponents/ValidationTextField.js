import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import validator from "validator";
import MaskedInput from "react-text-mask";
import clsx from "clsx";
import MaskInput from "./react-maskinput";
const ValidationTextField = (props, ref) => {
  const valueDefault = props.value ? props.value : "";
  const [value, setValue] = useState(valueDefault);
  const [error, setError] = useState("");

  useEffect(() => {
    const valueDefault = props.value ? props.value : "";
    setValue(valueDefault);
  }, [props.value]);
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

    if (props.placeHolderVisible) {
      var string = value.split("-").join("");

      var valueStringArray = string.match(/\d+/);
      var valueString =
        valueStringArray && valueStringArray.length > 0
          ? valueStringArray[0]
          : "";

      if (props.notEmpty) {
        if (valueString.length == 0) {
          setError("This field is required.");
          valid = false;
        }
      }
      if (valueString.length > 0) {
        if (valueString.length >= props.minValue) {
          setError("");
          valid = true;
        } else {
          setError(props.minValueErrorText);
          valid = false;
        }
      }
    }
    if (valid) {
      if (props.mask) {
        value = value
          .replace(/\*/g, "")
          .replace(/\(/g, "")
          .replace(/\)/g, "")
          .replace(/-/g, "")
          .replace(/ /g, "");
      }

      if (value.length < props.minValue) {
        if (value.length > 0 || props.notEmpty) {
          setError(props.minValueErrorText);
          valid = false;
        } else setError("");
      } else setError("");

      if (props.notEmpty) {
        if (value === "") {
          setError("This field is required.");
          valid = false;
        }
        if (valid) {
          setError("");
        }
      }
    }

    if (valid) {
      if (props.validationMatch) {
        if (value != props.validationMatch.text) {
          setError(props.validationMatch.errorText);
          valid = false;
        }
      }
    }
    if (valid) {
      if (props.Email) {
        if (value.length > 0) {
          if (!validator.isEmail(value)) {
            setError("Invalid email address.");
            valid = false;
          } else setError("");
        } else setError("");
      }
    }
    return valid;
  }

  function onInput(e) {
    setValue(e.target.value);
    validate_(e.target.value);
    props.onInput && props.onInput(e);
  }

  return (
    <TextField
      ref={ref}
      inputRef={inputRef}
      {...props}
      onInput={onInput}
      error={error != ""}
      helperText={error}
      autoComplete={"off"}
      InputProps={{
        inputComponent: props.mask ? TextMaskCustom : undefined,
        inputProps: {
          mask: props.mask,
          placeHolderVisible: props.placeHolderVisible,
          onInput: props.onInput,
          placeHolderVisiblePlaceHolder: props.placeHolderVisiblePlaceHolder,
        },
        classes: {
          ...props.InputProps.classes,
          root: clsx({
            [props.onErrorInputRootClass]: error,
            [props.InputProps.classes.root]: !error,
          }),
        },
      }}
    />
  );
};
const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;

  return props.placeHolderVisible ? (
    <MaskInput
      {...other}
      ref={(ref) => {
        alert(ref);
        inputRef(ref ? ref.inputElement : null);
      }}
      onChange={(e) => {
        props.onInput(e);
      }}
      maskString={props.placeHolderVisiblePlaceHolder}
      mask={props.mask}
      size={props.placeholder.length}
      showMask
      placeholder={props.placeholder}
    />
  ) : (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      onError={() => {}}
      mask={props.mask}
      placeholderChar={"*"}
      autoComplete={"off"}
      placeholder={props.placeholder}
    />
  );
};
export default React.forwardRef(ValidationTextField);
