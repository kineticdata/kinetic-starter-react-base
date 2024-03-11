import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../../GlobalResources/GlobalContextWrapper';
import { LoadingSpinner } from '../../Widgets/LoadingSpinner';

export const LandingPage = () => {
    const globalState = useContext(GlobalContext);
    const { kineticSpace, userProfile, updateBreadcrumbs } = globalState;

    useEffect(() => {
        updateBreadcrumbs({ page: 'Home', path: '/'});
    }, [])

    return kineticSpace && userProfile ? (
        <div className='landing-page-wrapper'>
            This is the base Landing Page, which is not initially turned on. <br />
            To activate this page update the routing in App.js.
        </div>
    ) : <LoadingSpinner />
}