import React, { useContext, useEffect, useState } from 'react';
import './Global/Assets/Styles/master.scss'
import 'font-awesome/css/font-awesome.css';
import { Route, Routes } from 'react-router-dom';
import {  LoadingSpinner } from './Global/GlobalComponents/Widgets/LoadingSpinner';
import { GlobalContext } from './Global/GlobalResources/GlobalContextWrapper';
import { Header } from './Global/GlobalComponents/Header';
import { fetchSubmission } from '@kineticdata/react';
import { LandingPage } from './Global/GlobalComponents/GlobalPages/StandalonePages/LandingPage';
import { ServiceOneRouting } from './KineticServices/ServiceOne/ServiceOneRouting';
import { ServiceTwoRouting } from './KineticServices/ServiceTwo/ServiceTwoRouting';
import { Profile } from './Global/GlobalComponents/GlobalPages/StandalonePages/Profile';
import { Login } from './Global/GlobalComponents/GlobalPages/StandalonePages/Login';
import { KineticPlatformRouting } from './Global/GlobalComponents/GlobalPages/KineticPlatformPages/KineticPlatformRouting';
import { DocumentationRouting } from './Global/GlobalComponents/GlobalPages/Documentation/DocumentationRouting';

export const App = ({ initialized, loggedIn, loginProps, timedOut }) => {
  // access the global state Context
  const globalState = useContext(GlobalContext);
  const { setIsAuthorized, kineticSpace, userProfile, isAuthorized } = globalState;
  const [ submission, setSubmission ] = useState();

  useEffect(() => {
    setIsAuthorized(loggedIn)
  }, [loggedIn])

  // useEffect(() => {
  //   if (isAuthorized) {
  //     const id = '2fdcbcda-8333-11ee-8862-3543e0450d59';
  //     const include = 'details,values';
  //     fetchSubmission({id, include}).then(response => {
  //       setSubmission(response.submission)
  //     }).catch(error => console.log('ERROR: ', error));
  //   }
  // }, [])

  // console.log('OPE', submission)

  return (
    <div className='app-container'>
      {!initialized && <LoadingSpinner />}

      {/* Components should wait until all necessary data is loaded before rendering */}
      {loggedIn &&
        <main>
          {/* Header will always be shown */}
          <Header space={kineticSpace} loggedIn={loggedIn} profile={userProfile} />
          
          {/* Add base routes and Primary Service routes here */}
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
            <Route  
              path='/profile'
              element={<Profile />}
              exact
            />
            <Route  
              path='/documentation/*'
              element={<DocumentationRouting />}
              exact
            />
            <Route  
              path='/kapps/*'
              element={<KineticPlatformRouting />}
              exact
            />


            {/* Optional service routes */}
            <Route  
              path='/service-one/*'
              element={<ServiceOneRouting />}
            />
            <Route  
              path='/service-two/*'
              element={<ServiceTwoRouting />}
            />
          </Routes>
        </main> 
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
    </div>
  )
}
