import React from "react";
import { Route, Routes } from 'react-router-dom';
import { KappsList } from "./KappsList";
import { KappLanding } from "./KappLanding";
import { KappSubmissionsList } from "./KappSubmissionsList";
import { FormsList } from "./FormsList";
import { FormLanding } from "./FormLanding";
import { FormSubmissionsList } from "./FormSubmissionsList";
import { SubmissionLanding } from "./SubmissionLanding";
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
                path={':kappId'}
                element={<KappLanding />}
            />
            <Route  
                path={':kappId/submissions'}
                element={<KappSubmissionsList />}
                exact
            />
            <Route  
                path={':kappId/forms'}
                element={<FormsList />}
                exact
            />
            <Route  
                path={':kappId/forms/:formId'}
                element={<FormLanding />}
                exact
            />
            <Route  
                path={':kappId/forms/:formId/submissions'}
                element={<FormSubmissionsList />}
                exact
            />
            <Route  
                path={':kappId/forms/:formId/submissions/:submissionsId'}
                element={<SubmissionLanding />}
                exact
            />
            <Route  
                path={':kappId/forms/:formId/submissions/:submissionsId/edit'}
                element={<SubmissionEdit />}
                exact
            />
        </Routes>
    </>
);
