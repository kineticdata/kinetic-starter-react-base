import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";

export const Profile = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;

    useEffect(() => {
        updateBreadcrumbs({ page: 'Profile', path: '/profile'});
    }, [])

    return (
        <>
            This is the profile page.
        </>
    );
}