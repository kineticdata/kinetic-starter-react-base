import React, { useContext, useEffect } from 'react';
import { ServiceTwoContext } from './ServiceTwoContext';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../../Global/GlobalResources/GlobalContextWrapper';

export const ServiceTwo = () => {
    const globalState = useContext(GlobalContext);
    const { globalCount, setGlobalCount, updateBreadcrumbs } = globalState;

    const serviceTwoState = useContext(ServiceTwoContext);
    const { serviceTwoCount, setServiceTwoCount } = serviceTwoState;

    useEffect(() => {
        updateBreadcrumbs({ page: 'Service Two', path: '/service-two'});
    }, [])

    return (
        <>
            The current Service Two count is: {serviceTwoCount}
            <br />
            <button onClick={() => setServiceTwoCount(serviceTwoCount - 1)}>
                -1
            </button>
            <button onClick={() => setServiceTwoCount(serviceTwoCount + 1)}>
                +1
            </button>
            <br />

            The current Global count is: {globalCount}
            <br />
            <button onClick={() => setGlobalCount(globalCount - 1)}>
                -1
            </button>
            <button onClick={() => setGlobalCount(globalCount + 1)}>
                +1
            </button>
            <br />
            <Link to={`display`}>
                Count Display
            </Link>
        </>
    );
}