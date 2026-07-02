import { useNavigate } from "react-router-dom";
import "../../styles/hero.css";

function Hero() {

    const navigate = useNavigate();

    return (

        <section className="hero">

            {/* LEFT */}

            <div className="hero-left">

                <div className="hero-badge">
                    🚀 Real-time Aptitude Battles
                </div>

                <h1>
                    Entrance exams
                    <br />
                    aren't won by
                    <br />
                    studying alone.
                    <br />
                    <span>
                        It is won by
                        <br />
                        practice,
                        <br />
                        practice and speed.
                    </span>
                </h1>

                <p>
                    Battle other aspirants in real-time aptitude quizzes.
                    Improve your speed, pattern recognition and exam
                    instincts—one match at a time.
                </p>

                <div className="hero-buttons">

                    <button
                        className="btn"
                        onClick={() => navigate("/register")}
                    >
                        Start Competing
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                </div>

                <div className="hero-rating">
                    ⭐⭐⭐⭐⭐
                    <span>10K+ aspirants already competing</span>
                </div>

            </div>

            {/* RIGHT */}

            <div className="hero-right">

                <div className="leaderboard-card">

                    <h3>🏆 Leaderboard</h3>

                    <div className="lb-row">
                        <span>#1 Aarav</span>
                        <span className="lb-score">1580</span>
                    </div>

                    <div className="lb-row">
                        <span>#2 Divya</span>
                        <span className="lb-score">1520</span>
                    </div>

                    <div className="lb-row">
                        <span>#3 Rohan</span>
                        <span className="lb-score">1496</span>
                    </div>

                    <div className="lb-row">
                        <span>#4 You?</span>
                        <span className="lb-score">1000</span>
                    </div>

                    <p className="lb-footer">
                        👥 Join thousands of aspirants competing every day and
                        climb the leaderboard.
                    </p>

                </div>

            </div>

        </section>

    );

}

export default Hero;