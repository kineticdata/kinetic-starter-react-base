import React, { useContext, useEffect } from 'react';
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';
import './Global/Assets/Styles/master.css'
import { Route, Routes } from 'react-router-dom';
import { LoadingSpinner } from './Global/GlobalComponents/Widgets/LoadingSpinner';
import { GlobalContext } from './Global/GlobalResources/GlobalContextWrapper';
import { Header } from './Global/GlobalComponents/Header';
import { Login } from './Global/GlobalComponents/GlobalPages/StandalonePages/Login';
import { LandingPage } from './Global/GlobalComponents/GlobalPages/StandalonePages/LandingPage';
import { KineticPlatformRouting } from './Global/GlobalComponents/GlobalPages/KineticPlatformPages/KineticPlatformRouting';
import { Footer } from './Global/GlobalComponents/Footer';
import { Breadcrumbs } from './Global/GlobalComponents/Widgets/Breadcrumbs';

export const App = ({ initialized, loggedIn, loginProps, timedOut }) => {
  // access the global state Context
  const globalState = useContext(GlobalContext);
  const { setIsAuthorized, kineticSpace, userProfile, breadcrumbs } = globalState;

  useEffect(() => {
    setIsAuthorized(loggedIn)
  }, [loggedIn])

  return (
    <>
      {!initialized && <LoadingSpinner />}

      {loggedIn &&
        <div className='app-container'>
          {/* Header will always be shown */}
          <Header space={kineticSpace} loggedIn={loggedIn} profile={userProfile} />
          
          {/* Add base routes and starter routes here */}
          <div className='app-content-container'>
          {breadcrumbs && <Breadcrumbs />}
            <Routes>
              {/* Base level routing */}
              <Route  
                path='/'
                element={<LandingPage />}
                exact
              />
              <Route  
                path='/login'
                element={<Login {...loginProps} />}
                exact
              />

              {/* Kapps should be used as the example of contained routing for additonal starters */}
              <Route  
                path='/kapps/*'
                element={<KineticPlatformRouting />}
                exact
              />
            </Routes>
          </div>

          <Footer />
        </div> 
      }
      {!loggedIn && initialized &&
        <main>      
          <Login {...loginProps} />
        </main>
      }
      {!initialized && timedOut && 
        <dialog open>
          <Login {...loginProps} />
        </dialog>
      }
    </>
  )
}
