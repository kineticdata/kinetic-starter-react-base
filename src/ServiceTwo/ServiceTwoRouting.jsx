import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ServiceTwo } from './ServiceTwo/ServiceTwo';
import { ServiceTwoContextWrapper } from './ServiceTwo/ServiceTwoContext';
import { ServiceTwoDisplay } from './ServiceTwo/ServiceTwoDisplay';

export const ServiceTwoRouting = () => {
    // Base level service folders will have a routing file for this service alone
    // Add the route for this component to the App.jsx file and the remaining routing will be handled here

    return (
        <>
            <Routes>
                <Route  
                    path={`display`}
                    element={<ServiceTwoDisplay />}
                    />
                <Route  
                    path='/'
                    element={<ServiceTwo />}
                    />
            </Routes>
        </>
    );
}