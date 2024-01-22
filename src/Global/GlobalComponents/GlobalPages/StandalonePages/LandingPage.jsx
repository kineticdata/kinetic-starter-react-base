import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../../GlobalResources/GlobalContextWrapper';
import { LoadingSpinner } from '../../Widgets/LoadingSpinner';

export const LandingPage = () => {
    const globalState = useContext(GlobalContext);
    const { kineticSpace, userProfile } = globalState;

    return kineticSpace && userProfile ? (
        <>
            <LoadingSpinner />
            <h1>Welcome to the Kinetic Data landing page</h1>
            <h2>{userProfile && userProfile.displayName}</h2>
            <h3>Happy Coding!</h3>
            <p>Your space is: {kineticSpace && kineticSpace.name}</p>
            <Link to='/service-one'>Service One</Link>
            <br />
            <Link to='/service-two'>Service Two</Link>
        </>
    ) : <LoadingSpinner />
}