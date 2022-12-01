# Customer Project Default - Bundle: Adding a Custom Package

In order to create your own custom package, you will need to create a new package folder with the appropriate structure and files. This document will define the steps needed to get a new package up and running.

---

## Create the Package Directory and Folder Structure

First you will need to create a new directory inside `bundle/packages`. For the examples below we'll call it **portal** but you can name it whatever you want (if you use multiple words, use a dash instead of spaces).

Next you will need to create the below folders and files (the files can be empty for now; we'll populate them in later steps).

```shell
  .
  └─ portal
     ├─ src                     # Source code for the package
     │  ├─ assets               # Contains asset files
     │  │  ├─ images            # Contains any image assets used by the package
     │  │  └─ styles            # Contains styling for the package
     │  │     ├─ _temp.scss     # Example sass file for styling
     │  │     └─ master.scss    # Master sass file that exports all styling for the package
     │  ├─ components           # Contains React components that define the application UI
     │  ├─ redux                # Contains sagas and reducers for maintaining redux state
     │  │  ├─ modules           # Contains reducer files
     │  │  │  └─ app.js         # App reducer to sync state from app package
     │  │  ├─ sagas             # Contains saga files
     │  │  ├─ reducers.js       # Export of all reducers in the package
     │  │  ├─ sagas.js          # Export of all sagas in the package
     │  │  └─ store.js          # Redux store middleware setup
     │  ├─ App.js               # The App component rendered by the AppProvider
     │  └─ index.js             # The AppProvider component exported by this package
     └─ package.json            # Package configuration file
```

## Table of Contents

- [Package Configuration `portal/package.json`](#package-configuration)
- [Redux Store `portal/src/redux/store.js`](#redux-store)
- [Reducers `portal/src/redux/reducers.js`](#reducers)
- [Sagas `portal/src/redux/sagas.js`](#sagas)
- [App Reducer `portal/src/redux/modules/app.js`](#app-reducer)
- [Styling `portal/src/assets/styles/master.scss`](#styling)
- [App Components `portal/src/App.js`](#app-components)
- [App Provider `portal/src/index.js`](#app-provider)
- [Connecting the Custom Package into the Bundle](#connecting-the-custom-package-into-the-bundle)

## Package Configuration

#### `portal/package.json`

We'll need to configure the package and what dependencies we'll use. To start, you can copy the below configuration into the `package.json` file. Update the name to match your package's directory name. You can change the version if you'd like.

```json
{
  "name": "portal",
  "version": "0.1.0",
  "main:src": "./src/index.js",
  "dependencies": {
    "@kineticdata/bundle-common": "5.1.2",
    "@kineticdata/react": "5.1.2",
    "@reach/router": "git://github.com/kineticdata/router.git",
    "classnames": "^2.2.5",
    "immutable": "4.0.0-rc.9",
    "moment": "^2.29.4",
    "react": "^16.12.0",
    "react-dom": "^16.12.0",
    "react-redux": "^6.0.1",
    "reactstrap": "^7.1.0",
    "recompose": "^0.30.0",
    "redux": "^3.7.2",
    "redux-first-history": "^4.0.0-alpha.7",
    "redux-saga": "^0.16.0",
    "rudy-match-path": "^0.3.0"
  },
  "devDependencies": {
    "@react-workspaces/react-scripts": "^3.4.0-alpha-01"
  },
  "eslintConfig": {
    "extends": "react-app"
  }
}
```

You can add or change any dependencies based on your needs. You will need to verify the version numbers for all of the above dependencies to make sure you're using the same versions as other packages. This is especially important for the `@react-workspaces/react-scripts` dev dependency. You can compare the versions against those in the `package.json` file of the `app` package.

## Redux Store

#### `portal/src/redux/store.js`

The `store.js` file is where we will set up the redux store. It contains boilerplate code that requires very few modifications, so you can copy the below code into your file.

```js
import { createContext } from 'react';
import { connect as connectRedux } from 'react-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createReduxHistoryContext, reachify } from 'redux-first-history';
import { history } from '@kineticdata/react';
import reducers from './reducers';
import sagas from './sagas';

console.log('Configuring portal package redux store');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'PORTAL' })
  : compose;

const sagaMiddlware = createSagaMiddleware();

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer,
} = createReduxHistoryContext({ history });

export const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  composeEnhancers(applyMiddleware(routerMiddleware, sagaMiddlware)),
);

export const connectedHistory = reachify(createReduxHistory(store));

sagaMiddlware.run(sagas);

export const context = createContext(null);

export const connect = (
  mapStateToProps = null,
  mapDispatchToProps = null,
  mergeProps = null,
  options = {},
) =>
  connectRedux(mapStateToProps, mapDispatchToProps, mergeProps, {
    ...options,
    context,
  });
```

The only things you should update are the `console.log` statement and the `name` property in the `__REDUX_DEVTOOLS_EXTENSION_COMPOSE__` function argument to reflect your package name.

Each package in the bundle has its own redux store to allow the packages to be independent. To allow for this, each package defines its own `connect` function, which is exported from this `store.js` file. When using `connect`, make sure you import it from this file and not directly from `react-redux` as that would connect your file to a different redux store.

## Reducers

#### `portal/src/redux/reducers.js`

The `reducers.js` file is where you will hook your reducers into the redux state object. Copy the below code into your file, which will hook the `app` reducer (which we'll define later) into the state.

```js
import { reducer as app } from './modules/app';
//import sampleReducer from './modules/sample';

export default {
  app,
  // sample: sampleReducer,
};
```

The commented out code shows an example of how you would hook up a sample reducer to save state under the `sample` variable.

## Sagas

#### `portal/src/redux/sagas.js`

The `sagas.js` file is where you will connect your sagas to watch for actions defined with your reducers. Copy the below code into your file. It just provides the outline of how to connect the sagas, as we won't need any sagas initially.

```js
import { all } from 'redux-saga/effects';

// import { watchSample } from './sagas/sample';

export default function* () {
  yield all([
    // watchSample(),
  ]);
}
```

The commented out code shows an example of how you would hook up a sample saga watcher.

## App Reducer

#### `portal/src/redux/modules/app.js`

Each package requires a special app reducer whose purpose is to take the state passed into the `AppProvider` of this package from the `app` package, and store that same information in this package's redux state. Copy the below code into the `app.js` file to define this reducer.

```js
import { store } from '../store';

export const types = {
  SYNC_APP_STATE: 'SYNC_APP_STATE',
};

export const reducer = (state = {}, action) => {
  let newState = { ...state };
  if (action.type === types.SYNC_APP_STATE) {
    newState[action.payload.key] = action.payload.value;
  }
  // Conditional statement defining when the package has synced all of the
  // required state from the app package and is ready
  if (
    newState.space &&
    newState.kapp &&
    (newState.profile || newState.authenticated === false) &&
    newState.layoutSize
  ) {
    newState.ready = true;
  } else {
    newState.ready = false;
  }
  return newState;
};

export const syncAppState = ([key, value]) => {
  store.dispatch({ type: types.SYNC_APP_STATE, payload: { key, value } });
};
```

You can customize the conditional statement within this code that sets the package's ready variable, but shouldn't need to modify anything else. If your package will not be rendered via a kapp, then you should remove the `newState.kapp` part of the conditional as `kapp` will be null, and thus `ready` would never get set.

## Styling

#### `portal/src/assets/styles/master.scss`

The bundle uses Sass for defining styling, and uses Bootstrap v4 as the base. The `app` package loads all of the common styling, as well as each package's custom styles. The `master.scss` file in this package should contain any styling specific to this package..

Copy the below code into this file to initialize some styles that are scoped within a class. We will later set this class in the `AppProvider` so that it will get added to the `body` dom element when this package is loaded.

```scss
.package--portal {
  @import 'temp';
}
```

The sample above just imports a single `_temp.scss` file, but you can add more files to organize your styling however you'd like.

## App Components

#### `portal/src/App.js`

The `App.js` file will define the App component(s) that will be rendered by the `AppProvider`. These components will define the routes available inside your package.

You will typically create an `App` component, which renders the package for authenticated users, and a `PublicApp` component which renders the package for unauthenticated users (as some routes may not be available in one case or the other). If your package is meant to always be used by authenticated users, then you won't need `PublicApp`, and if it's always meant to be public, then you just need a single component.

First we'll add the necessary imports to the `App.js` file.

```js
import React from 'react';
import { Router, Redirect } from '@reach/router';
import { compose, lifecycle } from 'recompose';
import { connect } from './redux/store';
```

Next we'll create some dummy components just for testing. You'll want to replace these with the actual components once you start building out your package.

```js
const DummyHome = (props) => (
  <div className="container">
    <h1>Welcome to the Portal!</h1>
    <p>This is the home page.</p>
  </div>
);

const DummySidebar = (props) => (
  <div className="sidebar">
    <h4>Sidebar</h4>
    <p>This is the sidebar.</p>
  </div>
);

const DummyPublicHome = (props) => (
  <div className="container">
    <h1>Welcome to the Portal!</h1>
    <p>You should log in.</p>
  </div>
);
```

Lastly we'll create the `App` and `PublicApp` components.

```js
export const AppComponent = (props) => {
  return props.render({
    sidebar: (
      <Router>
        <DummySidebar path="*" />
      </Router>
    ),
    main: (
      <div className="package-layout package-layout--portal">
        <Router>
          <DummyHome path="/" />
        </Router>
      </div>
    ),
  });
};
const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};
export const App = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    // componentDidMount() {},
  }),
)(AppComponent);

export const PublicAppComponent = (props) => {
  return props.render({
    main: (
      <div className="package-layout package-layout--portal">
        <Router>
          <DummyPublicHome path="/" />
          <Redirect from="*" to={props.authRoute} noThrow />
        </Router>
      </div>
    ),
  });
};
const mapStateToPropsPublic = (state) => ({
  authRoute: state.app.authRoute,
});
export const PublicApp = compose(
  connect(mapStateToPropsPublic),
  lifecycle({
    // componentDidMount() {},
  }),
)(PublicAppComponent);
```

These components are very simple, and you will likely want to use connect data from state and maybe fetch data during lifecycle methods.

The `PublicApp` component also requires a `Redirect` from any undefined routes to the authentication path, which is retrieved from the redux state.

## App Provider

#### `portal/src/index.js`

The `index.js` file will export the default component used to render your new package. We refer to this component as the `AppProvider`. Copy the below code into your file.

```js
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { LocationProvider, Router } from '@reach/router';
import {
  CommonProvider,
  ModalFormContainer,
  ToastsContainer,
} from '@kineticdata/bundle-common';
import { is } from 'immutable';
import { connectedHistory, context, store } from './redux/store';
import { syncAppState } from './redux/modules/app';
import { App, PublicApp } from './App';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = { ready: false };
    // Listen to the local store to see if the embedded app is ready to be
    // re-rendered. Currently this just means that the required props have been
    // synced into the local store.
    this.unsubscribe = store.subscribe(() => {
      const ready = store.getState().app.ready;
      if (ready !== this.state.ready) {
        this.setState({ ready });
      }
    });
  }

  componentDidMount() {
    Object.entries(this.props.appState).forEach(syncAppState);
  }

  componentDidUpdate(prevProps) {
    Object.entries(this.props.appState)
      .filter(([key, value]) => !is(value, prevProps.appState[key]))
      .forEach(syncAppState);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      this.state.ready && (
        <Provider store={store} context={context}>
          <CommonProvider>
            <LocationProvider hashRouting history={connectedHistory}>
              <ToastsContainer duration={5000} />
              <ModalFormContainer />
              <Router>
                {this.props.appState.authenticated ? (
                  <App
                    render={this.props.render}
                    path={`${this.props.appState.location}/*`}
                  />
                ) : (
                  <PublicApp
                    render={this.props.render}
                    path={`${this.props.appState.location}/*`}
                  />
                )}
              </Router>
            </LocationProvider>
          </CommonProvider>
        </Provider>
      )
    );
  }

  // Functions for hiding/supressing parts of the default layout
  // static shouldHideHeader = props => false;
  // static shouldHideSidebar = props => false
  // static shouldSuppressSidebar = props => false

  // Used for matching pathname to display this AppProvider
  // Not used if package is set as Bundle Package of a Kapp
  static location = '/portal';

  // Set to true if package allows public (unauthenticated) routes
  static hasPublicRoutes = true;

  // Class that will be added to the body when this package is rendered
  static bodyClassName = 'package--portal';
}
```

The constructor and lifecycle methods handle the ready state, which will wait for the state data from the `app` package to be synced into this package (which is done via the `app` reducer we created earlier).

The render function will render the following simplified structure. The example code above renders either an `App` component or a `PublicApp` component based on whether the user is authenticated. If your package will always be public, or always require authentication, you will need to update that part to only render the appropriate component.

```shell
<Provider>                      # Redux Provider - Initializes redux state for the package
  <CommonProvider>              # @kineticdata/bundle-common - Initializes common library
    <LocationProvider>          # @reach/router - Initializes router for the package
      <ToastsContainer />       # @kineticdata/bundle-common - Creates view for toasts
      <ModalFormContainer />    # @kineticdata/bundle-common - Creates view for modals
      <Router>                  # @reach/router - Routing wrapper
        <App />                 # ./App.js - Renders the App when authenticated
        <PublicApp />           # ./App.js - Renders the App when not authenticated
      </Router>
    </LocationProvider>
  </CommonProvider>
</Provider>
```

Lastly, there are a few optional static variables that can be added.

- The `shouldHideHeader`, `shouldHideSidebar`, and `shouldSuppressSidebar` functions allow you to show/hide parts of the default layout based on the routes in your package. Each function receives `{ appLocation, authenticated, location, kapp }` as the argument and should return a boolean. The first two will completely hide the named components when true, and the third will default the sidebar to closed when true.

- The `location` variable must be set if your package is not going to be rendered via a Kapp. It defines the URL at which your package will be rendered. If you will be rendering your package via a Kapp, the location will be `/kapps/KAPP_SLUG`.

- The `hasPublicRoutes` variable should be set to `true` if your package allows for public routes. Otherwise the authentication code in the 'app' package will redirect unauthorized users to the login screen.

- The `bodyClassName` variable should be a string, which will be added as a class to the `body` dom element. This should be used in order to scope the styles within your package to only affect your package.

## Connecting the Custom Package into the Bundle

Now that we've created all the necessary files for a custom package, we need to connect that package into the bundle, so that it will be rendered.

First, we'll need to add the custom package as a dependency of the `app` package so that it can be imported into the `app` package. In `app/package.json`, add the following line to the dependencies object. Make sure the left hand side matches the name and the right hand side matches the version found in the `package.json` of the custom package.

```json
"portal": "0.1.0"
```

Then, we'll need to run `yarn install` from within the `bundle` directory, so that the package can be installed as a dependency. Once the install command completes, we'll need to update the `app` package to import the custom package.

In `app/src/assets/styles/masters.scss`, we'll need to import the `master.scss` file from the custom package. This should be added along with the imports from other packages, but before the imports of individual files from within the `app` package.

```scss
@import '~portal/src/assets/styles/master';
```

Lastly, we'll need to configure when the custom package should be rendered. In `app/src/App.js`, we'll need to import our new `AppProvider`.

```js
import PortalApp from 'portal';
```

Then we'll need to add the `PortalApp` to either the `BUNDLE_PACKAGE_PROVIDERS` or `STATIC_PACKAGE_PROVIDERS` variables in `app/src/App.js`.

- If you want your package to be connected to a Kapp, then you will want to add it to `BUNDLE_PACKAGE_PROVIDERS`. The key can be anything (typically the name of your package) and the value should be the imported component. Then, any Kapp that has a 'Bundle Package' Kapp attribute with a value matching the key will be rendered using the new package.

  - If adding the package as a Kapp package, you will need to define a Kapp with the appropriate 'Bundle Package' Kapp attribute to be able to render the custom package.

- If you want the package to not be related to a Kapp, then you will just need to add the imported component to the `STATIC_PACKAGE_PROVIDERS` array. You will then be able to access the package by going to the `location` URL you defined in the `AppProvider`.

  - If adding it as a static package, make sure that you remove the `newState.kapp` check in the conditional of the `portal/src/redux/modules/app.js` file. Otherwise, the ready state will never be true and you will just see a blank screen.

Now you just need to run `yarn start` to start the development server, and you should be able to access your custom package.
