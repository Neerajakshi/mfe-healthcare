# Healthcare Micro Frontend using Webpack Module Federation

A hands-on Micro Frontend (MFE) application built using **React, Webpack 5, and Webpack Module Federation**.

The project demonstrates how a healthcare application can be split into independently developed and independently deployable Micro Frontends while being composed at runtime by a Host application.

## Architecture

```text
                         ┌──────────────────────────────┐
                         │        HOST APPLICATION      │
                         │          localhost:3000      │
                         │                              │
                         │    Healthcare Patient Portal  │
                         └──────────────┬───────────────┘
                                        │
                       Runtime Module Federation
                         ┌──────────────┴──────────────┐
                         │                             │
                         ▼                             ▼
              ┌───────────────────┐       ┌──────────────────────┐
              │   Patient MFE     │       │   Appointment MFE    │
              │   localhost:3001  │       │   localhost:3002     │
              │                   │       │                      │
              │   Patient.jsx     │       │   Appointment.jsx    │
              │   remoteEntry.js  │       │   remoteEntry.js     │
              └───────────────────┘       └──────────────────────┘
```

The Host does not directly contain the source code of the Patient or Appointment features.

Instead, it loads the Micro Frontends at runtime through their `remoteEntry.js` files.

---

## Project Structure

```text
mfe-healthcare/
│
├── host/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── PatientRemote.jsx
│   │   ├── AppointmentsRemote.jsx
│   │   ├── index.jsx
│   │   └── bootstrap.jsx
│   │
│   └── webpack.config.js
│
├── patient-mfe/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── Patient.jsx
│   │   ├── index.jsx
│   │   └── bootstrap.jsx
│   │
│   └── webpack.config.js
│
└── appointment-mfe/
    ├── public/
    │   └── index.html
    │
    ├── src/
    │   ├── Appointment.jsx
    │   ├── index.jsx
    │   └── bootstrap.jsx
    │
    └── webpack.config.js
```

---

# Technologies

* React
* JavaScript
* Webpack 5
* Webpack Module Federation
* Babel
* HTML Webpack Plugin
* React.lazy
* React Suspense

---

# Micro Frontends

## 1. Host Application

**Port:** `3000`

The Host acts as the container application.

It consumes the Patient and Appointment Micro Frontends.

The Host configuration contains:

```javascript
remotes: {
    patientMfe:
        "patientMfe@http://localhost:3001/remoteEntry.js",

    appointmentMfe:
        "appointmentMfe@http://localhost:3002/remoteEntry.js"
}
```

The Host therefore knows:

```text
patientMfe
    ↓
http://localhost:3001/remoteEntry.js

appointmentMfe
    ↓
http://localhost:3002/remoteEntry.js
```

---

# 2. Patient Micro Frontend

**Port:** `3001`

The Patient MFE owns the Patient Information functionality.

Example:

```text
Patient Information

Patient Name: John Smith
Patient ID: P1001
Status: Active
```

It exposes the Patient component using Module Federation:

```javascript
exposes: {
    "./Patient": "./src/Patient"
}
```

This makes the component available to consuming applications as:

```javascript
patientMfe/Patient
```

---

# 3. Appointment Micro Frontend

**Port:** `3002`

The Appointment MFE owns the Appointment functionality.

Example:

```text
Appointments

Next Appointment: Cardiology
Date: October 5, 2026
Doctor: Dr. Sarah Wilson
```

It exposes the Appointment component:

```javascript
exposes: {
    "./Appointments": "./src/Appointment"
}
```

The Host consumes it as:

```javascript
appointmentMfe/Appointments
```

---

# How Module Federation Works

The important concept demonstrated by this project is:

```text
BUILD TIME
    │
    ├── Host built independently
    ├── Patient MFE built independently
    └── Appointment MFE built independently


RUNTIME
    │
    ▼
Host
 │
 ├── loads Patient remoteEntry.js
 │
 └── loads Appointment remoteEntry.js
```

