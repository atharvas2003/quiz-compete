import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import "../styles/dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const auth = JSON.parse(localStorage.getItem("auth"));

    const username = auth?.username || "Player";

    useEffect(() => {

        const handleBackButton = () => {

            const leave = window.confirm(
                "Going back will log you out. Continue?"
            );

            if (leave) {

                localStorage.removeItem("auth");

                window.location.href = "/login";

            } else {

                window.history.pushState(
                    null,
                    "",
                    window.location.pathname
                );

            }

        };

        window.history.pushState(
            null,
            "",
            window.location.pathname
        );

        window.addEventListener(
            "popstate",
            handleBackButton
        );

        return () => {

            window.removeEventListener(
                "popstate",
                handleBackButton
            );

        };

    }, []);

    return (

        <Layout>

            <div className="dashboard-container">

                <section className="dashboard-hero">

                    <div className="dashboard-badge">
                        🎯 Welcome Back
                    </div>

                    <h1>
                        Welcome back,
                        <br />
                        {username} 👋
                    </h1>

                    <p>
                        Ready for another battle?
                        Improve your rating and climb the leaderboard.
                    </p>

                    <button
                        className="btn"
                        onClick={() => navigate("/topics")}
                    >
                        Start Battle
                    </button>

                </section>

                <section className="dashboard-rating">

                    <div className="rating-card">

                        <span>
                            Current Rating
                        </span>

                        <h2>
                            1000
                        </h2>

                        <small>
                            Starting Rating
                        </small>

                    </div>

                </section>

                <section className="dashboard-actions">

                    <div
                        className="dashboard-card"
                        onClick={() => navigate("/topics")}
                    >
                        <h2>🎯 Play Quiz</h2>

                        <p>
                            Start a competitive aptitude battle.
                        </p>

                    </div>

                    <div
                        className="dashboard-card"
                        onClick={() => navigate("/history")}
                    >
                        <h2>📜 History</h2>

                        <p>
                            Review your previous matches.
                        </p>

                    </div>

                    <div
                        className="dashboard-card"
                        onClick={() => navigate("/profile")}
                    >
                        <h2>👤 Profile</h2>

                        <p>
                            View your profile and statistics.
                        </p>

                    </div>

                    <div className="dashboard-card disabled">

                        <h2>🏆 Leaderboard</h2>

                        <p>
                            Coming Soon
                        </p>

                    </div>

                </section>

                <section className="dashboard-stats">

                    <h2>Your Statistics</h2>

                    <div className="stats-grid">

                        <div className="stat-card">

                            <h3>Current Rating</h3>

                            <p>1000</p>

                        </div>

                        <div className="stat-card">

                            <h3>Matches</h3>

                            <p>0</p>

                        </div>

                        <div className="stat-card">

                            <h3>Accuracy</h3>

                            <p>--</p>

                        </div>

                        <div className="stat-card">

                            <h3>Highest Score</h3>

                            <p>0</p>

                        </div>

                    </div>

                </section>

                <section className="dashboard-recent">

                    <div className="recent-header">

                        <h2>
                            Recent Battles
                        </h2>

                        <button
                            className="view-all-btn"
                            onClick={() => navigate("/history")}
                        >
                            View All
                        </button>

                    </div>

                    <div className="recent-card">

                        <p>
                            You haven't played any battles yet.
                        </p>

                        <button
                            className="btn"
                            onClick={() => navigate("/topics")}
                        >
                            Start First Battle
                        </button>

                    </div>

                </section>

            </div>

        </Layout>

    );

}

export default Dashboard;