import { Link } from "react-router-dom";

function ChoiceItemPage() {
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
      </div>
    </div>
  );
}
export default ChoiceItemPage;
