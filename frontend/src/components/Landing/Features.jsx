import "../../styles/features.css";

function Features() {
    return (
        <section className="features">

            <div className="section-heading">
                <h2>More than practice.</h2>
                <p>Train the way toppers think.</p>
            </div>

            <div className="features-grid">

                <div className="feature-card">
                    <span>🧠</span>
                    <h3>Pattern Recognition</h3>
                    <p>
                        Solve hundreds of questions until your brain
                        recognises familiar question patterns instantly.
                    </p>
                </div>

                <div className="feature-card">
                    <span>⚡</span>
                    <h3>Real Competition</h3>
                    <p>
                        Compete against other aspirants under timed
                        conditions and improve your speed.
                    </p>
                </div>

                <div className="feature-card">
                    <span>📊</span>
                    <h3>Performance Analytics</h3>
                    <p>
                        Track accuracy, rating and improvement after
                        every quiz.
                    </p>
                </div>

            </div>

        </section>
    );
}

export default Features;