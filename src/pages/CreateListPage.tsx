import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";
import Loader from "../components/loader/Loader";
import { ListItem } from "../models/ListItem";
import { onlyLetters, onlyLettersNumbersSpace } from "../utils/regex";
import { scrollToTop } from "../utils/common";

const CreateListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [items, setItems] = useState<ListItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addItem = () => {
    const newItem: ListItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unit: "",
      notes: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof ListItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < items.length) {
      [newItems[index], newItems[newIndex]] = [
        newItems[newIndex],
        newItems[index],
      ];
      setItems(newItems);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      //formdata Name
      if (!formData.name.trim()) {
        setError("Please enter a name for your list");
        scrollToTop();
        setLoading(false);
        return;
      }
      // Validate items
      if (items.length === 0) {
        setError("Please add at least one item to your list");
        scrollToTop();
        setLoading(false);
        return;
      }

      // Validate item names
      const invalidItems = items.filter((item) => !item.name.trim());
      if (invalidItems.length > 0) {
        setError("All items must have a name");
        scrollToTop();
        setLoading(false);
        return;
      }

      // Create new list document
      const listRef = await addDoc(collection(firebase.db, "lists"), {
        name: formData.name,
        description: formData.description,
        userId: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        items: items.map((item) => ({
          name: item.name.trim(),
          quantity: item.quantity,
          unit: item.unit.trim(),
          notes: item.notes.trim(),
          completed: false,
        })),
        totalItems: items.length,
        completedItems: 0,
      });

      // Update user's totalLists count
      const userRef = doc(firebase.db, "users", user!.uid);
      await updateDoc(userRef, {
        totalLists: increment(1),
      });

      // Navigate to the new list
      navigate(`/list/${listRef.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create list");
      scrollToTop();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gabarit-page gabarit-add">
      <div className="gabarit-header">
        <div className="gabarit-top">
          <Link to="/items" className="btn btn-nav">
            <i className="icon-clear"></i>
            <span>Return to list</span>
          </Link>
          <h1 className="title-h1">New List</h1>
        </div>
      </div>
      <div className="gabarit-content">
        {error && <div className="error-message">{error}</div>}
        <form className="gabarit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">List Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => {
                setError("");
                const value = e.target.value.replace(
                  onlyLettersNumbersSpace,
                  ""
                );
                handleChange({
                  ...e,
                  target: {
                    ...e.target,
                    value,
                    name: e.target.name,
                  },
                });
              }}
              placeholder="Fill in the name of the list"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => {
                const value = e.target.value.replace(
                  onlyLettersNumbersSpace,
                  ""
                );
                handleChange({
                  ...e,
                  target: {
                    ...e.target,
                    value,
                    name: e.target.name,
                  },
                });
              }}
              placeholder="Fill in the description of the list"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="create-list-page">
            <div className="items-section">
              <div className="section-header">
                <h3 className="title-h3">Items</h3>
                <button
                  type="button"
                  className="btn btn-small btn-dashed"
                  onClick={addItem}
                  disabled={loading}
                >
                  <i className="icon-plus-circle"></i>
                  <span>Add Item from Repository</span>
                </button>
              </div>

              <div className="items-container">
                {items.map((item, index) => (
                  <div key={item.id} className="item-card">
                    <div className="item-header">
                      <div className="item-controls">
                        <button
                          type="button"
                          className="btn btn-icon"
                          onClick={() => moveItem(index, "up")}
                          disabled={index === 0 || loading}
                        >
                          <i className="icon-arrow-up"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-icon"
                          onClick={() => moveItem(index, "down")}
                          disabled={index === items.length - 1 || loading}
                        >
                          <i className="icon-arrow-down"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-icon btn-danger"
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
                        <label htmlFor={`item-name-${item.id}`}>
                          Item Name
                        </label>
                        <input
                          type="text"
                          id={`item-name-${item.id}`}
                          value={item.name}
                          onChange={(e) => {
                            setError("");
                            const alphanumericValue = e.target.value.replace(
                              onlyLettersNumbersSpace,
                              ""
                            );
                            updateItem(item.id, "name", alphanumericValue);
                          }}
                          placeholder="Write the name of the item (letters and numbers only)"
                          disabled={loading}
                        />
                      </div>

                      <div className="item-quantity">
                        <div className="form-group">
                          <label htmlFor={`item-quantity-${item.id}`}>
                            Quantity
                          </label>
                          <div className="quantity-controls">
                            <input
                              type="number"
                              id={`item-quantity-${item.id}`}
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "quantity",
                                  parseInt(e.target.value) || 1
                                )
                              }
                              min="1"
                              required
                              disabled={loading}
                            />
                            <button
                              type="button"
                              className="btn btn-icon"
                              onClick={() =>
                                updateItem(
                                  item.id,
                                  "quantity",
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={loading || item.quantity <= 1}
                            >
                              <i className="icon-minus"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-icon"
                              onClick={() =>
                                updateItem(
                                  item.id,
                                  "quantity",
                                  item.quantity + 1
                                )
                              }
                              disabled={loading}
                            >
                              <i className="icon-plus"></i>
                            </button>
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor={`item-unit-${item.id}`}>Unit</label>
                          <input
                            type="text"
                            id={`item-unit-${item.id}`}
                            value={item.unit}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                onlyLetters,
                                ""
                              );
                              updateItem(item.id, "unit", value);
                            }}
                            placeholder="e.g., kg, pcs, l, ml, etc."
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor={`item-notes-${item.id}`}>
                          Notes (Optional)
                        </label>
                        <input
                          type="text"
                          id={`item-notes-${item.id}`}
                          value={item.notes}
                          onChange={(e) => {
                            const value = e.target.value.replace(
                              onlyLettersNumbersSpace,
                              ""
                            );
                            updateItem(item.id, "notes", value);
                          }}
                          placeholder="Additional details"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group form-group-button">
            <button
              className="btn btn-cancel"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || items.length === 0}
            >
              {loading ? (
                <>
                  <Loader size="small" color="#ffffff" />
                  Creating List...
                </>
              ) : (
                "Save List"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListPage;
