import { useState } from "react";
import { Link } from "react-router-dom";
import { Item } from "../models/Item";
import firebase from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function ChoiceItemPage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [listItem, setListItem] = useState<Item[]>([] as Item[]);
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
  return (
    <div className="gabarit-page gabarit-add">
      <div className="gabarit-header">
        <div className="gabarit-top">
          <Link to="/create" className="btn btn-nav">
            <i className="icon-arrow-left"></i>
            <span>Return to form list</span>
          </Link>
          <h1 className="title-h1">Add Items</h1>
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

        <div className="gabarit-content">
          <div className="gabarit-list">
            {listItem.length === 0 && (
              <p className="gabarit-null">No items found</p>
            )}
            {listItem
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((item) => (
                <div className="gabarit-item styleImg" key={item.id}>
                  <figure className="gabarit-item-img">
                    <img src={item.image} alt={item.name} title={item.name} />
                  </figure>
                  <div className="gabarit-item-info">
                    <h3 className="title-h3">{item.name}</h3>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChoiceItemPage;
