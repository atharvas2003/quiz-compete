import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/quiz.css";

function Quiz() {

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [score, setScore] = useState(0);

    const [answers, setAnswers] = useState(() => {
        const saved =
            localStorage.getItem("quiz_answers");

        return saved
            ? JSON.parse(saved)
            : [];
    });

    const navigate = useNavigate();

    useEffect(() => {
        
        startQuiz();
    }, []);

    const startQuiz = async () => {

        try {

            const topicId =
                localStorage.getItem("topic_id");

            const sessionResponse =
                await api.post(
                    "/quiz/start",
                    {
                        topic_id: Number(topicId),
                        total_questions: 10
                    }
                );

            setSessionId(
                sessionResponse.data.id
            );

            const response =
                await api.get(
                    `/quiz/random?topic_id=${topicId}&count=10`
                );

            setQuestions(response.data);

        } catch (err) {

            console.log(err);

        }
    };

    const handleSubmit = async () => {

        const currentQuestion =
            questions[currentQuestionIndex];

        if (!selectedOption) {
            alert("Please select an option");
            return;
        }

        try {

            const payload = {
                session_id: sessionId,
                question_id: currentQuestion.id,
                option_id: selectedOption.id
            };

            await api.post(
                "/quiz/submit",
                payload
            );

            const updatedAnswers = [
                ...answers,
                {
                    question_id:
                        currentQuestion.id,

                    question_text:
                        currentQuestion.question_text,

                    user_answer:
                        selectedOption.option_text,

                    correct_answer:
                        currentQuestion.options
                            .find(
                                option =>
                                    option.is_correct
                            )
                            .option_text,

                    is_correct:
                        selectedOption.is_correct
                }
            ];

            setAnswers(updatedAnswers);

            localStorage.setItem(
                "quiz_answers",
                JSON.stringify(updatedAnswers)
            );

            let newScore = score;

            if (selectedOption.is_correct) {

                newScore += 100;

                setScore(newScore);

            }

            if (
                currentQuestionIndex <
                questions.length - 1
            ) {

                setCurrentQuestionIndex(
                    currentQuestionIndex + 1
                );

                setSelectedOption(null);

                return;
            }

            localStorage.removeItem(
                "quiz_answers"
            );

            await api.post(
                `/quiz/finish/${sessionId}`
);

            navigate(
                "/result",
                {
                    state: {
                        score: newScore,
                        totalQuestions:
                            questions.length,
                        answers:
                            updatedAnswers,
                        sessionId
                    }
                }
            );

        } catch (err) {

            console.log(err);

        }
    };

    if (questions.length === 0) {
        
        return (
        <Layout>
            <div className="page-container">
                <h2>
                    Loading Questions...
                </h2>
            </div>
        </Layout>
        );
    }

    const currentQuestion =
        questions[currentQuestionIndex];

    const progress =
        (
            (
                currentQuestionIndex + 1
            ) /
            questions.length
        ) * 100;

    return (
        <Layout>
        <div className="page-container fade-in">

            <div className="quiz-container">

                <h1 className="page-title">
                    Quiz
                </h1>

                <div className="quiz-progress">

                    <div className="quiz-progress-fill"
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

                <h3 className="quiz-counter">
                    Question {currentQuestionIndex + 1}
                    {" / "}
                    {questions.length}
                </h3>

                <div className="card question-card">

                    <h2>
                        {currentQuestion.question_text}
                    </h2>

                </div>

                <br />

                {currentQuestion.options.map(
                    (option) => (

                    <div
                        key={option.id}
                        onClick={() =>
                            setSelectedOption(option)
                        }
                        style={{
                            background:
                                selectedOption?.id === option.id
                                    ? "#3b82f6"
                                    : "#1a1a1a",

                            border:
                                selectedOption?.id === option.id
                                    ? "quiz-option-selected"
                                    : "quiz-option",

                            borderRadius: "12px",

                            padding: "18px",

                            marginBottom: "12px",

                            cursor: "pointer",

                            transition: "0.2s ease"
                        }}
                    >

                        {option.option_text}

                    </div>

                ))}

                <br />

                <button
                    className="btn quiz-submit"
                    onClick={handleSubmit}
                >
                    Submit Answer
                </button>

                <h3 className="quiz-score">
                    Score: {score}
                </h3>

            </div>

        </div>
        </Layout>

    );
}

export default Quiz;