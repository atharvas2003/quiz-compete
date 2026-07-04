import QuestionForm from "./QuestionForm";

function QuestionManager({
    topics,
    subtopics,
    selectedTopic,
    selectedSubtopic,
    setSelectedTopic,
    setSelectedSubtopic,
}) {
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
                />

                <hr />

                <div>

                    <h3>Existing Questions</h3>

                    <p>
                        Question management (Edit/Delete) will be added next.
                    </p>

                </div>

            </div>

        </section>
    );
}

export default QuestionManager;