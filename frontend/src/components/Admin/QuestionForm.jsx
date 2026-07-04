import { useState } from "react";
import api from "../../services/api";

function QuestionForm({
    topics,
    subtopics,
    selectedTopic,
    selectedSubtopic,
    setSelectedTopic,
    setSelectedSubtopic,
}) {

    const [questionText, setQuestionText] = useState("");
    const [difficulty, setDifficulty] = useState("easy");

    const [options, setOptions] = useState([
        "",
        "",
        "",
        ""
    ]);

    const [correctOption, setCorrectOption] = useState(0);

    const [loading, setLoading] = useState(false);

    const updateOption = (index, value) => {

        const updated = [...options];

        updated[index] = value;

        setOptions(updated);

    };

    const resetForm = () => {

        setQuestionText("");

        setDifficulty("easy");

        setOptions([
            "",
            "",
            "",
            ""
        ]);

        setCorrectOption(0);

    };

    const handleSubmit = async () => {

        if (!questionText.trim()) {
            return alert("Enter a question.");
        }

        if (options.some(option => !option.trim())) {
            return alert("Fill all four options.");
        }

        try {

            setLoading(true);

            const questionResponse = await api.post(
                "/questions",
                {
                    question_text: questionText,
                    difficulty,
                    topic_id: Number(selectedTopic),
                    subtopic_id: Number(selectedSubtopic)
                }
            );

            const questionId = questionResponse.data.id;

            for (let i = 0; i < options.length; i++) {

                await api.post("/options", {

                    option_text: options[i],

                    is_correct: i === correctOption,

                    question_id: questionId

                });

            }

            alert("Question created successfully.");

            resetForm();

        } catch (err) {

            console.error(err);

            alert("Unable to create question.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <>

            <select
                className="input"
                value={selectedTopic}
                onChange={(e) =>
                    setSelectedTopic(e.target.value)
                }
            >

                {topics.map(topic => (

                    <option
                        key={topic.id}
                        value={topic.id}
                    >
                        {topic.name}
                    </option>

                ))}

            </select>

            <select
                className="input"
                value={selectedSubtopic}
                onChange={(e) =>
                    setSelectedSubtopic(e.target.value)
                }
            >

                {subtopics.map(subtopic => (

                    <option
                        key={subtopic.id}
                        value={subtopic.id}
                    >
                        {subtopic.name}
                    </option>

                ))}

            </select>

            <select
                className="input"
                value={difficulty}
                onChange={(e) =>
                    setDifficulty(e.target.value)
                }
            >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>

            <textarea
                className="input"
                rows={4}
                placeholder="Enter question"
                value={questionText}
                onChange={(e) =>
                    setQuestionText(e.target.value)
                }
            />

            {options.map((option, index) => (

                <div
                    key={index}
                    className="option-row"
                >

                    <input
                        className="input"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) =>
                            updateOption(index, e.target.value)
                        }
                    />

                    <label className="option-correct">

                        <input
                            type="radio"
                            name="correct-option"
                            checked={correctOption === index}
                            onChange={() =>
                                setCorrectOption(index)
                            }
                        />

                        Correct

                    </label>

                </div>

            ))}

            <button
                className="btn"
                disabled={loading}
                onClick={handleSubmit}
            >
                {loading
                    ? "Saving..."
                    : "Save Question"}
            </button>

        </>

    );

}

export default QuestionForm;