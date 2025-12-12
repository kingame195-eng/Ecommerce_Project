import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { validateLoginForm } from "../utils/validators";
import "./Auth.css";

function Login() {
  const savedEmail = localStorage.getItem("rememberEmail") || "";

  const [formData, setFormData] = useState({
    email: savedEmail,
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(!!savedEmail);

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const validation = validateLoginForm(formData);

    if (!validation.isValid) {
      setFieldErrors(validation.errors || {});
      return;
    }

    if (rememberMe) {
      localStorage.setItem("rememberEmail", formData.email);
    } else {
      localStorage.removeItem("rememberEmail");
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Clear form
      setFormData({ email: "", password: "" });

      // Navigate to home
      setTimeout(() => navigate("/"), 500);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Login</h1>

          {/* Error message */}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Enter your email"
                disabled={isLoading}
                className={fieldErrors.email ? "input-error" : ""}
                required
              />
              {fieldErrors.email && (
                <span className="field-error">{fieldErrors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className={fieldErrors.password ? "input-error" : ""}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? "👁️ Hide" : "👁️ Show"}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading && <span className="spinner-mini"></span>}
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="link">
                Register now
              </Link>
            </p>
            <Link to="/forgot-password" className="link">
              Forgot password?
            </Link>
          </div>

          <div className="demo-info">
            <p>
              <strong>Demo:</strong> demo@example.com / 123456
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
