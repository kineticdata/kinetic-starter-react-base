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
            <LoadingSpinner />
            <h1>Welcome to the Kinetic Data landing page</h1>
            <h2>{userProfile && userProfile.displayName}</h2>
            <h3>Happy Coding!</h3>
            <p>Your space is: {kineticSpace && kineticSpace.name}</p>
            <Link to='/service-one'>Service One</Link>
            <br />
            <Link to='/service-two'>Service Two</Link>
        </div>
    ) : <LoadingSpinner />
}