import React from "react";

export const ErrorDisplay = ({error}) => {
// Console log the error being returned 
    console.log('The following error has ocurred:', `\n`, `\n`, error);

    return (
        <div className="error-page-wrapper">
            Oops! <br />
            Something went wrong on this page, <br />
            if the problem persists please contact your administrator.
        </div>
    )
}