The Host does not need to rebuild every time the source code of a remote changes.

The Micro Frontends can have their own:

* Source code
* Build
* Repository
* CI/CD pipeline
* Deployment
* Release cycle

---

# remoteEntry.js

Each remote generates:

```text
remoteEntry.js
```

For example:

```text
Patient MFE
http://localhost:3001/remoteEntry.js

Appointment MFE
http://localhost:3002/remoteEntry.js
```

`remoteEntry.js` acts as the entry point through which the Host discovers and loads modules exposed by the remote.

It is **not simply the complete remote application**.

It contains the Module Federation runtime/container information required to access the exposed modules.

---

# exposes vs remotes

## Remote application — `exposes`

The Patient MFE says:

```javascript
exposes: {
    "./Patient": "./src/Patient"
}
```

Meaning:

> "I provide this module to other applications."

The Appointment MFE does the same:

```javascript
exposes: {
    "./Appointments": "./src/Appointment"
}
```

---

## Host application — `remotes`

The Host says:

```javascript
remotes: {
    patientMfe:
        "patientMfe@http://localhost:3001/remoteEntry.js",

    appointmentMfe:
        "appointmentMfe@http://localhost:3002/remoteEntry.js"
}
```

Meaning:

> "These are external applications that I can consume at runtime."

A simple way to remember it:

```text
exposes = What do I provide?

remotes  = What external applications do I consume?
```

---

# Runtime Loading

The Host uses React.lazy:

```javascript
const Patient = React.lazy(
    () => import("patientMfe/Patient")
);
```

and:

```javascript
const Appointments = React.lazy(
    () => import("appointmentMfe/Appointments")
);
```

When the application needs the remote module, Module Federation can load the corresponding remote entry and retrieve the exposed module.

This is different from a traditional npm dependency where the source package is normally resolved and bundled as part of the application's build.

---

# Shared Dependencies

The Host and Micro Frontends share React:

```javascript
shared: {
    react: {
        singleton: true
    },
    "react-dom": {
        singleton: true
    }
}
```

The purpose is to avoid unnecessarily loading independent React instances and to coordinate shared dependencies between the applications.

`singleton: true` indicates that the federation runtime should use a single shared instance for that dependency within the federation setup.

Shared dependencies also introduce a version-compatibility consideration. Teams need to manage versions carefully when independently releasing Micro Frontends.

---

# Bootstrap Pattern

The Micro Frontends use:

```javascript
import("./bootstrap");
```

instead of immediately starting React from `index.jsx`.

For example:

```javascript
// index.jsx

import("./bootstrap");
```

Then:

```javascript
// bootstrap.jsx

import React from "react";
import { createRoot } from "react-dom/client";
```

This pattern helps avoid the Webpack Module Federation shared-module initialization problem that can occur when React is consumed before the federation shared scope is initialized.

---

# Running the Project

Three applications need to run.

## 1. Start Patient MFE

```bash
cd patient-mfe
npx webpack serve --config webpack.config.js
```

Runs on:

```text
http://localhost:3001
```

Remote entry:

```text
http://localhost:3001/remoteEntry.js
```

---

## 2. Start Appointment MFE

```bash
cd appointment-mfe
npx webpack serve --config webpack.config.js
```

Runs on:

```text
http://localhost:3002
```

Remote entry:

```text
http://localhost:3002/remoteEntry.js
```

---

## 3. Start Host

```bash
cd host
npx webpack serve --config webpack.config.js
```

Runs on:

```text
http://localhost:3000
```

Open:

```text
http://localhost:3000
```

The Host should display both:

```text
Healthcare Patient Portal

Patient Information
Patient Name: John Smith
Patient ID: P1001
Status: Active

Appointments
Next Appointment: Cardiology
Date: October 5, 2026
Doctor: Dr. Sarah Wilson
```

