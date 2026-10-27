
import React, { Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import Login from "./pages/Login";
import authService from "./auth/authService";
import "./App.css";

const Patient = React.lazy(() => import("patientMfe/Patient"));
const Appointments = React.lazy(() => import("appointmentMfe/Appointments"));

function Dashboard() {
    return (
        <div>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>
                    Welcome to the Healthcare Portal.
                </p>
            </div>

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <div className="card-title">
                        Patients
                    </div>

                    <div className="card-value">
                        —
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-title">
                        Appointments
                    </div>

                    <div className="card-value">
                        —
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-title">
                        System Status
                    </div>

                    <div className="card-value status">
                        Online
                    </div>
                </div>

            </div>
        </div>
    );
}


function App({ apiClient }) {

    const [loggedIn, setLoggedIn] = useState(
        authService.isLoggedIn()
    );

    console.log("App apiClient:", apiClient);

    const handleLogin = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        authService.logout();
        setLoggedIn(false);
    };

    if (!loggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <BrowserRouter>

            <div className="portal">

                {/* Header */}

                <header className="topbar">

                    <div className="topbar-left">

                        <div className="logo-icon">
                            +
                        </div>

                        <div className="logo-text">
                            Healthcare Portal
                        </div>

                    </div>


                    <div className="topbar-right">

                        <div className="user-info">

                            <div className="user-avatar">
                                U
                            </div>

                            <div>
                                <div className="user-name">
                                    Healthcare User
                                </div>

                                <div className="user-role">
                                    Healthcare Staff
                                </div>
                            </div>

                        </div>


                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </header>


                <div className="portal-body">

                    {/* Sidebar */}

                    <aside className="sidebar">

                        <div className="sidebar-title">
                            MAIN MENU
                        </div>


                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                isActive
                                    ? "nav-item active"
                                    : "nav-item"
                            }
                        >
                            <span className="nav-icon">
                                📊
                            </span>

                            Dashboard
                        </NavLink>


                        <NavLink
                            to="/patients"
                            className={({ isActive }) =>
                                isActive
                                    ? "nav-item active"
                                    : "nav-item"
                            }
                        >
                            <span className="nav-icon">
                                👤
                            </span>

                            Patients
                        </NavLink>


                        <NavLink
                            to="/appointments"
                            className={({ isActive }) =>
                                isActive
                                    ? "nav-item active"
                                    : "nav-item"
                            }
                        >
                            <span className="nav-icon">
                                📅
                            </span>

                            Appointments
                        </NavLink>


                        <div className="sidebar-bottom">

                            <div className="sidebar-title">
                                SYSTEM
                            </div>

                            <button className="nav-item">
                                <span className="nav-icon">
                                    ⚙️
                                </span>

                                Settings
                            </button>

                        </div>

                    </aside>


                    {/* Main content */}

                    <main className="content">

                        <Routes>

                            <Route
                                path="/"
                                element={
                                    <Dashboard />
                                }
                            />


                            <Route
                                path="/dashboard"
                                element={
                                    <Dashboard />
                                }
                            />


                            <Route
                                path="/patients"
                                element={
                                    <div>

                                        <div className="page-header">

                                            <h1>
                                                Patients
                                            </h1>

                                            <p>
                                                Manage patient information
                                                and records.
                                            </p>

                                        </div>


                                        <Suspense
                                            fallback={
                                                <div className="mfe-loading">
                                                    Loading Patient Module...
                                                </div>
                                            }
                                        >

                                            <Patient
                                                apiClient={apiClient}
                                            />

                                        </Suspense>

                                    </div>
                                }
                            />


                            <Route
                                path="/appointments"
                                element={
                                    <div>

                                        <div className="page-header">

                                            <h1>
                                                Appointments
                                            </h1>

                                            <p>
                                                View and manage patient
                                                appointments.
                                            </p>

                                        </div>


                                        <Suspense
                                            fallback={
                                                <div className="mfe-loading">
                                                    Loading Appointment Module...
                                                </div>
                                            }
                                        >

                                            <Appointments
                                                apiClient={apiClient}
                                            />

                                        </Suspense>

                                    </div>
                                }
                            />

                        </Routes>

                    </main>

                </div>

            </div>

        </BrowserRouter>
    );
}

export default App;

