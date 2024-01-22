import React, { useContext } from 'react';
import { ServiceTwoContext } from './ServiceTwoContext';
import { GlobalContext } from '../../../Global/GlobalResources/GlobalContextWrapper';

export const ServiceTwoDisplay = () => {
    const globalState = useContext(GlobalContext);
    const { globalCount, setGlobalCount } = globalState;

    const serviceTwoState = useContext(ServiceTwoContext);
    const { serviceTwoCount, setServiceTwoCount } = serviceTwoState;

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