---

# CORS Configuration

Because the Host runs on port `3000` while the remotes run on different ports, they are different origins during local development.

The remote development servers therefore include:

```javascript
headers: {
    "Access-Control-Allow-Origin": "*"
}
```

This allows the Host to load the remote federation entry during local development.

---

# Error Handling

The Host uses:

```javascript
<Suspense fallback={<div>Loading...</div>}>
```

for asynchronous remote loading.

In a production application, this can be extended with an **Error Boundary** so that failure of one remote does not necessarily make the entire Host application unusable.

For example:

```text
Patient MFE          Appointment MFE
     │                      │
     │                      │
   WORKING                 DOWN
     │                      │
     ▼                      ▼
Patient UI             Fallback UI
```

This is an important consideration when designing production Micro Frontends.

---

# Current Features

The project currently demonstrates:

* React-based Micro Frontends
* Webpack Module Federation
* Host application
* Multiple remote applications
* Runtime remote loading
* `remoteEntry.js`
* `exposes`
* `remotes`
* Shared React dependencies
* React.lazy
* React Suspense
* Independent development servers
* Cross-origin remote loading

---

# Planned Enhancements

The next stages of this project will demonstrate more realistic Micro Frontend architecture.

### 1. MFE Communication

Patient MFE will publish a selected patient:

```text
Patient MFE
     │
     │ patientSelected
     ▼
Browser Event
     │
     ▼
Appointment MFE
```

The Appointment MFE can then display appointments for the selected patient.

---

### 2. Independent Deployment

Demonstrate that:

```text
Host
Patient MFE
Appointment MFE
```

can have separate build and deployment pipelines.

---

### 3. Error Isolation

Simulate a remote being unavailable and provide a fallback UI instead of breaking the entire Host application.

---

### 4. Shared UI Components

Explore how common components such as:

```text
Button
Modal
Patient Card
Loading Spinner
Header
```

can be shared between Micro Frontends.

---

### 5. Authentication

Explore how authentication can be handled when multiple Micro Frontends participate in the same application.

---

### 6. Routing

Add routes such as:

```text
/patients
/appointments
/prescriptions
```

and explore which routing responsibilities belong to the Host versus individual Micro Frontends.

---

### 7. Observability

Add application observability using technologies such as:

```text
OpenTelemetry
        ↓
Traces
        ↓
Host → Patient MFE → Backend API
```

This is particularly useful for understanding how distributed tracing can work across a Micro Frontend architecture.

---

# Key Interview Questions

This project can be used to discuss:

### What is a Micro Frontend?

A frontend architecture where a large frontend application is divided into smaller independently developed and potentially independently deployed frontend applications.

### What is Module Federation?

A Webpack capability that allows separately built applications to expose and consume modules at runtime.

### What is `remoteEntry.js`?

The federation entry/container through which a consuming application can discover and load modules exposed by a remote application.

### What is `exposes`?

The modules that a remote application makes available to other applications.

### What is `remotes`?

The external applications that the Host knows how to consume.

### Why use `shared`?

To coordinate dependencies such as React between Host and remotes and avoid unnecessary duplicate instances.

### What happens if a remote is unavailable?

The remote module cannot be loaded. The Host should handle this gracefully using mechanisms such as loading states and Error Boundaries.

### Can Micro Frontends be deployed independently?

Yes. One of the major goals of MFE architecture is to allow teams to develop and release frontend capabilities independently, while still requiring compatible contracts and dependency management.

---

# Learning Goal

The goal of this project is not just to create multiple React applications.

It is to understand the architectural principles behind Micro Frontends:

```text
Independent Development
        ↓
Independent Build
        ↓
Independent Deployment
        ↓
Runtime Composition
        ↓
Communication
        ↓
Dependency Management
        ↓
Failure Isolation
        ↓
Observability
```

This project will progressively demonstrate each of these concepts using a realistic healthcare application.
