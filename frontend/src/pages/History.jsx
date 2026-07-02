import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/history.css";

function History() {

    const [matches, setMatches] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadHistory();
    }, []);

    async function loadHistory() {

        try {

            const response = await api.get("/quiz/history");

            setMatches(response.data);

        } catch (err) {

            console.log(err);

        }

    }

    return (

        <div className="page-container fade-in">

            <div className="history-wrapper">

                <div className="history-header">

                    <div className="badge">
                        📚 Match History
                    </div>

                    <h1 className="page-title">
                        Practice Matches
                    </h1>

                    <p>
                        Review your previous practice attempts and track your progress.
                    </p>

                </div>

                {matches.length === 0 ? (

                    <div className="card history-empty">

                        <h2>No Matches Yet</h2>

                        <p>
                            Complete your first practice quiz to see your history.
                        </p>

                    </div>

                ) : (

                    <div className="history-grid">

                        {matches.map((match) => {

                            const accuracy = Math.round(
                                (match.correct_answers /
                                    match.total_questions) * 100
                            );

                            return (

                                <div
                                    key={match.session_id}
                                    className="card history-card"
                                >

                                    <div className="history-top">

                                        <h2>
                                            🎯 Practice Match
                                        </h2>

                                        <span>
                                            #{match.session_id}
                                        </span>

                                    </div>

                                    <div className="history-stats">

                                        <div>

                                            <small>Score</small>

                                            <strong>{match.score}</strong>

                                        </div>

                                        <div>

                                            <small>Accuracy</small>

                                            <strong>{accuracy}%</strong>

                                        </div>

                                        <div>

                                            <small>Correct</small>

                                            <strong>{match.correct_answers}</strong>

                                        </div>

                                        <div>

                                            <small>Wrong</small>

                                            <strong>{match.wrong_answers}</strong>

                                        </div>

                                    </div>

                                    <button
                                        className="btn"
                                        onClick={() =>
                                            navigate(`/history/${match.session_id}`)
                                        }
                                    >
                                        Review Match →
                                    </button>

                                </div>

                            );

                        })}

                    </div>

                )}

            </div>

        </div>

    );

}

export default History;