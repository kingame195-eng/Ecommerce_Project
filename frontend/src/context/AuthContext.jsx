import { createContext, useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

// Import API function
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Helper function to fetch API
const fetchAPI = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (user && user.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
  }

  return response.json();
};

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const register = async (email, password, fullName) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!email || !password || !fullName) {
        throw new Error("Please fill in all required information");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // ✅ CORRECT: Call Backend API to save user to PostgreSQL
      const response = await fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          confirmPassword: password,
        }),
      });

      // ✅ CORRECT: Save user + token to localStorage
      setUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        token: response.token,
      });

      setSuccessMessage("Registration successful!");
      return { success: true, user: response.user };
    } catch (error) {
      setError(error.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!email || !password) {
        throw new Error("Please fill in all required information");
      }

      // ✅ CORRECT: Call Backend API to authenticate user
      const response = await fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // ✅ CORRECT: Save user + token to localStorage
      setUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        token: response.token,
      });

      setSuccessMessage("Login successful!");
      return { success: true, user: response.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    setSuccessMessage("Logout successful!");
  };

  const updateUser = (userData) => {
    setUser({
      ...user,
      ...userData,
    });
  };

  const requestReset = async (email) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!email) {
        throw new Error("Please enter email");
      }

      const response = await fetchAPI("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setSuccessMessage(
        response.message || "Password reset email has been sent. Please check your inbox."
      );
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!data.token || !data.newPassword) {
        throw new Error("Invalid data");
      }

      const response = await fetchAPI("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token: data.token,
          newPassword: data.newPassword,
          confirmPassword: data.newPassword,
        }),
      });

      setSuccessMessage(response.message || "Password has been changed successfully!");
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error("Invalid verification token");
      }

      const response = await fetchAPI("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      // Update user with verified email status
      if (response.user) {
        setUser({
          ...user,
          ...response.user,
          token: response.accessToken || response.token,
          isEmailVerified: true,
        });
      }

      setSuccessMessage(response.message || "Email verified successfully!");
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  const value = {
    user,
    isLoading,
    error,
    successMessage,
    register,
    login,
    logout,
    updateUser,
    requestReset,
    resetUserPassword,
    verifyEmail,
    isAuthenticated: !!user,
    userRole: user?.role || null,
    isAdmin: user?.role === "admin",
    isSeller: user?.role === "seller",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
