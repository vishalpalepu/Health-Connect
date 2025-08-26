import React from "react";
import "./NavBar.css"; // Ensure your CSS file is properly imported

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary main-nav nav1">
      <div className="container-fluid nav">
        <a className="navbar-brand" href="#">
          <img className="logo"  src="logo1.png" alt="logoimage"></img>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse content"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ul">
            <li className="nav-item">
              <a className="nav-link items" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link items" href="#">
                Contact Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link items" href="#">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link items" href="#">
                Articles
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link items" href="#">
                Medical Q/A
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;