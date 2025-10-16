import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import Loader from "../components/loader/Loader";
import Modal from "../components/modal/Modal";
import { ListData } from "../models/ListData";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState<ListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("All");
  const [searchQueryMonth, setSearchQueryMonth] = useState("All");
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchLists = async () => {
      try {
        const listsRef = collection(firebase.db, "lists");
        const q = query(
          listsRef,
          where("userId", "==", user.uid),
          orderBy("updatedAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const listsData: ListData[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          listsData.push({
            id: doc.id,
            name: data.name || "",
            description: data.description || "",
            items: (data.items || []).map((item: any, index: number) => ({
              ...item,
              id: index.toString(),
            })),
            totalItems: data.totalItems || 0,
            completedItems: data.completedItems || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        });

        setLists(listsData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch lists");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [user]);

  const handleCreateList = () => {
    navigate("/create");
  };

  const openDeleteModal = (listId: string) => {
    setListToDelete(listId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setListToDelete(null);
  };

  const handleDeleteList = async () => {
    if (!listToDelete || !user) return;

    try {
      const listRef = doc(firebase.db, "lists", listToDelete);
      await deleteDoc(listRef);

      const userRef = doc(firebase.db, "users", user.uid);
      await updateDoc(userRef, {
        totalLists: increment(-1),
      });

      setLists(lists.filter((list) => list.id !== listToDelete));
      closeDeleteModal();
    } catch (err: any) {
      setError(err.message || "Failed to delete list");
    }
  };

  const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleChangeFilterMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchQueryMonth(e.target.value);
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
        <div className="page-header-right">
          <select
            name="month"
            id="month"
            value={searchQueryMonth}
            onChange={handleChangeFilterMonth}
          >
            <option value="All">All</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
          <select
            name="completed"
            id="completed-state"
            value={searchQuery}
            onChange={handleChangeFilter}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Uncompleted">Uncompleted</option>
          </select>
          <button
            onClick={handleCreateList}
            className="btn btn-primary btn-create"
          >
            <i className="icon-plus-circle"></i>
            <span>Create New List</span>
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {lists.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any shopping lists yet.</p>
          <button
            onClick={handleCreateList}
            className="btn btn-primary btn-create"
          >
            <i className="icon-plus-circle"></i>
            <span>Create Your First List</span>
          </button>
        </div>
      ) : (
        <div className="lists-container">
          {lists
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .filter((list) => {
              if (searchQueryMonth === "All") return true;

              const listMonth = list.createdAt.toLocaleString("en-US", {
                month: "long",
              });

              return listMonth.toLowerCase() === searchQueryMonth.toLowerCase();
            })
            .filter(
              (list) =>
                searchQuery === "All" ||
                (searchQuery === "Completed" &&
                  list.completedItems === list.items.length) ||
                (searchQuery === "Uncompleted" &&
                  list.completedItems !== list.items.length)
            )
            .map((list) => (
              <div key={list.id} className="list-card">
                <div className="list-card-header">
                  <div className="list-col">
                    <h2>{list.name}</h2>
                  </div>
                  <div className="list-col">
                    <button
                      onClick={() => navigate(`/edit/${list.id}`)}
                      className="btn btn-icon btn-primary"
                    >
                      <i className="icon-edit"></i>
                    </button>
                    <button
                      onClick={() => openDeleteModal(list.id || "")}
                      className="btn btn-icon btn-danger"
                    >
                      <i className="icon-trash-2"></i>
                    </button>
                  </div>
                </div>

                {list.description && (
                  <p className="list-description">{list.description}</p>
                )}

                <div className="list-stats">
                  <span>Items: {list.totalItems}</span>
                  <span>Completed: {list.completedItems}</span>
                  <span>
                    Progress:{" "}
                    {Math.round((list.completedItems / list.totalItems) * 100)}%
                  </span>
                </div>

                <div className="list-actions">
                  <button
                    onClick={() => navigate(`/list/${list.id}`)}
                    className="btn btn-small btn-primary"
                  >
                    View List
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete List"
        size="small"
      >
        <div className="modal-delete">
          <p>
            Are you sure you want to delete this list? This action cannot be
            undone.
          </p>
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
    </div>
  );
};

export default HomePage;
