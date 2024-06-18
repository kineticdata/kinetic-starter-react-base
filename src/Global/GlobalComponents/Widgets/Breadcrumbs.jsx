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
                    <>
                        <Link 
                            to={crumb.path} 
                            key={idx}
                            className="breadcrumb-crumb link"
                            >
                            {crumb.page}
                        </Link>
                        {idx !== breadcrumbs.length - 1 && <i class="las la-angle-right crumb-divider" />}
                    </>
                )
            })}
        </div>
    )
}