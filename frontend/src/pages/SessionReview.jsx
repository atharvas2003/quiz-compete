import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/review.css";

function SessionReview() {

    const [attempts, setAttempts] = useState([]);

    const { sessionId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        loadReview();
    }, []);

    async function loadReview() {

        try {

            const response = await api.get(
                `/quiz/history/${sessionId}`
            );

            setAttempts(response.data);

        } catch (err) {

            console.log(err);

        }

    }

    return (

        <div className="page-container fade-in">

            <div className="review-wrapper">

                <div className="review-header">

                    <div className="badge">
                        📖 Match Review
                    </div>

                    <h1 className="page-title">
                        Practice Match #{sessionId}
                    </h1>

                    <p>
                        Review every question from this practice match.
                    </p>

                </div>

                {attempts.map((attempt, index) => (

                    <div
                        key={index}
                        className={`card review-card ${
                            attempt.is_correct
                                ? "correct"
                                : "wrong"
                        }`}
                    >

                        <div className="review-question">

                            <span className="question-number">
                                Question {index + 1}
                            </span>

                            <h2>
                                {attempt.question_text}
                            </h2>

                        </div>

                        <div className="review-section">

                            <small>Your Answer</small>

                            <p>
                                {attempt.user_answer || "No Answer"}
                            </p>

                        </div>

                        <div className="review-status">

                            {attempt.is_correct ? (

                                <span className="status correct-status">
                                    ✅ Correct
                                </span>

                            ) : (

                                <span className="status wrong-status">
                                    ❌ Incorrect
                                </span>

                            )}

                        </div>

                        {!attempt.is_correct && (

                            <div className="review-section">

                                <small>Correct Answer</small>

                                <p className="correct-answer">
                                    {attempt.correct_answer}
                                </p>

                            </div>

                        )}

                    </div>

                ))}

                <div className="review-actions">

                    <button
                        className="btn-secondary"
                        onClick={() => navigate("/history")}
                    >
                        ← Back to Match History
                    </button>

                </div>

            </div>

        </div>

    );

}

export default SessionReview;