import React from 'react';
import { useParams } from 'react-router-dom';

const ListDetailPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();

  return (
    <div className="list-detail-page">
      <div className="list-header">
        <h1>Shopping List</h1>
        <div className="list-actions">
          <button className="share-btn">Share</button>
          <button className="edit-btn">Edit</button>
          <button className="delete-btn">Delete</button>
        </div>
      </div>
      
      <div className="list-content">
        <div className="list-info">
          <p className="list-description">Description will go here</p>
          <p className="list-date">Created on: Date will go here</p>
        </div>
        
        <div className="items-list">
          {/* Shopping items will be listed here */}
          {listId && <div className="item-card">
            <div className="item-card-content">
              <div className="item-card-checkbox">
                <input type="checkbox" id="item-checkbox" />
              </div>
              <div className="item-card-details">
                <div className="item-card-name">
                  <h3>Item Name</h3>
                </div>
                <div className="item-card-quantity">
                  <span className="quantity-label">Quantity:</span>
                  <span className="quantity-value">1</span>
                </div>
              </div>
            </div>
          </div>
          }
        </div>
        
        <div className="add-item-section">
          <button className="add-item-btn">Add New Item</button>
        </div>
      </div>
    </div>
  );
};

export default ListDetailPage; 