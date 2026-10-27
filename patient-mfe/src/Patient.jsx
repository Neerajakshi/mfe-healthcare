
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Patient({ apiClient }) {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Keep track of the patient ID in the URL
    const [patientId, setPatientId] = useState(
        getPatientIdFromUrl()
    );

    const dispatch = useDispatch();

    const selectedPatient = useSelector(
        state => state.workflow.selectedPatient
    );


    // -----------------------------------------
    // Read patient ID from URL
    // -----------------------------------------

    function getPatientIdFromUrl() {

        const parts =
            window.location.pathname.split("/");

        // /patients/P1001
        if (
            parts.length >= 3 &&
            parts[1] === "patients"
        ) {
            return parts[2];
        }

        return null;
    }


    // -----------------------------------------
    // Listen for browser URL changes
    // -----------------------------------------

    useEffect(() => {

        const handlePopState = () => {

            setPatientId(
                getPatientIdFromUrl()
            );
        };

        window.addEventListener(
            "popstate",
            handlePopState
        );

        return () => {

            window.removeEventListener(
                "popstate",
                handlePopState
            );

        };

    }, []);


    // -----------------------------------------
    // Load patients
    // -----------------------------------------

    useEffect(() => {

        const loadPatients = async () => {

            try {

                const data =
                    await apiClient.get(
                        "/api/patients"
                    );

                console.log(
                    "Patients:",
                    data
                );

                setPatients(data);

            } catch (error) {

                console.error(
                    "Failed to load patients:",
                    error
                );

                setError(
                    error.message
                );

            } finally {

                setLoading(false);
            }
        };

        loadPatients();

    }, [apiClient]);


    // -----------------------------------------
    // Select patient
    // -----------------------------------------

    function handleSelect(patient) {

        dispatch({
            type: "workflow/selectPatient",
            payload: patient
        });

        // Update URL
        window.history.pushState(
            {},
            "",
            `/patients/${patient.id}`
        );

        // Tell React that the URL changed
        setPatientId(
            String(patient.id)
        );
    }


    // -----------------------------------------
    // Back to patient list
    // -----------------------------------------

    function handleBack() {

        window.history.pushState(
            {},
            "",
            "/patients"
        );

        setPatientId(null);
    }


    // -----------------------------------------
    // Loading
    // -----------------------------------------

    if (loading) {

        return (
            <section>

                <h2>
                    Patient Management
                </h2>

                <p>
                    Loading patients...
                </p>

            </section>
        );
    }


    // -----------------------------------------
    // Error
    // -----------------------------------------

    if (error) {

        return (
            <section>

                <h2>
                    Patient Management
                </h2>

                <p>
                    Failed to load patients:
                    {" "}
                    {error}
                </p>

            </section>
        );
    }


    // -----------------------------------------
    // Patient Details
    // -----------------------------------------

    if (patientId) {

        const patient =
            patients.find(
                p =>
                    String(p.id) ===
                    String(patientId)
            );


        if (!patient) {

            return (
                <section>

                    <button
                        onClick={handleBack}
                        style={{
                            marginBottom: "20px",
                            padding: "8px 14px",
                            cursor: "pointer"
                        }}
                    >
                        ← Back to Patients
                    </button>

                    <h2>
                        Patient Not Found
                    </h2>

                    <p>
                        No patient found with ID:
                        {" "}
                        {patientId}
                    </p>

                </section>
            );
        }


        return (
            <section>

                <button
                    onClick={handleBack}
                    style={{
                        marginBottom: "20px",
                        padding: "8px 14px",
                        cursor: "pointer"
                    }}
                >
                    ← Back to Patients
                </button>


                <h2>
                    Patient Details
                </h2>


                <div
                    style={{
                        marginTop: "20px",
                        padding: "24px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        background: "white",
                        maxWidth: "600px"
                    }}
                >

                    <h3
                        style={{
                            marginTop: 0
                        }}
                    >
                        {patient.name}
                    </h3>


                    <p>
                        <strong>
                            Patient ID:
                        </strong>
                        {" "}
                        {patient.id}
                    </p>


                    <p>
                        <strong>
                            Name:
                        </strong>
                        {" "}
                        {patient.name}
                    </p>

                </div>

            </section>
        );
    }


    // -----------------------------------------
    // Patient List
    // -----------------------------------------

    return (
        <section>

            <h2>
                Patient Management
            </h2>

            <p>
                Select a patient to view
                their details.
            </p>


            {patients.length === 0 ? (

                <p>
                    No patients found.
                </p>

            ) : (

                patients.map(
                    patient => (

                        <button
                            key={patient.id}
                            onClick={() =>
                                handleSelect(
                                    patient
                                )
                            }
                            style={{
                                margin: "6px",
                                padding: "10px 14px",
                                cursor: "pointer",

                                border:
                                    selectedPatient?.id ===
                                    patient.id
                                        ? "2px solid #2563eb"
                                        : "1px solid #ccc",

                                borderRadius: "6px",

                                background:
                                    selectedPatient?.id ===
                                    patient.id
                                        ? "#eff6ff"
                                        : "white"
                            }}
                        >
                            {patient.name}
                        </button>

                    )
                )

            )}

        </section>
    );
}

