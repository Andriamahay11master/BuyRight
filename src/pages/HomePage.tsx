import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import firebase from '../firebase';
import { useEffect, useState } from 'react';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="home-page">
      <h1>My Shopping Lists</h1>
      <div className="lists-container">
        {/* Shopping lists will be displayed here */}
        <div className="list-item">
          <div className="list-item-content">
            <div className="list-item-header">
              <h2 className="list-item-title">Grocery List</h2>
              <p className="list-item-description">10 items</p>
            </div>
            <div className="list-item-actions">
              <button className="btn-icon">
                
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 