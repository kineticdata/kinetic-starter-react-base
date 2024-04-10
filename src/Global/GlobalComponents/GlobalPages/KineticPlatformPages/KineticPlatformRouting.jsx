import React from "react";
import { Route, Routes } from 'react-router-dom';
import { KappsList } from "./KappsList";
import { KappLanding } from "./KappLanding";
import { FormsList } from "./FormsList";
import { FormLanding } from "./FormLanding";
import { FormSubmissionsList } from "./FormSubmissionsList";
import { SubmissionLanding } from "./SubmissionLanding";
import { KappSubmissionsList } from "./KappSubmissionsList";

// This component will handle routing for the base Kinetic bundle routes
export const KineticPlatformRouting = () => (
    <>
        <Routes>
            <Route  
                path='/'
                element={<KappsList  />}
            />
            <Route  
                path={':kappSlug'}
                element={<KappLanding />}
            />
            <Route  
                path={':kappSlug/submissions'}
                element={<KappSubmissionsList />}
            />
            <Route  
                path={':kappSlug/forms'}
                element={<FormsList />}
                exact
            />
            <Route  
                path={':kappSlug/forms/:formSlug'}
                element={<FormLanding />}
                exact
            />
            <Route  
                path={':kappSlug/forms/:formSlug/submissions'}
                element={<FormSubmissionsList />}
                exact
            />
            <Route  
                path={':kappSlug/forms/:formSlug/submissions/:submissionsId'}
                element={<SubmissionLanding />}
                exact
            />
        </Routes>
    </>
);
