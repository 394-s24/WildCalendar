import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader
} from '../components/Card';
import Google from "../assets/goglelol.svg";
import { Button } from '../components/Button';
import { login, observeAuthState } from '../firebase.jsx';

function Login() {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const result = await login();
            const user = result.user;
            console.log("USER LOGGED IN:", user);
            navigate("/calendar");
        } catch (error) {
            console.error("Error during sign in:", error);
        }
    };

    useEffect(() => {
        observeAuthState((user) => {
            if (user) {
                console.log("User is already signed in", user);
                navigate("/calendar");
            }
        });
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card>
                <CardHeader className="font-bold text-2xl">Login to Your Account</CardHeader>
                <CardContent className="flex justify-center">
                  <Button
                      onClick={handleLogin}
                      className="w-full flex justify-center gap-2"
                  >
                    <img src={Google} className='h-3' alt="Google"/>
                      Sign in with Google
                  </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;
