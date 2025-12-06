import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "./Auth.css";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("pending");
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const doVerify = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      const result = await verifyEmail(token);

      if (result.success) {
        setStatus("success");
        setTimeout(() => navigate("/"), 3000);
      } else {
        setStatus("error");
      }
    };
    doVerify();
  }, [token, verifyEmail, navigate]);

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Email Confirmation</h1>

          {status === "pending" && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
              }}
            >
              <div className="spinner-large"></div>
              <p style={{ color: "#666", marginTop: "1rem" }}>
                Confirming your email...
              </p>
            </div>
          )}

          {status === "success" && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                }}
              >
                ✅
              </div>
              <h2 style={{ color: "#155724", margin: "0 0 1rem" }}>
                Email confirmation successful!
              </h2>
              <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                You will be redirected to the home page in a moment...
              </p>
              <Link to="/" className="link" style={{ display: "inline-block" }}>
                Back to home page
              </Link>
            </div>
          )}

          {status === "error" && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                }}
              >
                ❌
              </div>
              <h2 style={{ color: "#721c24", margin: "0 0 1rem" }}>
                Email confirmation failed!
              </h2>
              <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                The confirmation link is invalid or expired. Please register
                again.
              </p>
              <div className="auth-links">
                <p>
                  <Link to="/register" className="link">
                    Register again
                  </Link>
                </p>
                <p>
                  <Link to="/login" className="link">
                    Back to login
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default VerifyEmail;
