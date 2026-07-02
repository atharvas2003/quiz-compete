import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Review from "./pages/Review";
import SessionReview from "./pages/SessionReview";
import TopicSelection from "./pages/TopicSelection";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>

            {/* Public Routes */}

            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/topics"
                element={
                    <ProtectedRoute>
                        <TopicSelection />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/quiz"
                element={
                    <ProtectedRoute>
                        <Quiz />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/result"
                element={
                    <ProtectedRoute>
                        <Result />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/history"
                element={
                    <ProtectedRoute>
                        <History />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/history/:sessionId"
                element={
                    <ProtectedRoute>
                        <SessionReview />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/review"
                element={
                    <ProtectedRoute>
                        <Review />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default App;