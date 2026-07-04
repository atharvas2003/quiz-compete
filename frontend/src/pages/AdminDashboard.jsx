import { useEffect, useState } from "react";
import api from "../services/api";

import TopicManager from "../components/admin/TopicManager";
import SubtopicManager from "../components/admin/SubtopicManager";
import QuestionManager from "../components/admin/QuestionManager";
import CSVUpload from "../components/admin/CSVUpload";

import "../styles/admin.css";

function AdminDashboard() {

    const [topics, setTopics] = useState([]);
    const [subtopics, setSubtopics] = useState([]);

    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedSubtopic, setSelectedSubtopic] = useState("");

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {

        try {

            const { data } = await api.get("/topics");

            setTopics(data);

            if (data.length > 0) {
                setSelectedTopic(data[0].id);
            }

        } catch (err) {

            console.error(err);

        }

    };

    useEffect(() => {

        if (selectedTopic) {
            fetchSubtopics(selectedTopic);
        }

    }, [selectedTopic]);

    const fetchSubtopics = async (topicId) => {

        try {

            const { data } = await api.get(
                `/subtopics/topic/${topicId}`
            );

            setSubtopics(data);

            if (data.length > 0) {
                setSelectedSubtopic(data[0].id);
            } else {
                setSelectedSubtopic("");
            }

        } catch (err) {

            console.error(err);

        }

    };

    return (

        <main className="page-container admin-dashboard">

            <div className="admin-header">

                <h1>Admin Dashboard</h1>

                <p>
                    Manage topics, subtopics, questions and CSV uploads.
                </p>

            </div>

            <TopicManager
                topics={topics}
                refreshTopics={fetchTopics}
            />

            <SubtopicManager
                topics={topics}
                subtopics={subtopics}
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
                refreshSubtopics={fetchSubtopics}
            />

            <QuestionManager
                topics={topics}
                subtopics={subtopics}
                selectedTopic={selectedTopic}
                selectedSubtopic={selectedSubtopic}
                setSelectedTopic={setSelectedTopic}
                setSelectedSubtopic={setSelectedSubtopic}
            />

            <CSVUpload
                topics={topics}
                subtopics={subtopics}
                selectedTopic={selectedTopic}
                selectedSubtopic={selectedSubtopic}
            />

        </main>

    );

}

export default AdminDashboard;