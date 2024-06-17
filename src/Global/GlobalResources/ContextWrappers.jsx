import React from 'react';
import { GlobalContextWrapper } from './GlobalContextWrapper';

// Navigating out of a starter and then back in remounts the Conext component, resetting the data to default.
// In order for Context data to persist throughout the application (excepting full reloads) all context wrappers
// can be added to this file which will wrap App.js and provide all the context wrappers at a global level.
// This will persist any context data through any app navigation.

// Note: This will provide all context data to the entire app with the exception of other service contexts
// depending on the wrap order below.
export const ContextWrappers = ({children}) => (
    <GlobalContextWrapper>
        {/* Add other starter Context wrappers here */}
        {children}
    </GlobalContextWrapper>
)