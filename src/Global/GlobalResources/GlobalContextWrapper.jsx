import { createContext, useEffect, useMemo, useState } from 'react';
import { fetchProfile, fetchSpace } from '@kineticdata/react';

// Create the context for use
export const GlobalContext = createContext({});

export function GlobalContextWrapper({children}) {
    // Create any static variables needed for the state
    // Be sure to define your default values here or update them in this component
    const [ isAuthorized, setIsAuthorized ] = useState(false);
    const [ userProfile, setUserProfile ] = useState(null);
    const [ kineticSpace, setKineticSpace ] = useState(null);
    const [ breadcrumbs, setBreadcrumbs ] = useState([]);
    const [ isMobileDevice, setIsMobileDevice ] = useState(false);
    const [ tableQuery, setTableQuery ] = useState();
    const [ tablePagination, setTablePagination ] = useState({nextPageToken: null, previousPageToken: [], pageToken: undefined});

    const handleScreenResize = () => {
        if (window.innerWidth <= 1366) {
            setIsMobileDevice(true);
        } else {
            setIsMobileDevice(false);
        }
    };

    // Checks initial screen size
    useEffect(() => {
        if (window.innerWidth <= 1366) {
            setIsMobileDevice(true);
        }
    }, [])

    // Handle the view window being resized
    useEffect(() => {
        window.addEventListener('resize', handleScreenResize);
        return () => {
            window.removeEventListener('resize', handleScreenResize);
        }
    }, [])
    
    // Retreive space and user data for global use
    useEffect(() => {
        if(isAuthorized) {
            fetchSpace().then(({space, error}) => !error ? setKineticSpace(space) : setError(error))
            fetchProfile({ include: 'authorization' }).then(({profile, error}) => !error ? setUserProfile(profile) : setError(error))
        }
    }, [isAuthorized]);

    // Set navigation breadcrumbs
    // By default breadcrumbs are hierarchical
    const updateBreadcrumbs = crumbData => {
        if (crumbData) {
            let pathComponents = crumbData.path.split('/');
            let breadcrumbsArr = [];
            let tmpPath = '';
    
            pathComponents.forEach((component, index) => {
                tmpPath = tmpPath + component + '/';
                let tmpName = ''
                
                if (index == 0) {
                    tmpName = "Home";
                } else if (crumbData.pageNames && crumbData.pageNames.length > 0) {
                    tmpName = crumbData.pageNames[index-1];
                }
    
                breadcrumbsArr.push({
                    page: tmpName || component,
                    path: tmpPath.substring(0, tmpPath.length - 1)
                })
            });
            
            setBreadcrumbs(breadcrumbsArr);
        } else {
            setBreadcrumbs(null);
        }

        // Below is logic for a history based breadcrumb to replace above code if desired
        // if (!breadcrumbs.map(currentCrumbs => currentCrumbs.page).includes(crumb.page)) {
        //     setBreadcrumbs([...breadcrumbs.slice(Math.max(breadcrumbs.length - 4, 0)), crumb]);
        // } else {
        //     const crumbIndex = breadcrumbs.map(
        //         currentCrumbs => currentCrumbs.page).indexOf(crumb.page)
        //     let splicedArray = breadcrumbs;
        //     splicedArray.splice(crumbIndex, 1);
        //     setBreadcrumbs([...splicedArray.slice(Math.max(splicedArray.length - 4, 0)), crumb])
        // }
    };
    
    // Create the default object for this context
    // useMemo is recommended for performance
    const GlobalContextData = useMemo(() => ({
        // GlobalContextData values
            isAuthorized,
            userProfile,
            kineticSpace,
            breadcrumbs,
            isMobileDevice,
            tableQuery,
            tablePagination,
        // GlobalContextData functions
            setIsAuthorized,
            setUserProfile,
            setKineticSpace,
            updateBreadcrumbs,
            setTableQuery,
            setTablePagination
        // Make sure all values are added to the deps so that GlobalContextData is refreshed when they change
    }), [
        isAuthorized, 
        userProfile, 
        kineticSpace, 
        breadcrumbs, 
        isMobileDevice, 
        tableQuery,
        tablePagination,
    ]);
    
    // Pass all children through, now imbued with Context access
    return (
        <GlobalContext.Provider value={GlobalContextData}>
            {children}
        </GlobalContext.Provider>
    );
}
