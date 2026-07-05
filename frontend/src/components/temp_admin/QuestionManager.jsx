import { useEffect, useState } from "react";
import api from "../../services/api";
import QuestionForm from "./QuestionForm";

function QuestionManager({
    topics,
    subtopics,
    selectedTopic,
    selectedSubtopic,
    setSelectedTopic,
    setSelectedSubtopic,
}) {

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editingQuestion, setEditingQuestion] = useState(null);

    useEffect(() => {

        if (selectedSubtopic) {

            fetchQuestions();

        }

    }, [selectedSubtopic]);

    const fetchQuestions = async () => {

        try {

            setLoading(true);

            const { data } = await api.get(
                `/questions/subtopic/${selectedSubtopic}`
            );

            setQuestions(data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    const handleEdit = async (questionId) => {

        try {

            const { data } = await api.get(
                `/questions/${questionId}/options`
            );

            setEditingQuestion(data);

        } catch (err) {

            console.error(err);

            alert("Failed to load question.");

        }

    };

    const handleDelete = async (questionId) => {

        const confirmed = window.confirm(
            "Delete this question?"
        );

        if (!confirmed) return;

        try {

            await api.delete(
                `/questions/${questionId}`
            );

            if (
                editingQuestion &&
                editingQuestion.id === questionId
            ) {

                setEditingQuestion(null);

            }

            fetchQuestions();

        } catch (err) {

            console.error(err);

            alert("Delete failed.");

        }

    };

    return (

        <section className="card admin-section">

            <div className="card-header">

                <h2>Question Manager</h2>

            </div>

            <div className="card-body">

                <QuestionForm

                    topics={topics}
                    subtopics={subtopics}

                    selectedTopic={selectedTopic}
                    selectedSubtopic={selectedSubtopic}

                    setSelectedTopic={setSelectedTopic}
                    setSelectedSubtopic={setSelectedSubtopic}

                    editingQuestion={editingQuestion}
                    setEditingQuestion={setEditingQuestion}

                    refreshQuestions={fetchQuestions}

                />

                <hr />

                <h3>Existing Questions</h3>

                {

                    loading

                    ?

                    <p>Loading...</p>

                    :

                    questions.length === 0

                    ?

                    <p>No questions found.</p>

                    :

                    questions.map((question) => (

                        <div
                            key={question.id}
                            className="admin-question-card"
                        >

                            <h4>

                                {question.question_text}

                            </h4>

                            <p>

                                Difficulty :

                                {" "}

                                <strong>

                                    {question.difficulty}

                                </strong>

                            </p>

                            <div
                                className="admin-actions"
                            >

                                <button
                                    className="btn-secondary btn-sm"
                                    onClick={() =>
                                        handleEdit(
                                            question.id
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-sm"
                                    onClick={() =>
                                        handleDelete(
                                            question.id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default QuestionManager;