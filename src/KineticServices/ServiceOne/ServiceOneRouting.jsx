import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ServiceOne } from './ServiceOne/ServiceOne';
import { ServiceOneDisplay } from './ServiceOne/ServiceOneDisplay';

export const ServiceOneRouting = () => {
    // Base level service folders will have a routing file for this service alone
    // Add the route for this component to the App.jsx file and the remaining routing will be handled here

    return (
        <>
            <Routes>
                <Route  
                    path={`display`}
                    element={<ServiceOneDisplay />}
                    />
                <Route  
                    path='/'
                    element={<ServiceOne  />}
                    />
            </Routes>
        </>
    );
}