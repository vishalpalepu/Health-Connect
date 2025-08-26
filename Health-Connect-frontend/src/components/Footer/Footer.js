import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="container">
      <footer className="d-flex justify-content-between align-items-center py-4 border-top">
        
        {/* Logo or Brand Name */}
        

        <div className="footer-brand">
          <a href="/" className="d-flex align-items-center link-body-emphasis text-decoration-none">
          <img className="logo"  src="logo1.png" alt="logoimage"></img>
            
          </a>
          <p className="text-body-secondary copy">copyright © 2024</p>
        </div>
        <div className="footer-section">
          <h5>ADMIN</h5>
          <ul className="nav flex-column">
          <Link to="/api/v1/Admin/login">
            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Admin Login</a></li>
            </Link>
          </ul>
        </div>

        {/* First Column */}
        <div className="footer-section">
          <h5>INFO</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2 tag1"><a href="#" className="nav-link p-0 text-body-secondary">Medical articles</a></li>
            <li className="nav-item mb-2 tag1"><a href="#" className="nav-link p-0 text-body-secondary">Medical Q&A</a></li>
          </ul>
        </div>

        {/* Second Column */}
        <div className="footer-section">
          <h5>Explore</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2 tag1"><a href="#" className="nav-link p-0 text-body-secondary " >About us</a></li>
            <li className="nav-item mb-2 tag1"><a href="#" className="nav-link p-0 text-body-secondary"  >Contact us</a></li>
            
          </ul>
        </div>

        {/* Third Column */}
        <div className="footer-section">
          <h5>Our Platforms</h5>
          <ul className="nav flex-column">
         
            <li className="nav-item mb-2" ><a href="#" className="nav-link p-0 text-body-secondary"><i class="bi bi-instagram"></i></a></li>
            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary"><i class="bi bi-twitter"></i></a></li>
            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary"><i class="bi bi-linkedin"></i></a></li>
            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary"><i class="bi bi-facebook"></i></a></li>
            
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
