import React from "react";

// PageTitle is meant to be used on pages within the app-content-container
// The rightSide argument should be passed in as it's own component.
export const PageTitle = ({ title, subtext, rightSide }) => (
    <div className='page-title-wrapper'>
        <>
            <div className="page-title">
                {title}
            {subtext && 
                <>
                    {subtext}
                </>
            }
            </div>
        </>
        <>
            {rightSide && rightSide}
        </>
    </div>
);
