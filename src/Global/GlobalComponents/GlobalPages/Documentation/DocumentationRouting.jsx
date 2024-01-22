import React from "react";
import { Route, Routes } from 'react-router-dom';
import { DocumentationLanding } from "./DocumentationLanding";

export const DocumentationRouting = () => (
    <>
    <Routes>
        <Route  
            path='/'
            element={<DocumentationLanding  />}
        />
    </Routes>
    </>
)