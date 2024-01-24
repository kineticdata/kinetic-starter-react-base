import React from "react";
import { Link } from "react-router-dom";

// KineticCard is a generic card for lists
// It will display an icon (if there is one), name and subtext
export const KineticCard = ({ title, icon, subtext, linkPath, cardClassname }) => {

    return (
        <Link to={linkPath} className={`kinetic-card-wrapper ${cardClassname}`}>
            <div className="kinetic-card-content">
                {icon && <div className={`la ${icon} kinetic-card-icon`} />}
                <div className="kinetic-card-title">
                    {title}
                </div>
                <div className="kinetic-card-subtext">
                    Last Updated: {subtext}
                </div>
            </div>
        </Link>
    );
};