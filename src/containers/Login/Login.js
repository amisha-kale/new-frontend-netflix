import React, { useState, useContext } from "react";
import "./Login.css";

import { NetflixLogo, LoginBackground2 } from "assets/images/";
import { TextField } from "@material-ui/core";
import Button from "components/UI/Button/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { useHistory } from "react-router-dom";
import { AuthenticationContext } from "context/Authentication";
import { validEmailAndPhoneNumber } from "utils/validation";
import Axios from "axios";


// jwt decode

import jwt_decode from "jwt-decode";

/**
 * The login component, which validates the email and password
 * fields and uses a controlled form. Uses material UI for the
 * textfields.
 *
 *
 *
 */

let userId;

const Login = (props) => {

  

  const [form, setForm] = useState({
    email: {
      value: "",
      touched: false,
      valid: false,
    },

    password: {
      value: "",
      touched: false,
      valid: false,
    },

    onSubmitInvalid: false,
  });

  const history = useHistory();
  // const authContext = useContext(AuthenticationContext);

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setForm((prevForm) => ({
        ...prevForm,
        email: {
          ...prevForm.email,
          value: value,
          touched: true,
          valid: value.length > 0 && validEmailAndPhoneNumber(value),
        },
      }));
    } else if (name === "password") {
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

  // For setting error spans once any of the fields are touched.
  const fieldBlurHandler = (event) => {
    if (event.target.name === "email") {
      if (form.email.value === "") {
        setForm((prevForm) => ({
          ...prevForm,
          email: { ...prevForm.email, touched: true },
        }));
      }
    }

    if (event.target.name === "password") {
      if (form.password.value === "") {
        setForm((prevForm) => ({
          ...prevForm,
          password: { ...prevForm.password, touched: true },
        }));
      }
    }
  };

  let [emailSpan, passwordSpan] = [null, null];

  if (
    (!form.email.valid && form.email.touched) ||
    (form.onSubmitInvalid && !form.email.valid)
  ) {
    emailSpan = <span>Please enter a valid email or phone number.</span>;
  }

  if (
    (!form.password.valid && form.password.touched) ||
    (form.onSubmitInvalid && !form.password.valid)
  ) {
    passwordSpan = (
      <span>Your password must contain between 4 and 60 characters.</span>
    );
  }

  const checkForPlan = async () => {

    await Axios({
      method: "post",
      url: `https://netflixapi.azurewebsites.net/api/Subscription/${localStorage.getItem(
        "userId"
      )}`,
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("token")}`,
      // },

      data: {
        userId: localStorage.getItem("userId"),
      },
    })
      .then((res) => {
        console.log(res.data);
        if (res.data === "No subscriptions found for the specified user.") {
          alert("You are not subscribed to any plan");
          setTimeout(() => {
            history.push("/signup/planform");
          }, 1000);
        } else {
          alert("You are already subscribed to a plan");
          setTimeout(() => {
            history.push("/browse");
          }, 1000);
        }
      })
      .catch((err) => {
        console.log("hello");
      });

  }

  const formSubmitHandler = (event) => {
    event.preventDefault();
    if (!form.email.valid || !form.password.valid) {
      setForm((prevForm) => ({ ...prevForm, onSubmitInvalid: true }));
    } else {
      Axios({
        method: "post",
        url: "https://netflixapi.azurewebsites.net/api/UsersAuth/login",
        data: {
          userName: form.email.value,
          password: form.password.value,
        },
      })
        .then((res) => {
          userId = res.data.token;
          localStorage.setItem("token", userId);
          userId = jwt_decode(userId);
          localStorage.setItem("userId", userId.unique_name);
          console.log(userId.unique_name);
          if (res.status === 200) {
            checkForPlan();
          }
        })
        .catch((err) => {
          alert("Invalid Credentials/Either you are not registered");
        });

      
    }
  };

  return (
    <div
      className="Login"
      style={{ backgroundImage: `url(${LoginBackground2})` }}
    >
      <img src={NetflixLogo} alt="Logo" onClick={() => history.push("/")} />
      <div className="LoginCard1">
        <h1>Sign In</h1>
        <form onSubmit={formSubmitHandler}>
          <TextField
            name="email"
            className="textField"
            label="Email or phone number"
            variant="filled"
            type="text"
            style={{ backgroundColor: "#333" }}
            color="secondary"
            value={form.email.value}
            onChange={inputChangeHandler}
            onBlur={fieldBlurHandler}
            autoComplete="off"
            InputLabelProps={{
              style: { color: "#8c8c8c" },
            }}
          />

          {emailSpan}

          <TextField
            name="password"
            className="textField"
            label="Password"
            variant="filled"
            type="password"
            style={{ backgroundColor: "#333" }}
            color="secondary"
            value={form.password.value}
            onChange={inputChangeHandler}
            onBlur={fieldBlurHandler}
            autoComplete="off"
            InputLabelProps={{
              style: { color: "#8c8c8c" },
            }}
          />

          {passwordSpan}

          <Button
            height="45px"
            width="100%"
            backgroundColor="#e50914"
            textColor="#fff"
          >
            Sign In
          </Button>
        </form>

        <div className="HorizontalDiv">
          <FormControlLabel
            style={{ marginLeft: "-12px" }}
            control={
              <Checkbox style={{ color: "rgb(229, 9, 20)" }} name="checkedB" />
            }
            label="Remember Me"
          />
          <span>Need help?</span>
        </div>
        <p
          style={{
            color: "#8c8c8c",
            fontSize: "1.2rem",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          New to Netflix?{" "}
          <span
            style={{
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => history.push("/")}
          >
            Sign up now.
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
