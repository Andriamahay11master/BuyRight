import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import firebase from '../firebase';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

interface UserData {
  displayName: string;
  email: string;
  createdAt: string;
  totalLists: number;
  sharedLists: number;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    email: ''
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reauthModalOpen, setReauthModalOpen] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const userRef = doc(firebase.db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          setEditForm({ displayName: data.displayName, email: data.email });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (userData) {
      setEditForm({ displayName: userData.displayName, email: userData.email });
    }
    setIsEditing(false);
  };

  const saveProfile = async () => {
    if (!user || !userData) return;

    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: editForm.displayName
      });

      // Update Firestore document
      const userRef = doc(firebase.db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: editForm.displayName,
        email: editForm.email,
        updatedAt: new Date().toISOString()
      });

      setUserData(prev => prev ? { ...prev, displayName: editForm.displayName, email: editForm.email } : null);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const openReauthModal = () => {
    setReauthModalOpen(true);
  };

  const closeReauthModal = () => {
    setReauthModalOpen(false);
    setReauthPassword('');
  };

  const handleDeleteAccount = async () => {
    if (!user || !reauthPassword) return;

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email!, reauthPassword);
      await reauthenticateWithCredential(user, credential);

      // Delete user document from Firestore
      const userRef = doc(firebase.db, 'users', user.uid);
      await deleteDoc(userRef);

      // Delete user account
      await deleteUser(user);

      // Navigate to login page
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
      closeReauthModal();
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader size="large" />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="error-container">
        <div className="error-message">{error || 'Failed to load profile'}</div>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={startEditing} className="btn btn-edit">
              <i className="icon-edit"></i>
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={saveProfile} className="btn btn-save">
                <i className="icon-save"></i>
                <span>Save</span>
              </button>
              <button onClick={cancelEditing} className="btn btn-cancel">
                <i className="icon-clear"></i>
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="profile-field">
            <i className="icon-user"></i>
            <div className="field-content">
              <label>Display Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="displayName"
                  value={editForm.displayName}
                  onChange={handleEditChange}
                  required
                />
              ) : (
                <span>{userData.displayName}</span>
              )}
            </div>
          </div>

          <div className="profile-field">
            <i className="icon-mail"></i>
            <div className="field-content">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                />
              ) : (
                <span>{userData.email}</span>
              )}
            </div>
          </div>
          <div className="profile-field">
            <i className="icon-calendar"></i>
            <div className="field-content">
              <label>Member Since</label>
              <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{userData.totalLists}</span>
            <span className="stat-label">Shopping Lists</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userData.sharedLists}</span>
            <span className="stat-label">Shared Lists</span>
          </div>
        </div>

        <div className="danger-zone">
          <h2>Danger Zone</h2>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button onClick={openDeleteModal} className="btn btn-delete">
            <i className="icon-trash-2"></i>
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Account"
        size="small"
      >
        <div className="delete-confirmation">
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <div className="modal-actions">
            <button onClick={closeDeleteModal} className="btn btn-cancel">
              <span>Cancel</span>
            </button>
            <button onClick={openReauthModal} className="btn btn-delete">
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Reauthentication Modal */}
      <Modal
        isOpen={reauthModalOpen}
        onClose={closeReauthModal}
        title="Confirm Password"
        size="small"
      >
        <div className="reauth-form">
          <p>Please enter your password to confirm account deletion.</p>
          <div className="form-group">
            <input
              type="password"
              value={reauthPassword}
              onChange={(e) => setReauthPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="modal-actions">
            <button onClick={closeReauthModal} className="btn btn-cancel">
              Cancel
            </button>
            <button onClick={handleDeleteAccount} className="btn btn-delete">
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage; 