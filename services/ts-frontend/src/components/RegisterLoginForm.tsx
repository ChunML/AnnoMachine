import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import validator from "validator";
import { formRules } from "./utils/form-rules";

interface RegisterLoginFormProps {
  isAuthenticated: boolean;
  formType: string;
  onButtonClick(formData: RegisterLoginFormStates, formType: string): void;
}

interface RegisterLoginFormStates {
  username: string;
  password: string;
  valid: boolean;
}

function RegisterLoginForm(props: RegisterLoginFormProps) {
  const [states, setStates] = useState<RegisterLoginFormStates>({
    username: "",
    password: "",
    valid: false,
  });

  useEffect(() => {
    validateForm();
  }, [states.username, states.password]);

  const validateForm = () => {
    const { username, password } = states;

    formRules[0].valid = !!validator.isLength(username, { min: 5 });
    formRules[1].valid = !!validator.isHalfWidth(username);
    formRules[2].valid = !!validator.isLength(password, { min: 8 });

    const valids = formRules.map((rule) => rule.valid);

    setStates({
      ...states,
      valid: valids.reduce((res, cur) => res && cur),
    });
  };

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setStates({
      ...states,
      [name]: value,
    });
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { onButtonClick, formType } = props;

    onButtonClick(states, formType);
  };

  const { isAuthenticated, formType } = props;
  const { username, password, valid } = states;
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container column" style={{ margin: "30px auto" }}>
      <ul style={{ listStyle: "none", display: "block" }}>
        {formRules.map((rule) => (
          <li
            key={rule.id}
            style={{ color: rule.valid ? "#11CC11" : "#EE1233" }}
          >
            {rule.valid && "✔"}
            {rule.message}
          </li>
        ))}
      </ul>
      <div className="form">
        <div className="input-field">
          <input
            name="username"
            type="text"
            placeholder="Enter a username"
            value={username}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-field">
          <input
            name="password"
            type="password"
            placeholder="Enter a secure password"
            value={password}
            onChange={handleInputChange}
          />
        </div>
        <button
          type="submit"
          className={`button${valid ? " primary" : ""}`}
          onClick={handleButtonClick}
          disabled={!valid}
        >
          {formType === "register" ? "Register" : "Log In"}
        </button>
      </div>
    </div>
  );
}

RegisterLoginForm.propTypes = {
  isAuthenticated: PropTypes.bool,
  formType: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
};

RegisterLoginForm.defaultProps = {
  isAuthenticated: false,
};

export default RegisterLoginForm;
