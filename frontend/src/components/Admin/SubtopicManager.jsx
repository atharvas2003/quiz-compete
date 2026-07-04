import { useState } from "react";
import api from "../../services/api";

function SubtopicManager({
    topics,
    subtopics,
    selectedTopic,
    setSelectedTopic,
    refreshSubtopics,
}) {

    const [subtopicName, setSubtopicName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateSubtopic = async () => {

        if (!selectedTopic) {
            alert("Please select a topic first.");
            return;
        }

        if (!subtopicName.trim()) {
            alert("Please enter a subtopic name.");
            return;
        }

        try {

            setLoading(true);

            await api.post("/subtopics", {
                name: subtopicName.trim(),
                topic_id: Number(selectedTopic),
            });

            setSubtopicName("");

            await refreshSubtopics(selectedTopic);

            alert("Subtopic created successfully.");

        } catch (err) {

            console.error(err);

            alert("Failed to create subtopic.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <section className="card admin-section">

            <div className="card-header">
                <h2>Subtopic Manager</h2>
            </div>

            <div className="card-body">

                <select
                    className="input"
                    value={selectedTopic}
                    onChange={(e) =>
                        setSelectedTopic(e.target.value)
                    }
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

                <input
                    className="input"
                    type="text"
                    placeholder="Enter subtopic name"
                    value={subtopicName}
                    onChange={(e) =>
                        setSubtopicName(e.target.value)
                    }
                />

                <button
                    className="btn"
                    disabled={loading}
                    onClick={handleCreateSubtopic}
                >
                    {loading
                        ? "Creating..."
                        : "Create Subtopic"}
                </button>

                <hr />

                <h3>Existing Subtopics</h3>

                {subtopics.length === 0 ? (

                    <p>No subtopics available.</p>

                ) : (

                    <div className="admin-topic-list">

                        {subtopics.map((subtopic) => (

                            <div
                                key={subtopic.id}
                                className="admin-topic-item"
                            >
                                {subtopic.name}
                            </div>

                        ))}

                    </div>

                )}

            </div>

        </section>

    );

}

export default SubtopicManager;