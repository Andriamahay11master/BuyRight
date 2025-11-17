import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Item } from "../models/Item";
import firebase from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

function ChoiceItemPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState<string>("");
  const [listItem, setListItem] = useState<Item[]>([] as Item[]);
  const [selectedItemName, setselectedItemName] = useState<string[] | null>([]);

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

  const selectItem = (item: Item) => {
    setselectedItemName((prevSelected) => {
      // Toggle selection
      if (prevSelected === null) {
        return [item.name];
      }
      if (prevSelected.includes(item.name)) {
        return prevSelected.filter((id) => id !== item.name);
      } else {
        return [...prevSelected, item.name];
      }
    });

    // Save the updated list to localStorage if user is logged in
    if (user) {
      if (!selectedItemName) {
        localStorage.setItem("selectedItems", JSON.stringify([item.name]));
        return;
      }
      const updatedSelection = selectedItemName.includes(item.name)
        ? selectedItemName.filter((id) => id !== item.name)
        : [...selectedItemName, item.name];
      localStorage.setItem("selectedItems", JSON.stringify(updatedSelection));
    }
  };

  const addSelectItemsToList = (e: React.FormEvent) => {
    e.preventDefault();

    // Navigate + send selected items
    navigate("/create", {
      state: { selectedItems: selectedItemName },
    });
  };

  useEffect(() => {
    getItems();
  }, [user]);
  return (
    <div className="gabarit-page gabarit-selection">
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
      </div>
      <div className="gabarit-content">
        <form
          className="gabarit-form single-button"
          onSubmit={addSelectItemsToList}
        >
          <div className="gabarit-list gabarit-choice">
            {listItem.length === 0 && (
              <p className="gabarit-null">No items found</p>
            )}
            {listItem
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((item) => (
                <div
                  className={
                    selectedItemName?.includes(item.name)
                      ? "gabarit-item styleImg active"
                      : "gabarit-item styleImg"
                  }
                  key={item.name}
                  onClick={() => selectItem(item)}
                >
                  <input
                    type="checkbox"
                    id={"checkboxItem" + item.name}
                    className="checkbox-item"
                    checked={selectedItemName?.includes(item.name)}
                    readOnly
                  />
                  <figure className="gabarit-item-img">
                    <img src={item.image} alt={item.name} title={item.name} />
                  </figure>
                  <div className="gabarit-item-info">
                    <h3 className="title-h3">{item.name}</h3>
                  </div>
                </div>
              ))}
          </div>
          <div className="form-group form-group-button">
            <button type="submit" className="btn btn-primary">
              Add selected items ({selectedItemName?.length || 0})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ChoiceItemPage;
