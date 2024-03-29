import React, { Component } from "react";
import {
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";

class FieldGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
  }
  render() {
    const {
      label,
      addonLeft,
      addonRight,
      formGroupProps,
      labelProps,
      inputProps,
      inputGroupProps,
      inputGroupAddonProps
    } = this.props;
    var classes = " ";

    if (inputGroupProps !== undefined) {
      if (inputGroupProps.className !== undefined) {
        classes += inputGroupProps.className + " ";
      }
    }
    
    if (addonLeft !== undefined || addonRight !== undefined)
      return (
        <InputGroup
          {...inputGroupProps}
          className={classes + (this.state.focus ? "input-group-focus" : "")}
        >
          {addonLeft !== undefined ? (
            <InputGroupAddon {...inputGroupAddonProps}>
              {addonLeft}
            </InputGroupAddon>
          ) : (
            ""
          )}
          <Input
            {...inputProps}
            onFocus={e => this.setState({ focus: true })}
            onBlur={e => this.setState({ focus: false })}
          />
          {addonRight !== undefined ? (
            <InputGroupAddon {...inputGroupAddonProps}>
              {addonRight}
            </InputGroupAddon>
          ) : (
            ""
          )}
        </InputGroup>
      );
    return inputProps.type === "radio" || inputProps.type === "checkbox" ? (
      <FormGroup
        {...formGroupProps}
        className={inputProps.type === "radio" ? "form-check-radio" : ""}
      >
        <Label {...labelProps}>
          <Input {...inputProps} />
          <span className="form-check-sign" />
          {label ? label : ""}
        </Label>
      </FormGroup>
    ) : (
      <FormGroup {...formGroupProps}>
        {label ? <Label {...labelProps}>{label}</Label> : ""}
        <Input {...inputProps} />
      </FormGroup>
    );
  }
}

export class FormInputs extends Component {
  render() {
    var row = [];
    for (var i = 0; i < this.props.ncols.length; i++) {
      row.push(
        <div key={i} className={this.props.ncols[i]}>
          <FieldGroup {...this.props.proprieties[i]} />
        </div>
      );
    }
    return <div className="row">{row}</div>;
  }
}

FormInputs.propTypes = {
  ncols: PropTypes.arrayOf(PropTypes.string),
  proprieties: PropTypes.arrayOf(PropTypes.object)
};

export default FormInputs;
