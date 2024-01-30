import React, { useContext, useEffect } from 'react';
import { ServiceTwoContext } from './ServiceTwoContext';
import { GlobalContext } from '../../../Global/GlobalResources/GlobalContextWrapper';

export const ServiceTwoDisplay = () => {
    const globalState = useContext(GlobalContext);
    const { globalCount, setGlobalCount, updateBreadcrumbs } = globalState;

    const serviceTwoState = useContext(ServiceTwoContext);
    const { serviceTwoCount, setServiceTwoCount } = serviceTwoState;

    useEffect(() => {
        updateBreadcrumbs({ page: 'Service Two Display', path: '/service-two/display'});
    }, [])

    return (
        <>
            The current Service Two count is: {serviceTwoCount}
            <br />
            <button onClick={() => setServiceTwoCount(0)}>
                Reset
            </button>
            <br />
            The current Global count is: {globalCount}
            <br />
            <button onClick={() => setGlobalCount(0)}>
                Reset
            </button>
        </>
    );
}