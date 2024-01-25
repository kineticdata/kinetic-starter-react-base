import React from "react";

// PageTitle is meant to be used on pages within the app-content-container
export const PageTitle = ({ title, subtext }) => (
    <div className='page-title-wrapper'>
        <div className="page-title">
            {title}
        </div>
        {subtext && 
            <div className="page-subtext">
                {subtext}
            </div>
        }
    </div>
);
