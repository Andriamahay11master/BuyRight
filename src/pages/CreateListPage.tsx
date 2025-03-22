import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import firebase from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/Loader';
import { ListItem } from '../models/ListItem';

const CreateListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [items, setItems] = useState<ListItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = () => {
    const newItem: ListItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unit: '',
      notes: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ListItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < items.length) {
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      setItems(newItems);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate items
      if (items.length === 0) {
        setError('Please add at least one item to your list');
        setLoading(false);
        return;
      }

      // Validate item names
      const invalidItems = items.filter(item => !item.name.trim());
      if (invalidItems.length > 0) {
        setError('All items must have a name');
        setLoading(false);
        return;
      }

      // Create new list document
      const listRef = await addDoc(collection(firebase.db, 'lists'), {
        name: formData.name,
        description: formData.description,
        userId: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        items: items.map(item => ({
          name: item.name.trim(),
          quantity: item.quantity,
          unit: item.unit.trim(),
          notes: item.notes.trim(),
          completed: false
        })),
        totalItems: items.length,
        completedItems: 0
      });

      // Update user's totalLists count
      const userRef = doc(firebase.db, 'users', user!.uid);
      await updateDoc(userRef, {
        totalLists: increment(1)
      });

      // Navigate to the new list
      navigate(`/list/${listRef.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-list-page">
      <h1>Create New List</h1>
      {error && <div className="error-message">{error}</div>}
      <form className="create-list-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">List Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter list name"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter list description"
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="items-section">
          <div className="section-header">
            <h2>Items</h2>
            <button
              type="button"
              className="btn btn-add-item"
              onClick={addItem}
              disabled={loading}
            >
              <i className="icon-plus-circle"></i>
              Add Item
            </button>
          </div>

          <div className="items-container">
            {items.map((item, index) => (
              <div key={item.id} className="item-card">
                <div className="item-header">
                  <div className="item-controls">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0 || loading}
                    >
                      <i className="icon-arrow-up"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === items.length - 1 || loading}
                    >
                      <i className="icon-arrow-down"></i>
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-delete"
                      onClick={() => removeItem(item.id)}
                      disabled={loading}
                    >
                      <i className="icon-trash-2"></i>
                    </button>
                  </div>
                  <span className="item-number">#{index + 1}</span>
                </div>

                <div className="item-fields">
                  <div className="form-group">
                    <label htmlFor={`item-name-${item.id}`}>Item Name</label>
                    <input
                      type="text"
                      id={`item-name-${item.id}`}
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      required
                      placeholder="Enter item name"
                      disabled={loading}
                    />
                  </div>

                  <div className="item-quantity">
                    <div className="form-group">
                      <label htmlFor={`item-quantity-${item.id}`}>Quantity</label>
                      <input
                        type="number"
                        id={`item-quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        min="1"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`item-unit-${item.id}`}>Unit</label>
                      <input
                        type="text"
                        id={`item-unit-${item.id}`}
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                        placeholder="e.g., kg, pcs"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`item-notes-${item.id}`}>Notes (Optional)</label>
                    <input
                      type="text"
                      id={`item-notes-${item.id}`}
                      value={item.notes}
                      onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                      placeholder="Additional details"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={loading || items.length === 0}>
            {loading ? (
              <>
                <Loader size="small" color="#ffffff" />
                Creating List...
              </>
            ) : (
              'Create List'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListPage; 