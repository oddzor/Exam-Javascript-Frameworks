import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router";
import "../styles/pages/loginpage.css";

function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, isLoggedIn, role } = useSelector(
    (state: RootState) => state.auth
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLoggedIn && role === "admin") {
      navigate("/admin");
    } else if (isLoggedIn && role === "user") {
      navigate("/cv");
    }
  }, [isLoggedIn, role, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };
  if (!isLoggedIn) {
    return (
      <div className="form-wrapper">
        <h1>Welcome</h1>
        <h3>Please log in to continue</h3>
        <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit" disabled={loading}>
            Login
          </button>
        </form>
        <div className="form-info">
          If you are not a registered user, please click{" "}
          <Link to="/info">Here</Link> to apply for an account
        </div>
      </div>
    );
  }
  return null;
}

export default LoginPage;
