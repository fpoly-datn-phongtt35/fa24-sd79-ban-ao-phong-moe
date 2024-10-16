import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "bootstrap/dist/js/bootstrap.js";
import App from "./App.jsx";
import "~/assert/index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
    <ToastContainer />
  </>
  // </StrictMode>
);
