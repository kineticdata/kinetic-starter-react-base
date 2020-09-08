# Customer Project Default - Bundle

This project is the default implementation, and custom starting point, for Kinetic bundles built with [React](https://reactjs.org/). This README will explain how to get started with bundle development.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Requirements](#requirements)
  - [Node](#node) | [Yarn](#yarn)
- [Starting the Development Server](#starting-the-development-server)
- [Scripts](#scripts)
  - [`install`](#yarn-install) | [`clean`](#yarn-clean) | [`start`](#yarn-start) | [`build`](#yarn-build) | [`test`](#yarn-test) | [`format`](#yarn-format) | [`lint`](#yarn-lint)
- [How the App Package Works](#how-the-app-package-works)
  - [Folder Structure](#folder-structure) | [Rendering Flow](#rendering-flow) | [Global Libraries](#global-libraries)
- [How the Components Package Works](#how-the-components-package-works)
- [Adding a Custom Package](#adding-a-custom-package)
- [Customizing a Pre-Built Kinetic Package](#customizing-a-pre-built-kinetic-package)

## Prerequisites

This bundle is built as a React application, and thus requires working knowledge of React development in order to be able to make customizations. Below is a list of some of the libraries and technologies this bundle uses, which you should become familiar with to better understand the bundle code.

- [React](https://reactjs.org/) `User interface framework`
- [Redux](https://redux.js.org/) `Predictable state container`
- [React-Redux](https://react-redux.js.org/) `Official react bindings for redux`
- [Redux-Saga](https://redux-saga.js.org/) `Redux middleware for handling side effects`
- [React Router](https://reactrouter.com/) `Comprehensive routing library for react`
- [Reach Router](https://reach.tech/router/) `Simple router for react with relative paths (will be deprecated when React Router v6 is available)`
- [Recompose](https://github.com/acdlite/recompose) `Helper library for functional and higher-order components`
- [Immutable](https://immutable-js.github.io/immutable-js/) `Persistent, immutable data structures`
- [Sass](https://sass-lang.com/) `Stylesheet extension language`

## Requirements

For development, you will need Node.js (v12.x or v14.x) and a node global package, Yarn, installed in your environment.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

  ```shell
  $ sudo apt install nodejs
  $ sudo apt install npm
  ```

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

```shell
$ node --version
v12.14.1

$ npm --version
6.13.4
```

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

```shell
$ npm install npm -g
```

### Yarn

After installing node, this project will need yarn too, so just run the following command.

```shell
$ npm install -g yarn
```

## Starting the Development Server

The bundle includes functionality for running a local development server that can be configure to connect to any Kinetic Request CE server. Once started, you will be able to make local code changes and see them live.

First, you need to setup your Kinetic Request CE server to allow your local development server to connect to it.

- In the Kinetic Management Console > Space Settings Page > OAuth Tab, you will need to add an OAuth Client with the below details.
  ```
  Name            ->    Kinetic Bundle - Dev
  Description     ->    oAuth Client for client-side bundles in development mode
  Client ID       ->    kinetic-bundle-dev
  Client Secret   ->    <any value>
  Redirect URI    ->    http://localhost:3000/app/oauth/callback
  ```
- In the Kinetic Management Console > Space Settings Page > Security Tab, you will need to add the below trusted domains.
  ```
  Trusted Resource Domain   ->    http://localhost:3000
  Trusted Frame Domain      ->    localhost:3000
  ```

Then, from a command line open inside the `bundle` directory, run the below commands to install all of the bundle dependencies and then start the development server.

```shell
$ yarn install
$ yarn start
```

Upon `start`, you will be prompted to enter the URL of the Kinetic Request CE server that you want to connect to. This server URL will be saved in the `packages\app\.env.development.local` file, and can be edited in there to connect to a different server in the future. _It's important that the url doesn't end in a `/` or the start process will fail._

Once the development server starts up, you can access it at [http://localhost:3000](http://localhost:3000). Any changes you make to your local code will then automatically cause the server to reload with your new changes.

## Scripts

#### `yarn install`

Installs all of the dependencies for the entire monorepo.

#### `yarn clean`

Removes all `node_modules` directories within the entire monorepo.

#### `yarn start`

Starts the app in development mode.  
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

#### `yarn build`

Builds the app for production to the `packages/app/build` folder.

#### `yarn test`

Runs the tests.

#### `yarn format`

Runs prettier on all the packages.

#### `yarn lint`

Runs lint on all the packages.

## How the App Package Works

The app package is the entry point to the bundle application, and in turn renders the other packages as needed. All of the above scripts (when run in the `bundle` directory) actually trigger the same corresponding scripts in this app package.

The app package has the following main duties.

1.  Handles authentication.
1.  Fetches global data needed by all packages.
1.  Renders the appropriate package's `AppProvider` based on the current URL.
1.  Defines the default `AppProvider`.

### Folder Structure

```shell
  .
  ├─ node_modules              # Contains installed dependencies for this package - created when you run 'yarn install'
  ├─ build                     # Contains the built bundle application - created when you run 'yarn build'
  ├─ public                    # Contains the HTML file that will render the application
  │  └─ index.html
  ├─ src                       # Contains the package source code
  │  ├─ assets                 # Contains image, font, and sass files
  │  ├─ components             # Contains React components that define the application UI
  │  ├─ lib                    # Contains custom, non-react libraries needed for Kinetic form s
  │  ├─ redux                  # Contains sagas and reducers for maintaining redux state
  │  ├─ App.js                 # The React entry point component
  │  ├─ AppProvider.js         # Default content renderer component
  │  ├─ globals.js             # Library imports to load before Kinetic forms are rendered
  │  ├─ index.js               # The JavaScript entry point
  │  ├─ setupEnv.js            # Setup code for environment variable overrides
  │  ├─ setupProxy.js          # Setup code for proxying
  │  └─ setupTests.js          # Setup code for tests
  ├─ .env.development          # Defines development environment variables
  ├─ .env.development.local    # Defines development environment variable overrides - created when you first run 'yarn start'
  ├─ .env.production           # Defines production environment variables
  └─ package.json              # Package configuration file
```

### Rendering Flow

The `src/index.js` file is executed first, and contains the JavaScript that renders the React application. Below is a simplified structure of the components it renders.

```shell
<Provider>                # Redux Provider - Initializes redux state for the package
  <KineticLib>            # @kineticdata/react - Enables the Kinetic react wrapper library
    <ConnectedRouter>     # React Router - Initializes routing for the package
      <Authentication>    # ./components/authentication/Authentication.js - Handles authentication
        <App />           # ./App.js - Renders React entry point component
      </Authentication>
    </ConnectedRouter>
  </KineticLib>
</Provider>
```

The `KineticLib` component wraps the bundle code to initialize the `@kineticdata/react` helper library, that provides a consistent Kinetic API wrapper, authentication logic, and components that can be used within the bundle for rendering Kinetic forms, translating text, and much more.

The `src/components/authentication/Authentication.js` file handles rendering the login components when appropriate. The authentication logic and state is handled by `@kineticdata/react`.

The `src/App.js` file is the React component responsible for rendering the bundle functionality.

- First, it calls the `fetchApp` redux action, which will retrieve data needed by the entire application _(e.g. space details, kapps list, user details, etc.)_. This data will be passed into every other package so that those packages don't need to refetch it. You may fetch additional data here if it is needed by your entire application.

- Next, it determines which package's `AppProvider` component should be rendered based on the current URL. Available packages must be configured in the `BUNDLE_PACKAGE_PROVIDERS` and `STATIC_PACKAGE_PROVIDERS` variables at the top of the file.

- Lastly, it renders the correct `AppProvider` (or the default `src/AppProvider.js` defined within this package) and passes in the appropriate props, including the state fetched earlier and a render function so that the `AppProvider` can define its own UI.

  See the [Adding a Custom Package](#adding-a-custom-package) section for details on how the `AppProvider` works.

### Global Libraries

The rendering of Kinetic forms is handled by the `CoreForm` component from the `@kineticdata/react` library. In order to allow customers to create form events which use JavaScript libraries that either aren't used by the bundle, or may not be react libraries, the `CoreForm` component can load other libraries before it renders any Kinetic forms.

To configure this, we have a `src/globals.js` file where we import any libraries that we want to make sure are available to Kinetic forms. This `globals` file is then provided as a prop to the `KineticLib` component from the `@kineticdata/react` library inside the `src/index.js` file.

## How the Components Package Works

`TODO`

## Adding a Custom Package

`TODO`

## Customizing a Pre-Built Kinetic Package

`TODO`

```

```
