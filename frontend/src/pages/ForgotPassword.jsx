import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { validateEmail } from "../utils/validators";
import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { requestReset, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setSuccessMessage("");

    // Validate email
    const validation = validateEmail(email);

    if (!validation.isValid) {
      setEmailError(validation.error);
      return;
    }

    const result = await requestReset(email);

    if (result.success) {
      setSuccessMessage("Reset email has been sent. Please check your inbox.");
      setEmail("");

      // Redirect after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Forgot Password</h1>

          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "1.5rem",
            }}
          >
            Enter your email, we will send a link to reset your password
          </p>

          {error && <div className="error-message">{error}</div>}

          {successMessage && (
            <div
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                padding: "0.75rem",
                borderRadius: "5px",
                borderLeft: "4px solid #28a745",
                marginBottom: "1rem",
                animation: "slideDown 0.3s ease",
              }}
            >
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isLoading}
                className={emailError ? "input-error" : ""}
                required
              />
              {emailError && <span className="field-error">{emailError}</span>}
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading && <span className="spinner-mini"></span>}
              {isLoading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              <Link to="/login" className="link">
                Back to login
              </Link>
            </p>
            <p>
              Don't have an account yet?{" "}
              <Link to="/register" className="link">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
