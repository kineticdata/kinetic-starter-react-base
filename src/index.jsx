import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import '@toast-ui/editor/dist/toastui-editor.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { KineticLib, history as libHistory } from '@kineticdata/react';
import { App } from './App.jsx'
import { HashRouter } from 'react-router-dom';
import { ContextWrappers } from './Global/GlobalResources/ContextWrappers.jsx';

const globals = import('./Global/GlobalResources/globals.jsx');
export const history = libHistory;

ReactDOM.createRoot(document.getElementById('root')).render(
  // Kinetic connection layer
  <KineticLib globals={globals} locale="en">
      {kineticProps => (
        <HashRouter>
            {/* Complete list of Context wrappers */}
            <ContextWrappers>
              {/* Complete application */}
              <App {...kineticProps} />
            </ContextWrappers>
        </HashRouter>
      )}
    </KineticLib>
)
