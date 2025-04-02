import { Link } from "react-router-dom";

const WelcomePage: React.FC = () => {
    return (
        <div className="welcome-page">
            <div className="welcome-body">
                <img className="welcome-img" src="/images/logo.png"></img>
                <h1 className="welcome-header">Welcome to BuyRight</h1>
                <p className="welcome-subheader">Your one-stop solution for all your shopping needs.</p>
                <Link to="/login" className="btn btn-primary">Get Started</Link>
            </div>
        </div>
    )
};

export default WelcomePage