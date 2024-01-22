import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { KineticLib, history as libHistory } from '@kineticdata/react';
import * as LayoutComponents from './Global/GlobalResources/Layouts.jsx';
import { EmptyBodyRow } from './Global/GlobalResources/Layouts.jsx';
import { App } from './App.jsx'
import { HashRouter } from 'react-router-dom';
import { ContextWrappers } from './Global/GlobalResources/ContextWrappers.jsx';


const globals = import('./Global/GlobalResources/globals.jsx');
export const history = libHistory;

ReactDOM.createRoot(document.getElementById('root')).render(
  // Kinetic connection layer
  <KineticLib components={{ ...LayoutComponents, EmptyBodyRow }} locale="en">
      {kineticProps => (
        <HashRouter>
            {/* See the ContextWrappers file for a description */}
            <ContextWrappers>
              {/* Complete application */}
              <App globals={globals} {...kineticProps} />
            </ContextWrappers>
        </HashRouter>
      )}
    </KineticLib>
)
