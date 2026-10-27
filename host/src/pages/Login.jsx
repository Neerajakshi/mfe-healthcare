
import React, { useState } from "react";
import authService from "../auth/authService";
import "./Login.css";

export default function Login({ onLogin }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        if (!username || !password) {
            setError("Please enter username and password");
            return;
        }

        try {

            setLoading(true);

            await authService.login(
                username,
                password
            );

            // Tell Host that authentication succeeded
            onLogin();

        } catch (err) {

            setError(
                err.message || "Login failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="login-page">

            <div className="login-left">

                <div className="brand">

                    <div className="brand-icon">
                        +
                    </div>

                    <span>
                        Healthcare Portal
                    </span>

                </div>

                <div className="hero-content">

                    <h1>
                        Better healthcare.
                        <br />
                        Connected securely.
                    </h1>

                    <p>
                        Access patients, appointments and
                        healthcare services from one secure
                        platform.
                    </p>

                </div>

            </div>

            <div className="login-right">

                <div className="login-card">

                    <div className="login-header">

                        <div className="mobile-logo">
                            +
                        </div>

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Sign in to your healthcare account
                        </p>

                    </div>

                    <form onSubmit={handleLogin}>

                        <div className="form-group">

                            <label>
                                Email / Username
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                autoComplete="username"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                            />

                        </div>

                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign In"}

                        </button>

                    </form>

                    <div className="login-footer">
                        Secured by Keycloak
                    </div>

                </div>

            </div>

        </div>
    );
}

