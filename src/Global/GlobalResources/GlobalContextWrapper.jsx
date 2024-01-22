import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchProfile, fetchSpace } from '@kineticdata/react';

// Create the context for use
export const GlobalContext = createContext({});

export function GlobalContextWrapper({children}) {
    // Create any static variables needed for the state
    // Be sure to define your default values here or update them in this component
    const [ isAuthorized, setIsAuthorized ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ userProfile, setUserProfile ] = useState(null);
    const [ kineticSpace, setKineticSpace ] = useState(null);
    const [ theme, setTheme ] = useState('light');
    const [ globalCount, setGlobalCount ] = useState(0);
    
    // In the event that the entire context requires a data call it can be done here
    useEffect(() => {
        if(isAuthorized) {
            // Requests the space and user profile then updates the GlobalContext
            const userDataRequest = async () => {
                const spaceResponse = await fetchSpace();
                const profileResponse = await fetchProfile({ include: 'authorization' });
                setKineticSpace(spaceResponse.space);
                setUserProfile(profileResponse.profile);
              };
              userDataRequest().catch(setError(error));
        }
    }, [isAuthorized]);

    // Functions can also be passed into the context 
    // useCallback is recommended for performance enhancement
    const exampleFunction = useCallback(() => {
        // Logic goes here
    }, [])

    
    // Create the default object for this context
    // useMemo is recommended for performance enhancement
    const GlobalContextData = useMemo(() => ({
        // GlobalContextData values
            globalCount,
            isAuthorized,
            theme,
            userProfile,
            kineticSpace,
        // GlobalContextData functions
            setGlobalCount,
            setIsAuthorized,
            setTheme,
            setUserProfile,
            setKineticSpace,
            exampleFunction
        // Make sure all values are added to the deps so that GlobalContextData is refreshed when they change
    }), [isAuthorized, theme, userProfile, kineticSpace, globalCount]);

    const GlobalContextData2 = {
        // GlobalContextData values
            globalCount,
            isAuthorized,
            theme,
            userProfile,
            kineticSpace,
        // GlobalContextData functions
            setGlobalCount,
            setIsAuthorized,
            setTheme,
            setUserProfile,
            setKineticSpace,
            exampleFunction
        // Make sure all values are added to the deps so that GlobalContextData is refreshed when they change
    }
    
    // Since this is just a state data wrapper simply pass any children through
    return (
        <GlobalContext.Provider value={GlobalContextData}>
            {children}
        </GlobalContext.Provider>
    );
}
