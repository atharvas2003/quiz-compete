import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import api from "../services/api";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";

import "../styles/auth.css";

function Login() {

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const navigate=useNavigate();
    const location=useLocation();

    const message=location.state?.message;

    async function handleLogin(){

        try{

            const formData=new URLSearchParams();

            formData.append("username",email);
            formData.append("password",password);

            const response=await api.post(
                "/auth/login",
                formData,
                {
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }
            );

            localStorage.setItem(
                "auth",
                JSON.stringify({

                    token:response.data.access_token,
                    username:response.data.username,
                    role:response.data.role,
                    rating:response.data.rating,

                    loginTime:Date.now(),

                    expiresAt:
                        Date.now()+10*24*60*60*1000

                })
            );

            navigate("/dashboard");

        }

        catch{

            alert("Invalid Credentials");

        }

    }

    return(

        <div className="page-container auth-page fade-in">

            {message &&

                <div className="login-message">

                    🔒 {message}

                </div>

            }

            <Card className="auth-card">

                <h1 className="page-title">

                    Quiz Compete

                </h1>

                <p className="page-subtitle">

                    Sign in to continue

                </p>

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

                <Button
                    onClick={handleLogin}
                >
                    Login
                </Button>

                <Button

                    variant="secondary"

                    onClick={()=>navigate("/register")}

                >

                    Create Account

                </Button>

            </Card>

        </div>

    );

}

export default Login;