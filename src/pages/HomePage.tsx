import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import firebase from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/Loader';
import '../styles/pages/_home.scss';
import { ListData } from '../models/ListData';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState<ListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchLists = async () => {
      try {
        const listsRef = collection(firebase.db, 'lists');
        const q = query(
          listsRef,
          where('userId', '==', user.uid),
          orderBy('updatedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const listsData: ListData[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          listsData.push({
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            items: (data.items || []).map((item: any, index: number) => ({
              ...item,
              id: index.toString()
            })),
            totalItems: data.totalItems || 0,
            completedItems: data.completedItems || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          });
        });

        setLists(listsData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch lists');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [user]);

  const handleCreateList = () => {
    navigate('/create');
  };

  const handleDeleteList = async (listId: string) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;

    try {
      const listRef = doc(firebase.db, 'lists', listId);
      await deleteDoc(listRef);

      const userRef = doc(firebase.db, 'users', user!.uid);
      await updateDoc(userRef, {
        totalLists: increment(-1)
      });

      setLists(lists.filter(list => list.id !== listId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete list');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>My Shopping Lists</h1>
        <button onClick={handleCreateList} className="btn-create">
          <FontAwesomeIcon icon={faPlus} />
          Create New List
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {lists.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any shopping lists yet.</p>
          <button onClick={handleCreateList} className="btn-create">
            <FontAwesomeIcon icon={faPlus} />
            Create Your First List
          </button>
        </div>
      ) : (
        <div className="lists-container">
          {lists.map((list) => (
            <div key={list.id} className="list-card">
              <div className="list-card-header">
                <h2>{list.name}</h2>
                <button
                  onClick={() => handleDeleteList(list.id || '')}
                  className="btn-delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>

              {list.description && (
                <p className="list-description">{list.description}</p>
              )}

              <div className="list-stats">
                <span>Items: {list.totalItems}</span>
                <span>Completed: {list.completedItems}</span>
                <span>Progress: {Math.round((list.completedItems / list.totalItems) * 100)}%</span>
              </div>

              <div className="list-actions">
                <button
                  onClick={() => navigate(`/list/${list.id}`)}
                  className="btn-view"
                >
                  View List
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage; 