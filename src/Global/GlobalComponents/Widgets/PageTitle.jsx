import React from "react";

// PageTitle is meant to be used on pages within the app-content-container
// The link argument should be passed in as it's own component.
export const PageTitle = ({ title, subtext, rightSide }) => (
    <div className='page-title-wrapper'>
        <>
            <div className="page-title">
                {title}
            </div>
            {subtext && 
                <div className="page-subtext">
                    {subtext}
                </div>
            }
        </>
        <>
            {rightSide && rightSide}
        </>
    </div>
);
