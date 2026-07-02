import { useLocation, useNavigate } from "react-router-dom";
import "../styles/result.css";

function Result() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        score,
        totalQuestions,
        answers
    } = location.state;

    const correctAnswers = answers.filter(
        answer => answer.is_correct
    ).length;

    const wrongAnswers = totalQuestions - correctAnswers;

    const accuracy = Math.round(
        (correctAnswers / totalQuestions) * 100
    );

    const clearQuiz = () => {

        localStorage.removeItem("quiz_answers");
        localStorage.removeItem("quiz_session");
        localStorage.removeItem("topic_id");

    };

    return (

        <div className="page-container fade-in">

            <div className="card result-card">

                <div className="result-badge">
                    🎯 Practice Complete
                </div>

                <h1 className="page-title">
                    Quiz Finished
                </h1>

                <div className="score-box">

                    <p>Score</p>

                    <h2>{score}</h2>

                </div>

                <div className="result-grid">

                    <div className="result-item">

                        <span>✅ Correct</span>

                        <strong>{correctAnswers}</strong>

                    </div>

                    <div className="result-item">

                        <span>❌ Wrong</span>

                        <strong>{wrongAnswers}</strong>

                    </div>

                    <div className="result-item">

                        <span>📊 Accuracy</span>

                        <strong>{accuracy}%</strong>

                    </div>

                    <div className="result-item">

                        <span>❓ Questions</span>

                        <strong>{totalQuestions}</strong>

                    </div>

                </div>

                <button
                    className="btn"
                    onClick={() =>
                        navigate("/review", {
                            state: {
                                answers
                            }
                        })
                    }
                >
                    Review Answers
                </button>

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

    );

}

export default Result;