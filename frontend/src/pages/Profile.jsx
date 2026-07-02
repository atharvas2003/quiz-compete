import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/profile.css";

function Profile() {

    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {

        try {

            const profile = await api.get("/users/me");
            setUser(profile.data);

            const matches = await api.get("/quiz/history");
            setHistory(matches.data);

        } catch (err) {

            console.log(err);

        }

    }

    if (!user) {

        return (
            <div className="page-container">
                <h2>Loading Profile...</h2>
            </div>
        );

    }

    const matchesPlayed = history.length;

    const correct = history.reduce(
        (sum, match) => sum + match.correct_answers,
        0
    );

    const wrong = history.reduce(
        (sum, match) => sum + match.wrong_answers,
        0
    );

    const questions = history.reduce(
        (sum, match) => sum + match.total_questions,
        0
    );

    const accuracy =
        questions === 0
            ? 0
            : Math.round((correct / questions) * 100);

    return (

        <div className="profile-page fade-in">

            <div className="profile-card">

                <div className="profile-avatar">
                    👤
                </div>

                <h1>{user.username}</h1>

                <span className="profile-badge">
                    🚀 Practice Mode
                </span>

            </div>

            <div className="profile-card">

                <h2>Practice Statistics</h2>

                <div className="profile-grid">

                    <div className="stat-box">
                        <span>Matches</span>
                        <h3>{matchesPlayed}</h3>
                    </div>

                    <div className="stat-box">
                        <span>Questions</span>
                        <h3>{questions}</h3>
                    </div>

                    <div className="stat-box">
                        <span>Correct</span>
                        <h3>{correct}</h3>
                    </div>

                    <div className="stat-box">
                        <span>Wrong</span>
                        <h3>{wrong}</h3>
                    </div>

                    <div className="stat-box">
                        <span>Accuracy</span>
                        <h3>{accuracy}%</h3>
                    </div>

                    <div className="stat-box">
                        <span>Rating</span>
                        <h3>Practice</h3>
                    </div>

                </div>

            </div>

            <div className="profile-card">

                <h2>Multiplayer Rating</h2>

                <p className="coming-soon">

                    Ratings are earned only in Multiplayer Battles.

                </p>

            </div>

        </div>

    );

}

export default Profile;