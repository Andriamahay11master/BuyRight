import { Link } from "react-router-dom";
import category from "../data/category";
import unit from "../data/unit";

export default function AddItemPage() {
  return (
    <div className="gabarit-page">
      <div className="gabarit-top">
        <Link to="/items" className="btn btn-nav">
          <i className="icon-clear"></i>
        </Link>
        <h1 className="title-h1">Add New Item</h1>
      </div>
      <div className="gabarit-content">
        <form>
          <div className="form-group">
            <label htmlFor="item-name">Item Name</label>
            <input type="text" name="item-name" id="item-name" />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select name="category" id="category">
              {category.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <select name="unit" id="unit">
              {unit.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="item-image">Item Image</label>
            <input type="file" name="item-image" id="item-image" />
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
