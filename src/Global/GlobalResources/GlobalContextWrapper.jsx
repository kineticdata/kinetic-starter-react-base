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
    const [ breadcrumbs, setBreadcrumbs ] = useState([]);
    
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

    // If the page has not been visited add the crumb to the end of the current crumbs list
    // Otherwise remove the newest crumb from the existing array and add it at the end
    // The slice() used in setBreadcrumbs() limits the breadcrumbs displayed to a max of 5
    //TODO: Should breadcurumbs be saved in local storage for customers?
    const updateBreadcrumbs = crumb => {
        if (!breadcrumbs.map(currentCrumbs => currentCrumbs.page).includes(crumb.page)) {
            setBreadcrumbs([...breadcrumbs.slice(Math.max(breadcrumbs.length - 4, 0)), crumb]);
        } else {
            const crumbIndex = breadcrumbs.map(
                currentCrumbs => currentCrumbs.page).indexOf(crumb.page)
            let splicedArray = breadcrumbs;
            splicedArray.splice(crumbIndex, 1);
            setBreadcrumbs([...splicedArray.slice(Math.max(splicedArray.length - 4, 0)), crumb])
        }
    };

    
    // Create the default object for this context
    // useMemo is recommended for performance enhancement
    const GlobalContextData = useMemo(() => ({
        // GlobalContextData values
            globalCount,
            isAuthorized,
            theme,
            userProfile,
            kineticSpace,
            breadcrumbs,
        // GlobalContextData functions
            setGlobalCount,
            setIsAuthorized,
            setTheme,
            setUserProfile,
            setKineticSpace,
            updateBreadcrumbs
        // Make sure all values are added to the deps so that GlobalContextData is refreshed when they change
    }), [isAuthorized, theme, userProfile, kineticSpace, globalCount, breadcrumbs]);
    
    // Since this is just a state data wrapper simply pass any children through
    return (
        <GlobalContext.Provider value={GlobalContextData}>
            {children}
        </GlobalContext.Provider>
    );
}
