import React, { useContext } from 'react';
import { ServiceOneContext } from './ServiceOneContext';
import { GlobalContext } from '../../../Global/GlobalResources/GlobalContextWrapper';

export const ServiceOneDisplay = () => {
    const globalState = useContext(GlobalContext);
    const { globalCount, setGlobalCount } = globalState;

    const serviceOneState = useContext(ServiceOneContext);
    const { serviceOneCount, setServiceOneCount } = serviceOneState;

    return (
        <>
            The current Service One count is: {serviceOneCount}
            <br />
            <button onClick={() => setServiceOneCount(0)}>
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