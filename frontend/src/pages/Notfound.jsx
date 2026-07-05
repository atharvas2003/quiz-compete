import { Link } from "react-router-dom";
import "../styles/notfound.css";

export default function NotFound() {
    return (
        <div className="not-found-page">
            <div className="not-found-card">
                <h1>404</h1>

                <h2>Page Not Found</h2>

                <p>
                    The page you're looking for doesn't exist or may have been
                    moved.
                </p>

                <div className="not-found-actions">
                    <Link to="/" className="primary-btn">
                        Home
                    </Link>

                    <Link to="/quiz" className="secondary-btn">
                        Play Quiz
                    </Link>
                </div>
            </div>
        </div>
    );
}