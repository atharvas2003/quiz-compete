import { useState } from "react";
import api from "../../services/api";

function CSVUpload({
    topics,
    subtopics,
    selectedTopic,
    selectedSubtopic,
    setSelectedTopic,
    setSelectedSubtopic,
}) {

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const handleUpload = async () => {

        if (!selectedTopic) {
            alert("Please select a topic.");
            return;
        }

        if (!selectedSubtopic) {
            alert("Please select a subtopic.");
            return;
        }

        if (!file) {
            alert("Please choose a CSV file.");
            return;
        }

        try {

            setLoading(true);

            setResult(null);

            const formData = new FormData();

            formData.append(
                "topic_id",
                Number(selectedTopic)
            );

            formData.append(
                "subtopic_id",
                Number(selectedSubtopic)
            );

            formData.append(
                "file",
                file
            );

            const { data } = await api.post(
                "/admin/upload-csv",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            setResult(data);

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

                <input
                    className="input"
                    type="file"
                    accept=".csv"
                    onChange={(e) =>
                        setFile(
                            e.target.files[0]
                        )
                    }
                />

                <button
                    className="btn"
                    disabled={loading}
                    onClick={handleUpload}
                >

                    {loading
                        ? "Uploading..."
                        : "Upload CSV"}

                </button>

                {result && (

                    <div
                        className="card"
                        style={{
                            marginTop: "20px"
                        }}
                    >

                        <h3>
                            Upload Summary
                        </h3>

                        <p>
                            <strong>Inserted:</strong>{" "}
                            {result.inserted}
                        </p>

                        <p>
                            <strong>Skipped:</strong>{" "}
                            {result.skipped}
                        </p>

                        {result.errors.length > 0 && (

                            <>

                                <h4>
                                    Errors
                                </h4>

                                <ul>

                                    {result.errors.map(
                                        (error, index) => (

                                            <li
                                                key={index}
                                            >
                                                Row {error.row} :
                                                {" "}
                                                {error.reason}
                                            </li>

                                        )
                                    )}

                                </ul>

                            </>

                        )}

                    </div>

                )}

            </div>

        </section>

    );

}

export default CSVUpload;