import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { onlyLettersNumbersSpace } from "../utils/regex";
import { doc, setDoc } from "firebase/firestore";
import firebase from "../firebase";

const EditListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await setDoc(
        doc(firebase.db, "lists", user?.uid || ""),
        {
          name: formData.name,
          description: formData.description,
        },
        { merge: true }
      );
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="create-list-page">
      {error && <div className="error-message">{error}</div>}
      <form className="form-model create-list-form" onSubmit={handleEdit}>
        <div className="form-group">
          <label htmlFor="name">List Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => {
              setError("");
              const value = e.target.value.replace(onlyLettersNumbersSpace, "");
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
              const value = e.target.value.replace(onlyLettersNumbersSpace, "");
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

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader size="small" color="#ffffff" />
                Editing List...
              </>
            ) : (
              "Edit List"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListPage;
