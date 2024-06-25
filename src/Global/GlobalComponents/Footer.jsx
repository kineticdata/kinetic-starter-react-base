import React from "react";
import logo from '../Assets/Images/Kinetic-logo-white.svg'

export const Footer = () => (
    <div className="footer-wrapper">
        <a href='https://kineticdata.com/' target='_blank' aria-label="A link to the homepage.">
            <img src={logo} className="kd-logo" alt="Logo" />
        </a>
    </div>
);
