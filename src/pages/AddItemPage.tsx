import { Link } from "react-router-dom";
import category from "../data/category";
import unit from "../data/unit";

import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";

export default function AddItemPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [alert, setAlert] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Upload image to Cloudinary
      let imageUrl = "";

      // 1️⃣ Upload to Cloudinary
      if (formData.image) {
        const data = new FormData();
        data.append("file", formData.image);
        data.append("upload_preset", "BuyRight_items"); // replace with your preset name

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dcctxqmgj/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );
        const file = await res.json();
        imageUrl = file.secure_url;
      }

      // Add item to Firestore
      await addDoc(collection(firebase.db, "items"), {
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        image: imageUrl,
        userId: user?.uid,
        createdAt: new Date(),
      });

      setAlert(true);
      setFormData({
        name: "",
        category: "",
        unit: "",
        image: null,
      });
    } catch (err: any) {
      setError(err.message || "Failed to add item");
    }
  };

  return (
    <div className="gabarit-page">
      <div className="gabarit-top">
        <Link to="/items" className="btn btn-nav">
          <i className="icon-clear"></i>
        </Link>
        <h1 className="title-h1">Add New Item</h1>
      </div>
      <div className="gabarit-content">
        <form className="add-item-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="item-name">Item Name</label>
            <input
              type="text"
              name="item-name"
              id="item-name"
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              name="category"
              id="category"
              onChange={handleChange}
              value={formData.category}
            >
              {category.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <select
              name="unit"
              id="unit"
              onChange={handleChange}
              value={formData.unit}
            >
              {unit.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="item-image">Item Image</label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <div className="form-group form-group-button">
            <button type="reset" className="btn btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
