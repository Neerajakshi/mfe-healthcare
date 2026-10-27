import React from "react";
import { createRoot } from "react-dom/client";
import Patient from "./Patient";

const root = createRoot(document.getElementById("root"));

root.render(<Patient />);