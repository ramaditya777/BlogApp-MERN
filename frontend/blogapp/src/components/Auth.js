import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Corrected typo
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async (type) => {
    const endpoint = type === "signup" ? "signup" : "login";
    try {
      const res = await axios.post(
        `http://localhost:8000/api/user/${endpoint}`,
        {
          name: inputs.name,
          email: inputs.email,
          password: inputs.password,
        }
      );
      const data = res.data;
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    if (isSignup) {
      sendRequest("signup")
        .then((data) => localStorage.setItem("userId", data.user._id))
        .then((data) => {
          if (data) {
            console.log(data);
            dispatch(authActions.login());
            navigate("/blogs");
          }
        })
        .catch((err) => console.log(err));
    } else {
      sendRequest("login")
        .then((data) => localStorage.setItem("userId", data.user._id))
        .then(() => dispatch(authActions.login()))
        .then(() => navigate("/blogs"))
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box
          maxWidth={400}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          margin="auto"
          marginTop={5}
          borderRadius={5}
        >
          <Typography variant="h2" padding={3} textAlign="center">
            {isSignup ? "Signup" : "Login"}
          </Typography>
          {isSignup && (
            <TextField
              name="name"
              value={inputs.name}
              onChange={handleChange}
              placeholder="Name"
              margin="normal"
            />
          )}
          <TextField
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            placeholder="Email"
            margin="normal"
          />
          <TextField
            type="password"
            name="password"
            onChange={handleChange}
            value={inputs.password}
            placeholder="Password"
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: 3, marginTop: 3 }}
            color="warning"
          >
            Submit
          </Button>
          <Button
            onClick={() => setIsSignup(!isSignup)}
            sx={{ borderRadius: 3, marginTop: 3 }}
          >
            Change To {isSignup ? "Login" : "Signup"}
          </Button>
        </Box>
      </form>
    </>
  );
};

export default Auth;
