import React from 'react';
import { GlobalContextWrapper } from './GlobalContextWrapper';
//TODO: DO WE WANT TO DO THIS VS HAVING CONTEXT CONTAINED TO THE SERVICE? DATA WILL BE CLEARED NAVIGATING OUT AND INTO THE SERVICE

// Navigating out of a service and then back in remounts the conext component, resetting the data to default.
// In order for context data to persist throughout the application (excepting full reloads) all context wrappers
// should be added to this file which will wrap App.js and provide all the context wrappers at a global level.
// This will persist any context data through any app navigation.

// Note: This will provide all context data to the entire app with the exception of other service contexts
// depending on the wrap order below.
export const ContextWrappers = ({children}) => (
    <GlobalContextWrapper>
        {children}
    </GlobalContextWrapper>
)