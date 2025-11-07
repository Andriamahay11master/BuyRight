import { Link, useNavigate } from "react-router-dom";
import category from "../data/category";
import unit from "../data/unit";

import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";

export default function AddItemPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  interface FormDataType {
    name: string;
    category: string;
    unit: string;
    image: File | null;
  }
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    category: category[0],
    unit: unit[0],
    image: null,
  });
  const [error, setError] = useState("");
  const [errorFile, setErrorFile] = useState(false);
  const [alert, setAlert] = useState(false);

  const checkFormatFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    return allowedTypes.includes(file.type);
  };

  // Handler for text, select, etc.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // A separate, dedicated handler for the file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    // Check if files exist
    if (files && files.length > 0) {
      const file = files[0];

      // Validate the file
      if (checkFormatFile(file)) {
        // Valid file
        setFormData((prev) => ({ ...prev, image: file }));
        setErrorFile(false); // Clear any previous error
      } else {
        // Invalid file
        setErrorFile(true);
        setFormData((prev) => ({ ...prev, image: null })); // Clear invalid file from state
        e.target.value = ""; // Reset the input field
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      navigate("/items");
    } catch (err: any) {
      setError(err.message || "Failed to add item");
    }
  };

  return (
    <div className="gabarit-page gabarit-add">
      <div className="gabarit-header">
        <div className="gabarit-top">
          <Link to="/items" className="btn btn-nav">
            <i className="icon-arrow-left"></i>
            <i className="icon-clear"></i>
            <span>Return to list</span>
          </Link>
          <h1 className="title-h1">Add New Item</h1>
        </div>
      </div>
      <div className="gabarit-content">
        <form className="gabarit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Item Name</label>
            <input
              type="text"
              name="name"
              id="name"
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
            <div className="dropzone">
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="dropzone-content">
                {formData.image && (
                  <p className="dropzone-file-value">
                    File <strong>{formData.image?.name}</strong> is selected
                  </p>
                )}
                <p className="dropzone-text">
                  <strong>Upload a file</strong> or drag and drop
                </p>
                <p className="dropzone-format">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {errorFile && <p className="error-message">Invalid file format</p>}

            {formData.image && (
              <div className="preview-img">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="image-preview"
                />
              </div>
            )}
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
