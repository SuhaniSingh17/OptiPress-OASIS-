import React, { useState } from "react";
import "../styles/Login.css";
import logo from "../img/Logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => setIsSignup(!isSignup);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { email, password });
      alert("Signup successful. Please log in.");
      setIsSignup(false);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("userId", res.data.user._id);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={`login-page ${isSignup ? "change" : ""}`}>
      <div className="login-container">
        {/* Forms Section */}
        <div className="forms-container">
          {/* Signup Form */}
          <div className="form-control signup-form">
            <form onSubmit={handleSignup}>
              <h2>Sign up</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit">Sign up</button>
            </form>
          </div>

          {/* Login Form */}
          <div className="form-control signin-form">
            <form onSubmit={handleLogin}>
              <h2>Log in</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Log in</button>
            </form>
          </div>
        </div>

        {/* Intro Section */}
        <div className="intros-container">
          {/* Signin Intro */}
          <div className="intro-control signin-intro">
            <div className="intro-control__inner">
              <span className="logo-icon">
                <img src={logo} alt="Logo" />
              </span>
              <button onClick={toggleForm}>No account yet? Sign up.</button>
            </div>
          </div>

          {/* Signup Intro */}
          <div className="intro-control signup-intro">
            <div className="intro-control__inner">
              <span className="logo-icon">
                <img src={logo} alt="Logo" />
              </span>
              <button onClick={toggleForm}>Already have an account? Log in.</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
