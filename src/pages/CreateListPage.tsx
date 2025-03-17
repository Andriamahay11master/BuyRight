import React from 'react';

const CreateListPage: React.FC = () => {
  return (
    <div className="create-list-page">
      <h1>Create New Shopping List</h1>
      <form className="create-list-form">
        <div className="form-group">
          <label htmlFor="listName">List Name</label>
          <input type="text" id="listName" name="listName" required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea id="description" name="description" rows={3} />
        </div>
        <div className="items-section">
          <h2>Add Items</h2>
          <div className="items-container">
            {/* Items will be added here dynamically */}
          </div>
          <button type="button" className="add-item-btn">Add Item</button>
        </div>
        <button type="submit" className="create-list-btn">Create List</button>
      </form>
    </div>
  );
};

export default CreateListPage; 