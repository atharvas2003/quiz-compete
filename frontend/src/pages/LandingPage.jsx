import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import Stats from "../components/Landing/Stats";
import PatternRecognition from "../components/Landing/PatternRecognition";
import Footer from "../components/Landing/Footer";

function LandingPage() {

    return (

        <div className="landing-page">

            <Hero />

            <Features />

            <Stats />

            <PatternRecognition />

            <Footer />

        </div>

    );

}

export default LandingPage;