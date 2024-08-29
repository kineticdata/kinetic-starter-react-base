import React, { useContext, useEffect, useMemo } from 'react';
import './Global/Assets/Styles/main.scss'
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getDesignTokens } from './Global/Assets/Theme/Theme';
import { Route, Routes } from 'react-router-dom';
import { LoadingSpinner } from './Global/GlobalComponents/Widgets/LoadingSpinner';
import { GlobalContext } from './Global/GlobalResources/GlobalContextWrapper';
import { Header } from './Global/GlobalComponents/Header/Header';
import { Login } from './Global/GlobalComponents/GlobalPages/StandalonePages/Login';
import { LandingPage } from './Global/GlobalComponents/GlobalPages/StandalonePages/LandingPage';
import { KineticPlatformRouting } from './Global/GlobalComponents/GlobalPages/KineticPlatformPages/KineticPlatformRouting';
import { Footer } from './Global/GlobalComponents/Footer';
import { BreadcrumbHandler } from './Global/GlobalComponents/Widgets/BreadcrumbHandler';

export const App = ({ initialized, loggedIn, loginProps, timedOut }) => {
  const globalState = useContext(GlobalContext);
  const { setIsAuthorized, kineticSpace, userProfile, breadcrumbs } = globalState;

  // TODO: Remove the bang from this to get correct theme
  // Developing in light mode right now
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const getTheme = getDesignTokens(!prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo(
    () =>
      createTheme(getTheme),
    [prefersDarkMode],
  );

  useEffect(() => {
    setIsAuthorized(loggedIn)
  }, [loggedIn])

  return (
    <Container 
      maxWidth={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100%',
        p: '0rem !important',
      }}
    >
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!initialized && <LoadingSpinner />}

      <Header space={kineticSpace} loggedIn={loggedIn} profile={userProfile} />
      <Container 
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: '0 5rem !important',
          // Minheight should be total header height + footer height
          minHeight: 'calc(100vh - 116px)'
        }}
      >

      {loggedIn &&
        <>
          {breadcrumbs && <BreadcrumbHandler />}
            <Routes>
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
                path='/kapps/*'
                element={<KineticPlatformRouting />}
                exact
              />
            </Routes>
        </>
      }

      </Container>
      <Footer />
      {!loggedIn && initialized &&
        <Login {...loginProps} />
      }
      {!initialized && timedOut && 
        <Login {...loginProps} />
      }
      </ThemeProvider>
      </Container> 
  )
}
