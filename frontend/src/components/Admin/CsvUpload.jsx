import { useState } from "react";
import api from "../../services/api";

function CSVUpload({

    topics,
    subtopics,
    selectedTopic,
    selectedSubtopic

}) {

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const uploadCSV = async () => {

        if (!file) {

            alert("Please select a CSV file.");

            return;

        }

        const formData = new FormData();

        formData.append("file", file);

        formData.append("topic_id", selectedTopic);

        formData.append("subtopic_id", selectedSubtopic);

        try {

            setLoading(true);

            const response = await api.post(

                "/admin/upload-csv",

                formData

            );

            alert(response.data.message);

            setFile(null);

        }

        catch (err) {

            console.error(err);

            alert("CSV upload failed.");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <section className="card admin-section">

            <div className="card-header">

                <h2>Bulk CSV Upload</h2>

            </div>

            <div className="card-body">

                <select
                    className="input"
                    value={selectedTopic}
                    disabled
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
                    disabled
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

                <input

                    type="file"

                    className="input"

                    accept=".csv"

                    onChange={(e) =>
                        setFile(e.target.files[0])
                    }

                />

                <button

                    className="btn"

                    disabled={loading}

                    onClick={uploadCSV}

                >

                    {

                        loading

                            ? "Uploading..."

                            : "Upload CSV"

                    }

                </button>

            </div>

        </section>

    );

}

export default CSVUpload;