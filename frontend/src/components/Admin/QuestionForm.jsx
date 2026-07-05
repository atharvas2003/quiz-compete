import { useEffect, useState } from "react";
import api from "../../services/api";
import OptionEditor from "./OptionEditor";

function QuestionForm({
    topics,
    subtopics,
    selectedTopic,
    selectedSubtopic,
    setSelectedTopic,
    setSelectedSubtopic,
    editingQuestion,
    setEditingQuestion,
    refreshQuestions,
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

    useEffect(() => {

        if (!editingQuestion) {

            resetForm();

            return;

        }

        setQuestionText(
            editingQuestion.question_text
        );

        setDifficulty(
            editingQuestion.difficulty
        );

        setSelectedTopic(
            String(editingQuestion.topic_id)
        );

        setSelectedSubtopic(
            String(editingQuestion.subtopic_id)
        );

        setOptions(
            editingQuestion.options.map(
                option => option.option_text
            )
        );

        setCorrectOption(
            editingQuestion.options.findIndex(
                option => option.is_correct
            )
        );

    }, [editingQuestion]);

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

        setEditingQuestion(null);

    };

    const validate = () => {

        if (!questionText.trim()) {

            alert("Question is required.");

            return false;

        }

        if (options.some(option => !option.trim())) {

            alert("All four options are required.");

            return false;

        }

        return true;

    };

    const handleCreate = async () => {

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

            await api.post(
                "/options",
                {
                    option_text: options[i],
                    is_correct: i === correctOption,
                    question_id: questionId
                }
            );

        }

    };

    const handleUpdate = async () => {

        await api.put(

            `/questions/${editingQuestion.id}`,

            {
                question_text: questionText,
                difficulty,
                topic_id: Number(selectedTopic),
                subtopic_id: Number(selectedSubtopic)
            }

        );

        for (let i = 0; i < editingQuestion.options.length; i++) {

            await api.put(

                `/options/${editingQuestion.options[i].id}`,

                {
                    option_text: options[i],
                    is_correct: i === correctOption
                }

            );

        }

    };

    const handleSubmit = async () => {

        if (!validate()) return;

        try {

            setLoading(true);

            if (editingQuestion) {

                await handleUpdate();

                alert("Question updated.");

            }

            else {

                await handleCreate();

                alert("Question created.");

            }

            resetForm();

            await refreshQuestions();

        }

        catch (err) {

            console.error(err);

            alert("Operation failed.");

        }

        finally {

            setLoading(false);

        }

    };
    

    return (

        <div>

            <select
                className="input"
                value={selectedTopic}
                onChange={(e) =>
                    setSelectedTopic(
                        e.target.value
                    )
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
                    setSelectedSubtopic(
                        e.target.value
                    )
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

            <textarea
                className="input"
                rows={4}
                placeholder="Question"
                value={questionText}
                onChange={(e) =>
                    setQuestionText(
                        e.target.value
                    )
                }
            />

            <OptionEditor

                options={options}
                setOptions={setOptions}

                correctOption={correctOption}
                setCorrectOption={setCorrectOption}

            />

            <button
                className="btn"
                disabled={loading}
                onClick={handleSubmit}
            >

                {

                    loading

                        ? "Saving..."

                        : editingQuestion

                        ? "Update Question"

                        : "Save Question"

                }

            </button>

        </div>

    );

}

export default QuestionForm;