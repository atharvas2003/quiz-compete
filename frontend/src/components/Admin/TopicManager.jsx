import { useState } from "react";
import api from "../../services/api";

function TopicManager({ topics, refreshTopics }) {

    const [topicName, setTopicName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateTopic = async () => {

        if (!topicName.trim()) {
            alert("Please enter a topic name.");
            return;
        }

        try {

            setLoading(true);

            await api.post("/topics", {
                name: topicName.trim(),
            });

            setTopicName("");

            await refreshTopics();

            alert("Topic created successfully.");

        } catch (err) {

            console.error(err);

            alert("Failed to create topic.");

        } finally {

            setLoading(false);

        }
    };

    return (

        <section className="card admin-section">

            <div className="card-header">
                <h2>Topic Manager</h2>
            </div>

            <div className="card-body">

                <input
                    className="input"
                    type="text"
                    placeholder="Enter topic name"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                />

                <button
                    className="btn"
                    disabled={loading}
                    onClick={handleCreateTopic}
                >
                    {loading ? "Creating..." : "Create Topic"}
                </button>

                <hr />

                <h3>Existing Topics</h3>

                {topics.length === 0 ? (

                    <p>No topics available.</p>

                ) : (

                    <div className="admin-topic-list">

                        {topics.map((topic) => (

                            <div
                                key={topic.id}
                                className="admin-topic-item"
                            >
                                {topic.name}
                            </div>

                        ))}

                    </div>

                )}

            </div>

        </section>

    );

}

export default TopicManager;