import React, { useState } from "react";
import apiCalls from "../../services/services";
import "./SignIn.css";

function SignIn() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleCheckClick = () => {
    setChecked(!checked);
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    const loginResult = await apiCalls.login(formState);
    if (loginResult) {
      window.location.href = "/";
    }
  }

  return (
    <div id="signIn-Container">
      <h1 id="signIn-header">Sign in</h1>
      <form id="signIn-form" onSubmit={handleFormSubmit}>
        <div className="inputEl">
          <input
            id="email"
            className="form-input"
            name="email"
            type="email"
            onChange={handleChange}
            value={formState.email}
            placeholder="Email"
          ></input>
        </div>
        <div className="inputEl">
          <input
            id="password"
            className="form-input"
            name="password"
            type={checked ? "text" : "password"}
            onChange={handleChange}
            value={formState.password}
            placeholder="Password"
          ></input>
        </div>
        <div>
          <input
            id="showPassword-checkbox"
            name="showPassword-checkbox"
            type="checkbox"
            onChange={handleCheckClick}
            checked={checked}
          />
          <label id="checkBox-label" htmlFor="showPassword-checkbox">
            Show Password
          </label>
        </div>
        <button type="submit" id="signInSubmitButton">
          Sign in
        </button>
      </form>
      <a id="signUp-link" href="/signUp">
        Create an account
      </a>
      <a
        id="forgotPassword-link"
        href="https://www.google.com/search?q=how+to+stop+being+an+idiot+and+forgetting+my+password"
      >
        Forgot Password?
      </a>
    </div>
  );
}

export default SignIn;
