import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-content">
        <div className="profile-info">
          <div className="profile-header">
            <div className="profile-avatar">
              {/* Avatar will go here */}
            </div>
            <div className="profile-name">
              <h2>User Name</h2>
              <p>user@email.com</p>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <h3>Total Lists</h3>
              <p>0</p>
            </div>
            <div className="stat-item">
              <h3>Shared Lists</h3>
              <p>0</p>
            </div>
            <div className="stat-item">
              <h3>Member Since</h3>
              <p>Date will go here</p>
            </div>
          </div>
        </div>
        
        <div className="profile-settings">
          <h2>Settings</h2>
          <form className="settings-form">
            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input type="text" id="displayName" name="displayName" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input type="password" id="newPassword" name="newPassword" />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 