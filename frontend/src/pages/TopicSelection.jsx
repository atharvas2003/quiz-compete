import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/topic.css";

function TopicSelection() {

    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getTopics();
    }, []);

    const getTopics = async () => {

        try {

            const response = await api.get("/topics");
            setTopics(response.data);

        } catch (err) {

            console.log(err);

        }

    };

    const selectTopic = (topic) => {

        localStorage.setItem("topic_id", topic.id);
        localStorage.setItem("topic_name", topic.name);

        console.log("Selected Topic:", localStorage.getItem("topic_id"));
        console.log("Selected Topic Name:", localStorage.getItem("topic_name"));

        navigate("/quiz");

    };

    return (

        <div className="topics-page">

            <div className="topics-container">

                <div className="topics-header">

                    <span className="topics-badge">
                        📚 Choose Your Challenge
                    </span>

                    <h1>
                        Select a Quiz Topic
                    </h1>

                    <p>
                        Pick a subject below and compete against yourself.
                        Improve your speed, accuracy and rating with every battle.
                    </p>

                </div>

                <div className="topics-grid">

                    {topics.map((topic) => (

                        <div
                            key={topic.id}
                            className="topic-card"
                            onClick={() => selectTopic(topic)}
                        >

                            <div className="topic-icon">
                                📖
                            </div>

                            <h2>
                                {topic.name}
                            </h2>

                            <p>
                                Challenge yourself with carefully selected aptitude questions.
                            </p>

                            <button className="btn">
                                Start Quiz →
                            </button>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default TopicSelection;