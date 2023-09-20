import React, { useState } from "react";

// css
import "./Signup.css";

// assets
import { NetflixLogo, LoginBackground2 } from "../../assets/images/";
import { TextField } from "@material-ui/core";
import Button from "components/UI/Button/Button";
import Axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

let email;

export const Signup = () => {
  email = localStorage.getItem("email");

  const history = useHistory();

  const [form, setForm] = useState({
    password: {
      value: "",
      touched: false,
      valid: false,
    },
    onSubmitInvalid: false,
  });

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name === "password") {
      setForm((prevForm) => ({
        ...prevForm,
        password: {
          ...prevForm.password,
          value: value,
          touched: true,
          valid: value.length >= 4 && value.length <= 60,
        },
      }));
    }
  };

  const fieldBlurHandler = (event) => {
    const { name } = event.target;
    if (name === "password") {
      setForm((prevForm) => ({
        ...prevForm,
        password: {
          ...prevForm.password,
          touched: true,
          valid:
            prevForm.password.value.length >= 4 &&
            prevForm.password.value.length <= 60,
        },
      }));
    }
  };

  let [passwordSpan] = [null];

  if (form.password.touched && !form.password.valid) {
    passwordSpan = (
      <span className="SignupCard__error">
        Password must be between 4 and 60 characters.
      </span>
    );
  }

  const formSubmitHandler = (event) => {
    event.preventDefault();
   if(form.password.valid){

      Axios({
        method: "post",
        url: "https://netflixapi.azurewebsites.net/api/UsersAuth/signup",
        data: {
          userName: email,
          password: form.password.value,
        },
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          history.push("/login");
        }
      });
   }
    else{
      setForm((prevForm) => ({
        ...prevForm,
        onSubmitInvalid: true,
      }));
    
  }
  };

  return (
    <div>
      <div className="Signup">
        <img src={NetflixLogo} alt="Logo" />
        <p
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            localStorage.removeItem("email");
            window.location.href = "/login";
          }}
        >
          Sign In
        </p>
      </div>
      <div className="SignupCard">
        <h1 className="SignupCard__title">Joining Netflix is easy.</h1>

        <p
          style={{
            color: "#8c8c8c",
            fontSize: "1.2rem",
            fontWeight: "400",
            marginBottom: "1rem",
          }}
        >
          Enter your password and you'll be watching in no time.
        </p>

        <p className="SignupCard__email">
          Email <br />
          <span>{email}</span>
        </p>

        <form onSubmit={formSubmitHandler}>
          <TextField
            name="password"
            className="textField"
            label="Password"
            variant="filled"
            type="password"
            value={form.password.value}
            onChange={inputChangeHandler}
            onBlur={fieldBlurHandler}
            autoComplete="off"
          />

          {passwordSpan}

          <Button
            height="60px"
            width="100%"
            borderRadius="0.3rem"
            backgroundColor="#E50914"
            textColor="#fff"
            fontSize="3.5rem"
            fontWeight="400"
            padding="0.5rem 0"
          >
            <span
              style={{
                fontSize: "1.8rem",
              }}
            >
              Next
            </span>
          </Button>
        </form>
      </div>
    </div>
  );
};
