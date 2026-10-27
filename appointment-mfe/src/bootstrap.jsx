import React from "react";
import { createRoot } from "react-dom/client";
import Appointments from "./Appointments";

const root = createRoot(document.getElementById("root"));

root.render(<Appointments />);