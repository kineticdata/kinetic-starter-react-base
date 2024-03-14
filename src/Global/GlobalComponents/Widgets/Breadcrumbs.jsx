import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../../GlobalResources/GlobalContextWrapper";
import { Link } from "react-router-dom";

export const Breadcrumbs = () => {
    const globalState = useContext(GlobalContext);
    const { breadcrumbs } = globalState;

    return (
        <div className="breadcrumb-wrapper">
            {breadcrumbs.map(crumb => {
                return (
                    <Link 
                        to={crumb.path} 
                        key={crumb.path}
                        className="breadcrumb-crumb link"
                    >
                        {crumb.page}
                    </Link>
                )
            })}
        </div>
    )
}