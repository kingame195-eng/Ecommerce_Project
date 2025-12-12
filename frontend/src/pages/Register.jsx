import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { validateRegisterForm, validatePassword, sanitizeInput } from "../utils/validators";
import "./Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State cho password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get register function
  const { register, isLoading } = useAuth();

  // Get navigate
  const navigate = useNavigate();

  // Calculate password strength directly from formData
  const passwordStrength = formData.password ? validatePassword(formData.password).strength : "";

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "strong":
        return "#4caf50";
      case "medium":
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

    // Validate form
    const validation = validateRegisterForm(formData);

    if (!validation.isValid) {
      // Hiển thị errors cho từng field
      setFieldErrors(validation.errors || {});
      return;
    }

    const sanitizedData = {
      fullName: sanitizeInput(formData.fullName),
      email: sanitizeInput(formData.email),
      password: formData.password,
    };

    const result = await register(
      sanitizedData.email,
      sanitizedData.password,
      sanitizedData.fullName
    );

    if (result.success) {
      // Clear form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      // setTimeout(() => navigate("/verify-email"), 1500);
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Sign up</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Full name:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                placeholder="Input your fullname: "
                disabled={isLoading}
                className={fieldErrors.fullName ? "input-error" : ""}
                required
              />
              {fieldErrors.fullName && <span className="field-error">{fieldErrors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Nhập email"
                disabled={isLoading}
                className={fieldErrors.email ? "input-error" : ""}
                required
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password: </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Enter password (minimum 6 characters)"
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
                            : passwordStrength === "medium"
                            ? "66%"
                            : "33%",
                      }}
                    ></div>
                  </div>
                  <span className="strength-text" style={{ color: getStrengthColor() }}>
                    Password:: {passwordStrength}
                  </span>
                </div>
              )}
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="Confirm Password:"
                  disabled={isLoading}
                  className={fieldErrors.confirmPassword ? "input-error" : ""}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "👁️ Hide" : "👁️ Show"}
                </button>
              </div>

              {fieldErrors.confirmPassword && (
                <span className="field-error">{fieldErrors.confirmPassword}</span>
              )}
            </div>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading && <span className="spinner-mini"></span>}
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="link">
                Log
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;
