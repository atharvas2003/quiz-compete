import { useState, useEffect } from "react";
import api from "../services/api";

function AdminDashboard() {

    const [topics, setTopics] = useState([]);
    const [subtopics, setSubtopics] = useState([]);

    const [topicId, setTopicId] = useState("");
    const [subtopicId, setSubtopicId] = useState("");

    const [questionText, setQuestionText] = useState("");
    const [difficulty, setDifficulty] = useState("easy");

    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");

    const [csvFile, setCsvFile] = useState(null);

    const [correctOption, setCorrectOption] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getTopics();
    }, []);

    const getTopics = async () => {

        try {

            const response = await api.get("/topics");

            setTopics(response.data);

            if (response.data.length > 0) {

                const firstTopic = response.data[0];

                setTopicId(firstTopic.id);

                getSubtopics(firstTopic.id);
            }

        } catch (err) {

            console.log(err);

        }
    };

    const getSubtopics = async (topicId) => {

        try {

            const response = await api.get(
                `/subtopics/topic/${topicId}`
            );

            setSubtopics(response.data);

            if (response.data.length > 0) {

                setSubtopicId(
                    response.data[0].id
                );
            }

        } catch (err) {

            console.log(err);

        }
    };

    const resetForm = () => {

        setQuestionText("");

        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");

        setCorrectOption("");

        setDifficulty("easy");
    };

    const handleSubmit = async () => {

        try {

            if (
                !questionText ||
                !option1 ||
                !option2 ||
                !option3 ||
                !option4 ||
                !correctOption
            ) {
                alert("Fill all fields");
                return;
            }

            setLoading(true);

            const questionResponse =
                await api.post(
                    "/questions",
                    {
                        question_text:
                            questionText,

                        difficulty:
                            difficulty,

                        topic_id:
                            Number(topicId),

                        subtopic_id:
                            Number(subtopicId)
                    }
                );

            const questionId =
                questionResponse.data.id;

            const options = [
                option1,
                option2,
                option3,
                option4
            ];

            for (const option of options) {

                await api.post(
                    "/options",
                    {
                        option_text: option,

                        is_correct:
                            option === correctOption,

                        question_id:
                            questionId
                    }
                );
            }

            alert(
                "Question Added Successfully"
            );

            resetForm();

        } catch (err) {

            console.log(err);

            alert(
                "Failed To Add Question"
            );

        } finally {

            setLoading(false);

        }
    };

    const uploadCSV = async () => {

    if (!csvFile) {
        alert("Select a CSV file first");
        return;
    }

    const formData = new FormData();

    formData.append(
        "file",
        csvFile
    );

    try {

        const response = await api.post(
            "/admin/upload-csv",
            formData
        );

        alert(response.data.message);

    } catch (err) {

        console.log(err);

        alert("Upload Failed");

    }
};

    return (

        <div>

            <h1>Admin Dashboard</h1>

            <h3>Topic</h3>

            <select
                value={topicId}
                onChange={(e) => {

                    setTopicId(
                        e.target.value
                    );

                    getSubtopics(
                        e.target.value
                    );
                }}
            >

                {topics.map((topic) => (

                    <option
                        key={topic.id}
                        value={topic.id}
                    >
                        {topic.name}
                    </option>

                ))}

            </select>

            <br /><br />

            <h3>Subtopic</h3>

            <select
                value={subtopicId}
                onChange={(e) =>
                    setSubtopicId(
                        e.target.value
                    )
                }
            >

                {subtopics.map(
                    (subtopic) => (

                        <option
                            key={
                                subtopic.id
                            }
                            value={
                                subtopic.id
                            }
                        >
                            {subtopic.name}
                        </option>

                    )
                )}

            </select>

            <br /><br />

            <h3>Difficulty</h3>

            <select
                value={difficulty}
                onChange={(e) =>
                    setDifficulty(
                        e.target.value
                    )
                }
            >
                <option value="easy">
                    Easy
                </option>

                <option value="medium">
                    Medium
                </option>

                <option value="hard">
                    Hard
                </option>

            </select>

            <br /><br />

            <textarea
                rows="4"
                cols="50"
                placeholder="Question"
                value={questionText}
                onChange={(e) =>
                    setQuestionText(
                        e.target.value
                    )
                }
            />

            <br /><br />

            <input
                placeholder="Option 1"
                value={option1}
                onChange={(e) =>
                    setOption1(
                        e.target.value
                    )
                }
            />

            <br />

            <input
                placeholder="Option 2"
                value={option2}
                onChange={(e) =>
                    setOption2(
                        e.target.value
                    )
                }
            />

            <br />

            <input
                placeholder="Option 3"
                value={option3}
                onChange={(e) =>
                    setOption3(
                        e.target.value
                    )
                }
            />

            <br />

            <input
                placeholder="Option 4"
                value={option4}
                onChange={(e) =>
                    setOption4(
                        e.target.value
                    )
                }
            />

            <br /><br />

            <input
                placeholder="Correct Option"
                value={correctOption}
                onChange={(e) =>
                    setCorrectOption(
                        e.target.value
                    )
                }
            />

            <br /><br />

            <button
                disabled={loading}
                onClick={handleSubmit}
            >
                {
                    loading
                        ? "Saving..."
                        : "Add Question"
                }
            </button>

            <hr />

        <h2>Bulk Upload Questions</h2>

        <input
            type="file"
            accept=".csv"
            onChange={(e) =>
                setCsvFile(
                    e.target.files[0]
                )
            }
        />

        <br />
        <br />

        <button onClick={uploadCSV}>
            Upload CSV
        </button>

        </div>
    );
}

export default AdminDashboard;