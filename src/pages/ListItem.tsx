import { Link } from "react-router-dom";

export default function ListItem() {
  return (
    <div className="gabarit-page">
      <div className="gabarit-top">
        <h1 className="title-h1">Items</h1>
        <Link to="/add-item" className="btn btn-primary">
          Add Item <i className="icon-plus"></i>
        </Link>
      </div>
      <div className="gabarit-search">
        <input type="search" name="search-item" id="search-item" />
      </div>
      <div className="gabarit-content">
        <h2 className="title-h2">My items</h2>
        <div className="gabarit-list">
          <div className="list-tem"></div>
        </div>
      </div>
    </div>
  );
}
