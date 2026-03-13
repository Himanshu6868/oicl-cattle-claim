import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { loginWithUsernamePassword } from "../utils/authApi";
import { setAuthToken } from "../utils/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { token } = await loginWithUsernamePassword();

      if (!token) {
        throw new Error("Token missing in login response.");
      }

      setAuthToken(token);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Unable to login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-bg">
      <section className="login-card">
        <h1>Login To Your OICL Account</h1>

        <p className="sub-line">
          For a more personalized experience, login
        </p>

        <p className="note-line">
          <strong>Note:</strong>
          {" "}
          Click
          {" "}
          <a href="#">here</a>
          {" "}
          to view important guidelines before proceeding
        </p>

        <div className="tab-row">
          <button className="tab active">User ID</button>
          <button className="tab">Mobile Number/Email ID</button>
        </div>

        <input
          className="input-field"
          placeholder="Username *"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          className="input-field"
          placeholder="Password *"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="captcha-label">Captcha *</div>

        <div className="captcha-box">2 k Z K n</div>

        <input className="input-field" placeholder="Enter Captcha" />

        {errorMessage && (
          <p style={{ color: "#b3261e", marginBottom: "8px", fontSize: "14px" }}>{errorMessage}</p>
        )}

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <div className="divider">Or, login with</div>

        <div className="social-row">
          <button className="social-btn">Google</button>
          <button className="social-btn">Facebook</button>
          <button className="social-btn">CSC Connect</button>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
