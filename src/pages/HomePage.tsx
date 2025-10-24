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
import Dropdown from "../components/dropdown/Dropdown";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const monthNames = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const status = ["All", "New", "Ongoing", "Done"];
  const currentMonth = new Date().getMonth() + 1;
  const [lists, setLists] = useState<ListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("All");
  const [searchQueryMonth, setSearchQueryMonth] = useState(
    monthNames[currentMonth]
  );
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

  const handleChangeFilterStatus = (selectedStatus: string) => {
    setSearchQuery(selectedStatus);
  };

  const handleChangeFilterMonth = (selectedMonth: string) => {
    setSearchQueryMonth(selectedMonth);
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
        <h1>Grocery Lists</h1>
        <div className="page-header-right">
          <div className="filter-box">
            <Dropdown
              valueBtn={searchQueryMonth || "Month"}
              listItems={monthNames}
              onChange={handleChangeFilterMonth}
            />
            <Dropdown
              valueBtn={searchQuery || "Status"}
              listItems={status}
              onChange={handleChangeFilterStatus}
            />
          </div>
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
                (searchQuery === "Done" &&
                  list.completedItems === list.items.length) ||
                (searchQuery === "Ongoing" &&
                  list.completedItems !== list.items.length &&
                  list.completedItems !== 0) ||
                (searchQuery === "New" && list.completedItems === 0)
            )
            .map((list) => (
              <div
                key={list.id}
                className="list-card"
                onClick={() => navigate(`/list/${list.id}`)}
              >
                <div className="list-col">
                  <h2 className="title-h2">{list.name}</h2>
                  <p>Created on {list.createdAt.toLocaleDateString()}</p>
                </div>
                <div className="list-col">
                  <div className="list-stats">
                    {list.completedItems === list.items.length ? (
                      <span className="status completed">Done</span>
                    ) : list.completedItems === 0 ? (
                      <span className="status new">New</span>
                    ) : (
                      <span className="status ongoing">On Going </span>
                    )}
                  </div>
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
