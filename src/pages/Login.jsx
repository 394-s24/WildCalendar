import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/Card'
import Google from "../assets/goglelol.svg"

import { Button } from '../components/Button'


function Login() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();

    const handleLogin = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("USER LOGGED IN:", user);
                navigate("/calendar");
            }).catch((error) => {
                console.error("Error during sign in:", error);
            });
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is already signed in", user);
            navigate("/calendar");
        }
    });

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
