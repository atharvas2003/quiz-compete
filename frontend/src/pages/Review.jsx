import { useLocation, useNavigate } from "react-router-dom";
import "../styles/review.css";

function Review() {

    const location = useLocation();
    const navigate = useNavigate();

    const answers = location.state?.answers || [];

    function clearQuiz() {

        localStorage.removeItem("quiz_answers");
        localStorage.removeItem("quiz_session");
        localStorage.removeItem("topic_id");

    }

    return (

        <div className="page-container fade-in">

            <div className="review-wrapper">

                <div className="review-header">

                    <div className="badge">
                        📖 Answer Review
                    </div>

                    <h1 className="page-title">
                        Review Your Match
                    </h1>

                    <p>
                        Learn from every question and improve your performance.
                    </p>

                </div>

                {answers.map((answer, index) => (

                    <div
                        key={index}
                        className={`card review-card ${
                            answer.is_correct
                                ? "correct"
                                : "wrong"
                        }`}
                    >

                        <div className="review-question">

                            <span className="question-number">
                                Question {index + 1}
                            </span>

                            <h2>
                                {answer.question_text}
                            </h2>

                        </div>

                        <div className="review-section">

                            <small>Your Answer</small>

                            <p>
                                {answer.user_answer || "No Answer"}
                            </p>

                        </div>

                        <div className="review-status">

                            {answer.is_correct ? (
                                <span className="status correct-status">
                                    ✅ Correct
                                </span>
                            ) : (
                                <span className="status wrong-status">
                                    ❌ Incorrect
                                </span>
                            )}

                        </div>

                        {!answer.is_correct && (

                            <div className="review-section">

                                <small>Correct Answer</small>

                                <p className="correct-answer">
                                    {answer.correct_answer}
                                </p>

                            </div>

                        )}

                    </div>

                ))}

                <div className="review-actions">

                    <button
                        className="btn"
                        onClick={() => {

                            clearQuiz();

                            navigate("/topics");

                        }}
                    >
                        Play Again
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={() => {

                            clearQuiz();

                            navigate("/dashboard");

                        }}
                    >
                        Dashboard
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Review;