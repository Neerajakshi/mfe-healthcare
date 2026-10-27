import React from "react";
import { useSelector } from "react-redux";

const appointmentsByPatient = {
    P1001: [
        {
            id: "A101",
            date: "October 5, 2026",
            doctor: "Dr. Sarah Wilson",
            specialty: "Cardiology",
            status: "Confirmed"
        }
    ],

    P1002: [
        {
            id: "A201",
            date: "October 8, 2026",
            doctor: "Dr. Michael Brown",
            specialty: "Dermatology",
            status: "Confirmed"
        }
    ],

    P1003: [
        {
            id: "A301",
            date: "October 12, 2026",
            doctor: "Dr. Emily Davis",
            specialty: "Neurology",
            status: "Pending"
        }
    ]
};

export default function Appointments() {
    const selectedPatient = useSelector(
        state => state.workflow.selectedPatient
    );

    if (!selectedPatient) {
        return (
            <section>
                <h2>Appointments</h2>
                <p>Select a patient to view their appointments.</p>
            </section>
        );
    }

    const appointments =
        appointmentsByPatient[selectedPatient.id] || [];

    return (
        <section>
            <h2>Appointments</h2>
            <p>
                Showing appointments for <strong>
                    {selectedPatient.name}
                </strong>
            </p>

            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                appointments.map(appointment => (
                    <article
                        key={appointment.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "12px",
                            margin: "10px 0"
                        }}
                    >
                        <h3>{appointment.specialty}</h3>
                        <p>Date: {appointment.date}</p>
                        <p>Doctor: {appointment.doctor}</p>
                        <p>Status: {appointment.status}</p>
                    </article>
                ))
            )}
        </section>
    );
}