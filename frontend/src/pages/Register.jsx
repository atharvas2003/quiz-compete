import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Input from "../components/Input";
import "../styles/auth.css";


function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {

        try {

            await api.post(
                "/auth/register",
                {
                    username,
                    email,
                    password
                }
            );

            alert("Registration Successful");

            navigate("/login");

        } catch (err) {

            console.log(err.response?.data);

            alert("Registration Failed");

        }
    };

    return (

        <div className="page-container fade-in">

            <div
                className="card"
                style={{
                    maxWidth: "500px",
                    margin: "80px auto"
                }}
            >

                <h1 className="page-title">
                    Create Account
                </h1>

                <p
                    style={{
                        color: "#737373",
                        marginBottom: "24px"
                    }}
                >
                    Join Prep Arena
                </p>

                <Input
                    className="input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                />

                <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
               <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <button
                    className="btn"
                    style={{
                        width: "100%",
                        marginTop: "10px"
                    }}
                    onClick={handleRegister}
                >
                    Register
                </button>

                <button
                    className="btn-secondary"
                    style={{
                        width: "100%",
                        marginTop: "12px",
                        padding: "12px"
                    }}
                    onClick={() => navigate("/login")}
                >
                    Already have an account?
                </button>

            </div>

        </div>

    );
}

export default Register;