import React, { useContext } from "react";
import { GlobalContext } from "../../GlobalResources/GlobalContextWrapper";
import { Link } from "react-router-dom";

export const Breadcrumbs = () => {
    const globalState = useContext(GlobalContext);
    const { breadcrumbs } = globalState;

    return (
        <div className="breadcrumb-wrapper">
            {breadcrumbs.map((crumb, idx) => {
                return (
                    <div key={idx} className="crumb-wrapper">
                        <Link 
                            to={crumb.path} 
                            className="breadcrumb-crumb link"
                            >
                            {crumb.page}
                        </Link>
                        {idx !== breadcrumbs.length - 1 && <i className="las la-angle-right crumb-divider" />}
                    </div>
                )
            })}
        </div>
    )
}