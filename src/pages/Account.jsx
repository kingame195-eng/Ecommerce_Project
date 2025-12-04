import { useState } from "react";
import { FiEdit2, FiLock, FiLogOut } from "react-icons/fi";
import "./Account.css";

function Account() {
  const [userInfo, setUserInfo] = useState({
    name: "Nguyen Van A",
    email: "nguyenvana@email.com",
    phone: "0912345678",
    address: "123 Le Loi Street, Ho Chi Minh City",
    avatar: "https://via.placeholder.com/150",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(userInfo);
  const [activeTab, setActiveTab] = useState("profile");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSaveProfile = () => {
    setUserInfo(formData);
    setIsEditMode(false);
    alert("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setFormData(userInfo);
    setIsEditMode(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill in all required information");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password does not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    // Reset form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    alert("Password changed successfully!");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      alert("Logged out!");
      // Redirect to home or login page
    }
  };

  return (
    <main className="account-page">
      <div className="container">
        <h1>My Account</h1>
        <div className="account-layout">
          <aside className="account-sidebar">
            <div className="user-avatar">
              <img src={userInfo.avatar} alt={userInfo.name} />
              <h3>{userInfo.name}</h3>
              <p>{userInfo.email}</p>
            </div>
            <nav className="account-nav">
              <button
                className={`nav-link ${
                  activeTab === "profile" ? "active" : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <FiEdit2 /> Profile
              </button>
              <button
                className={`nav-link ${
                  activeTab === "security" ? "active" : ""
                }`}
                onClick={() => setActiveTab("security")}
              >
                <FiLock /> Password
              </button>
              <button className="nav-link logout" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </nav>
          </aside>

          <section className="account-content">
            {activeTab === "profile" && (
              <div className="profile-section">
                <h2>Profile Information</h2>
                {!isEditMode ? (
                  <div className="profile-view">
                    <div className="info-row">
                      <label>Name:</label>
                      <span>{userInfo.name}</span>
                    </div>
                    <div className="info-row">
                      <label>Email:</label>
                      <span>{userInfo.email}</span>
                    </div>
                    <div className="info-row">
                      <label>Phone Number:</label>
                      <span>{userInfo.phone}</span>
                    </div>
                    <div className="info-row">
                      <label>Address:</label>
                      <span>{userInfo.address}</span>
                    </div>

                    <button
                      onClick={() => setIsEditMode(true)}
                      className="btn-edit-profile"
                    >
                      <FiEdit2 /> Edit
                    </button>
                  </div>
                ) : (
                  <form className="profile-form">
                    <div className="form-group">
                      <label htmlFor="name">Name:</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number:</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">Address:</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        className="btn-save"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div className="security-section">
                <h2>Change Password</h2>

                <form onSubmit={handleChangePassword} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password:</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <button type="submit" className="btn-change-password">
                    Change Password
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Account;
