import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";

function Navbar() {

    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const auth = JSON.parse(localStorage.getItem("auth"));

    const isLoggedIn = !!auth?.token;

    const handleLogout = () => {

        localStorage.removeItem("auth");
        localStorage.removeItem("quiz_answers");
        localStorage.removeItem("topic_id");
        localStorage.removeItem("quiz_session");

        navigate("/login", {
            replace: true
        });

    };

    return (

        <nav className="navbar">

            <Link
                className="navbar-logo"
                to="/"
            >
                Prep Arena
            </Link>

            <button
                className="hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </button>

            <div className={`navbar-links ${menuOpen ? "active" : ""}`}>

                {isLoggedIn ? (

                    <>

                        <Link to="/dashboard">Dashboard</Link>

                        <Link to="/history">History</Link>

                        <Link to="/profile">Profile</Link>

                        <button
                            className="btn-secondary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </>

                ) : (

                    <>

                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>

                    </>

                )}

            </div>

        </nav>

    );

}

export default Navbar;