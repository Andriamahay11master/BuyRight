import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp, increment } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import firebase from '../firebase';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { ListItem } from '../models/ListItem';
import { ListData } from '../models/ListData';
import { onlyLetters, onlyLettersNumbersSpace } from '../utils/regex';


const ListDetailPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [list, setList] = useState<ListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ListItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemModalOpen, setDeleteItemModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchList = async () => {
      if (!listId || !user) return;

      try {
        const listRef = doc(firebase.db, 'lists', listId);
        const listDoc = await getDoc(listRef);

        if (!listDoc.exists()) {
          setError('List not found');
          setLoading(false);
          return;
        }

        const listData = listDoc.data();
        if (!listData) {
          setError('List data is empty');
          setLoading(false);
          return;
        }

        setList({
          name: listData.name || '',
          description: listData.description || '',
          items: (listData.items || []).map((item: any, index: number) => ({
            ...item,
            id: index.toString()
          })),
          totalItems: listData.totalItems || 0,
          completedItems: listData.completedItems || 0,
          createdAt: listData.createdAt?.toDate() || new Date(),
          updatedAt: listData.updatedAt?.toDate() || new Date()
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch list');
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [listId, user]);

  const handleItemComplete = async (itemId: string) => {
    if (!list || !listId) return;

    const updatedItems = list.items.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const completedCount = updatedItems.filter(item => item.completed).length;

    try {
      const listRef = doc(firebase.db, 'lists', listId);
      await updateDoc(listRef, {
        items: updatedItems,
        completedItems: completedCount,
        updatedAt: serverTimestamp()
      });

      setList({
        ...list,
        items: updatedItems,
        completedItems: completedCount
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update item');
    }
  };

  const startEditing = (item: ListItem) => {
    setEditingItem(item.id);
    setEditForm(item);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditForm(null);
  };

  const handleEditChange = (field: keyof ListItem, value: string | number) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [field]: value });
  };

  const saveEdit = async () => {
    if (!list || !listId || !editForm) return;

    const updatedItems = list.items.map(item =>
      item.id === editForm.id ? editForm : item
    );

    try {
      const listRef = doc(firebase.db, 'lists', listId);
      await updateDoc(listRef, {
        items: updatedItems,
        updatedAt: serverTimestamp()
      });

      setList({
        ...list,
        items: updatedItems
      });
      setEditingItem(null);
      setEditForm(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update item');
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (!list || !listId) return;

    const newItems = [...list.items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < list.items.length) {
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      
      try {
        const listRef = doc(firebase.db, 'lists', listId);
        await updateDoc(listRef, {
          items: newItems,
          updatedAt: serverTimestamp()
        });

        setList({
          ...list,
          items: newItems
        });
      } catch (err: any) {
        setError(err.message || 'Failed to reorder items');
      }
    }
  };

  const addItem = async () => {
    if (!list || !listId) return;

    const newItem: ListItem = {
      id: list.items.length.toString(),
      name: '',
      quantity: 1,
      unit: '',
      notes: '',
      completed: false
    };

    const updatedItems = [...list.items, newItem];

    try {
      const listRef = doc(firebase.db, 'lists', listId);
      await updateDoc(listRef, {
        items: updatedItems,
        totalItems: updatedItems.length,
        updatedAt: serverTimestamp()
      });

      setList({
        ...list,
        items: updatedItems,
        totalItems: updatedItems.length
      });
      startEditing(newItem);
    } catch (err: any) {
      setError(err.message || 'Failed to add item');
    }
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const openDeleteItemModal = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteItemModalOpen(true);
  };

  const closeDeleteItemModal = () => {
    setDeleteItemModalOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteList = async () => {
    if (!listId || !user) return;

    try {
      const listRef = doc(firebase.db, 'lists', listId);
      await deleteDoc(listRef);

      const userRef = doc(firebase.db, 'users', user.uid);
      await updateDoc(userRef, {
        totalLists: increment(-1)
      });

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to delete list');
    }
  };

  const handleDeleteItem = async () => {
    if (!list || !listId || !itemToDelete) return;

    const updatedItems = list.items.filter(item => item.id !== itemToDelete);
    const completedCount = updatedItems.filter(item => item.completed).length;

    try {
      const listRef = doc(firebase.db, 'lists', listId);
      await updateDoc(listRef, {
        items: updatedItems,
        totalItems: updatedItems.length,
        completedItems: completedCount,
        updatedAt: serverTimestamp()
      });

      setList({
        ...list,
        items: updatedItems,
        totalItems: updatedItems.length,
        completedItems: completedCount
      });
      closeDeleteItemModal();
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader size="large" />
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="error-container">
        <div className="error-message">{error || 'List not found'}</div>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="list-detail-page">
      <div className="list-header">
        <h1>{list.name}</h1>
        <div className="list-actions">
          <button onClick={openDeleteModal} className="btn btn-danger">
            Delete List
          </button>
        </div>
      </div>

      {list.description && (
        <div className="list-description">
          <p>{list.description}</p>
        </div>
      )}

      <div className="list-stats">
        <span>Total Items: {list.totalItems}</span>
        <span>Completed: {list.completedItems}</span>
        <span>Progress: {Math.round((list.completedItems / list.totalItems) * 100)}%</span>
      </div>

      <div className="items-section">
        <div className="section-header">
          <h2>Items</h2>
          <button onClick={addItem} className="btn bnt-small btn-primary">
            <i className="icon-plus-circle"></i>
            <span>Add Item</span>
          </button>
        </div>

        <div className="items-container">
          {list.items.map((item, index) => (
            <div key={item.id} className={`item-card ${item.completed ? 'completed' : ''}`}>
              <div className="item-header">
                <div className="item-controls">
                  <button
                    type="button"
                    className="btn btn-icon"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0 || item.completed}
                  >
                    <i className="icon-arrow-up"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-icon"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === list.items.length - 1 || item.completed}
                  >
                    <i className="icon-arrow-down"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-icon btn-danger"
                    onClick={() => openDeleteItemModal(item.id)}
                    disabled={item.completed}
                  >
                    <i className="icon-trash-2"></i>
                  </button>
                </div>
                <span className="item-number">#{index + 1}</span>
              </div>

              {editingItem === item.id ? (
                <div className="item-fields form-model form-edit">
                  <div className="form-group">
                    <label htmlFor={`edit-name-${item.id}`}>Item Name</label>
                    <input
                      type="text"
                      id={`edit-name-${item.id}`}
                      value={editForm?.name || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(onlyLettersNumbersSpace, '');
                        handleEditChange('name', value);
                      }}
                      required
                    />
                  </div>

                  <div className="item-quantity">
                    <div className="form-group">
                      <label htmlFor={`edit-quantity-${item.id}`}>Quantity</label>
                      <div className="quantity-controls">
                        <input
                          type="number"
                          id={`edit-quantity-${item.id}`}
                          value={editForm?.quantity || 1}
                          onChange={(e) => handleEditChange('quantity', parseInt(e.target.value) || 1)}
                          min="1"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-icon btn-minus"
                          onClick={() => handleEditChange('quantity', Math.max(1, (editForm?.quantity || 1) - 1))}
                        >
                          <i className="icon-minus"></i>
                        </button>
                        <button 
                          type="button"
                          className="btn btn-icon btn-plus"
                          onClick={() => handleEditChange('quantity', (editForm?.quantity || 1) + 1)}
                        >
                          <i className="icon-plus"></i>
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor={`edit-unit-${item.id}`}>Unit</label>
                      <input
                        type="text"
                        id={`edit-unit-${item.id}`}
                        value={editForm?.unit || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(onlyLetters, '');
                          handleEditChange('unit', value);
                        }}
                        placeholder="e.g., kg, pcs, l, ml, etc."
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor={`edit-notes-${item.id}`}>Notes</label>
                    <input
                      type="text"
                      id={`edit-notes-${item.id}`}
                      value={editForm?.notes || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(onlyLettersNumbersSpace, '');
                        handleEditChange('notes', value)
                      }}
                    />
                  </div>

                  <div className="edit-actions">
                    <button onClick={saveEdit} className="btn btn-success">
                      <i className="icon-save"></i>
                      <span>Save</span>
                    </button>
                    <button onClick={cancelEditing} className="btn btn-cancel">
                      <i className="icon-clear"></i>
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="item-content">
                  <div className="item-main">
                    <div className="item-name">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleItemComplete(item.id)}
                      />
                      <span>{item.name}</span>
                    </div>
                    <div className="item-details">
                      <span className="quantity">{item.quantity}</span>
                      {item.unit && <span className="unit">{item.unit}</span>}
                    </div>
                  </div>
                  {item.notes && <div className="item-notes">{item.notes}</div>}
                  <button
                    onClick={() => startEditing(item)}
                    className="btn btn-outline-primary"
                    disabled={item.completed}
                  >
                    <i className="icon-edit"></i>
                    <span>Edit</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* List Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete List"
        size="small"
      >
        <div className="modal-delete">
          <p>Are you sure you want to delete this list? This action cannot be undone.</p>
          <div className="modal-actions">
            <button onClick={closeDeleteModal} className="btn btn-cancel">
              Cancel
            </button>
            <button onClick={handleDeleteList} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Item Delete Modal */}
      <Modal
        isOpen={deleteItemModalOpen}
        onClose={closeDeleteItemModal}
        title="Delete Item"
        size="small"
      >
        <div className="modal-delete">
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="modal-actions">
            <button onClick={closeDeleteItemModal} className="btn btn-cancel">
              Cancel
            </button>
            <button onClick={handleDeleteItem} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListDetailPage; 