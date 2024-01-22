import React, { useContext, useEffect } from 'react';
import { ServiceOneContext } from './ServiceOneContext';
import { GlobalContext } from '../../Global/GlobalResources/GlobalContextWrapper';
import { Link } from 'react-router-dom';

export const ServiceOne = () => {
    const globalState = useContext(GlobalContext);
    const { globalCount, setGlobalCount } = globalState;

    const serviceOneState = useContext(ServiceOneContext);
    const { serviceOneCount, setServiceOneCount } = serviceOneState;

    return (
        <>
            The current Service One count is: {serviceOneCount}
            <br />
            <button onClick={() => setServiceOneCount(serviceOneCount - 1)}>
                -1
            </button>
            <button onClick={() => setServiceOneCount(serviceOneCount + 1)}>
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