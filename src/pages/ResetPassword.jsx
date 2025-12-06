import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { validatePassword } from "../utils/validators";
import "./Auth.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetUserPassword, isLoading, error } = useAuth();
  const navigate = useNavigate();

  // Calculate password strength directly from formData
  const passwordStrength = formData.password
    ? validatePassword(formData.password).strength
    : "";

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "strong":
        return "#4caf50";
      case "average":
        return "#ff9800";
      case "weak":
        return "#f44336";
      default:
        return "#ddd";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setFieldErrors((prev) => ({
        ...prev,
        password: passwordValidation.errors.join(". "),
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    const result = await resetUserPassword({
      token,
      newPassword: formData.password,
    });

    if (result.success) {
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Reset Password</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Password input */}
            <div className="form-group">
              <label htmlFor="password">New Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  className={fieldErrors.password ? "input-error" : ""}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? "👁️ Hide" : "👁️ Show"}
                </button>
              </div>

              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar-wrapper">
                    <div
                      className="strength-bar"
                      style={{
                        backgroundColor: getStrengthColor(),
                        width:
                          passwordStrength === "strong"
                            ? "100%"
                            : passwordStrength === "average"
                            ? "66%"
                            : "33%",
                      }}
                    ></div>
                  </div>
                  <span
                    className="strength-text"
                    style={{ color: getStrengthColor() }}
                  >
                    Password: {passwordStrength}
                  </span>
                </div>
              )}

              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            {/* Confirm password input */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  className={fieldErrors.confirmPassword ? "input-error" : ""}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "👁️ Hide" : "👁️ Show"}
                </button>
              </div>

              {fieldErrors.confirmPassword && (
                <span className="field-error">
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit button */}
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading && <span className="spinner-mini"></span>}
              {isLoading ? "Updating..." : "Reset Password"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              <Link to="/login" className="link">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;
