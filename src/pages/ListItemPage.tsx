import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Item } from "../models/Item";
import firebase from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ListItemPage() {
  const { user } = useAuth();
  const [listItem, setListItem] = useState<Item[]>([] as Item[]);
  const [searchValue, setSearchValue] = useState<string>("");
  const getItems = async () => {
    try {
      const itemsCollection = collection(firebase.db, "items");
      const itemsSnapshot = await getDocs(itemsCollection);
      const items = itemsSnapshot.docs.map((doc) => doc.data() as Item);
      setListItem(items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const simulateAutoCompleteResearch = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const value = e.target.value;
    if (value === "") getItems();
    setSearchValue(value);
    const filteredItems = listItem.filter((item) =>
      item.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setListItem(filteredItems);
  };

  useEffect(() => {
    getItems();
  }, [user]);
  return (
    <div className="gabarit-page">
      <div className="gabarit-header">
        <div className="gabarit-top">
          <h1 className="title-h1">Items</h1>
          <Link to="/add-item" className="btn btn-secondary">
            <span>Add Item</span> <i className="icon-plus"></i>
          </Link>
        </div>
        <div className="gabarit-search">
          <input
            type="search"
            name="search-item"
            id="search-item"
            placeholder="Search items"
            value={searchValue}
            onChange={simulateAutoCompleteResearch}
          />
        </div>
      </div>
      <div className="gabarit-content">
        <h2 className="title-h2">My items</h2>
        <div className="gabarit-list">
          {listItem.length === 0 && (
            <p className="gabarit-null">No items found</p>
          )}
          {listItem
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => (
              <div className="gabarit-item" key={item.id}>
                <figure className="gabarit-item-img">
                  <img src={item.image} alt={item.name} title={item.name} />
                </figure>
                <div className="gabarit-item-info">
                  <h3 className="title-h3">{item.name}</h3>
                  <p className="gabarit-category">{item.category}</p>
                  <p className="gabarit-unit">Unit : {item.unit}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
