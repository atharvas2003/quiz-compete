import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }) {
    const auth = JSON.parse(
        localStorage.getItem("auth")
    );
    if (!auth) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    message:
                        "Please login or register before accessing this page."
                }}
            />
        );

    }
    if (Date.now() > auth.expiresAt) {

        localStorage.removeItem("auth");

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    message:
                        "Your session has expired. Please login again."
                }}
            />
        );

    }

    return children;

}

export default ProtectedRoute;