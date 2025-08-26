import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header.js";

import FrontPage from "./FrontPage.js";
import Admin from "./Admin/Admin.js";
import Patient from "./Patient/Patient.js";
import Doctor from "./Doctor/Doctor.js";
import DoctorRegister from "./Doctor/DoctorRegister.js";
import PatientRegister from "./Patient/PatientRegister.js";
import Footer from "./Footer/Footer.js";
import NavBar from "./NavBar.js";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <FrontPage />
                <Footer />
              </div>
            }
          />
          <Route path="/api/v1/Admin/login" element={<Admin />} />
          <Route path="/api/v1/Doctor/login" element={<Doctor />} />
          <Route path="/api/v1/Patient/login" element={<Patient />} />
          <Route path="/api/v1/Doctor/register" element={<DoctorRegister />} />
          <Route
            path="/api/v1/Patient/register"
            element={<PatientRegister />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
