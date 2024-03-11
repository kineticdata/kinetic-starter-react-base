import React from "react";
import { Route, Routes } from 'react-router-dom';
import { KappsList } from "./KappsList";
import { KappLanding } from "./KappLanding";
import { KappSubmissionsList } from "./KappSubmissionsList";
import { FormsList } from "./FormsList";
import { FormLanding } from "./FormLanding";
import { FormSubmissionsList } from "./FormSubmissionsList";
import { KappSubmissionLanding } from "./KappSubmissionLanding";
import { SubmissionEdit } from "./SubmissionEdit";

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
                exact
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
                element={<KappSubmissionLanding />}
                exact
            />
            <Route  
                path={':kappSlug/forms/:formSlug/submissions/:submissionsId/edit'}
                element={<SubmissionEdit />}
                exact
            />
        </Routes>
    </>
);
