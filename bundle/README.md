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
  - [Folder Structure](#folder-structure) | [Rendering Flow](#rendering-flow) | [App Provider](#app-provider) | [Global Libraries](#global-libraries)
- [Adding a Custom Package](#adding-a-custom-package)
- [Customizing a Pre-Built Kinetic Package](#customizing-a-pre-built-kinetic-package)
- [How the Components Package Works](#how-the-components-package-works)

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

### App Provider

An `AppProvider` is a react component that renders the contents of a package. The `scr/App.js` file described in the previous section will render the `AppProvider` and will provide it the following props:

- `appState` - An object containing all of the global state fetched by the `app` package.
- `render` - A function that should be called by the `AppProvider` to render its content. This function accepts an object as its argument with the below properties (all properties are optional).
  - `components` - An object of components to be used for rendering.
    - `Layout` - Defines the layout used to render the content. If not provided. the default layout is used.
    - `Header` - Defines the header component to be rendered for the package.
    - `Sidebar` - Defines the sidebar component to be rendered for the package.
    - `Main` - Defines the main content component to be rendered for the package.
  - `header` - Dom content to render as the header. Used if `components.Header` is not provided. If also not provided, the default header is used.
  - `sidebar` - Dom content to render as the sidebar. Used if `components.Sidebar` is not provided. If also not provided, no sidebar is rendered.
  - `main` - Dom content to render as the main content of the package. Used if `components.Main` is not provided. If also not provided, no main content is rendered.

It is up to each package to define what content it wants rendered. The default layout is used by the pre-built Kinetic packages, and can be used by custom packages as well for consistency, but can also be overridden if needed, to give the package full control of how it renders.

### Global Libraries

The rendering of Kinetic forms is handled by the `CoreForm` component from the `@kineticdata/react` library. In order to allow customers to create form events which use JavaScript libraries that either aren't used by the bundle, or may not be react libraries, the `CoreForm` component can load other libraries before it renders any Kinetic forms.

To configure this, we have a `src/globals.js` file where we import any libraries that we want to make sure are available to Kinetic forms. This `globals` file is then provided as a prop to the `KineticLib` component from the `@kineticdata/react` library inside the `src/index.js` file.

## Adding a Custom Package

The bundle functionality is split across many packages, with each package being designed to provide a specific functionality. Often, a package will be linked to a Kapp (e.g. `@kineticdata/bundle-services` or `@kineticdata/bundle-queue`), but it can also be a static package that only uses space level information (e.g. `@kineticdata/bundle-discussions` or `@kineticdata/bundle-settings`).

You may build your own custom packages by adding a new directory in `bundle/packages`, and populating it with the necessary files.

You can follow the detailed instructions in the [CUSTOM_PACKAGE.md](CUSTOM_PACKAGE.md) file to start building your own custom package.

## Customizing a Pre-Built Kinetic Package

There are a number of packages that have been built by Kinetic Data and are available to be installed from NPM. Many of these packages are already installed in the `app` package of this bundle.

These packages are meant to be used as they are, and are generally not modified. (Some packages do allow minor modifications through overriding components in the `components` package.) However, sometimes a customer may want to customize one of these packages, or use one as a starting point for their own custom package. This can be accomplished by pulling in the source code of one of the pre-built Kinetic packages and then treating it as a custom package.

The [kinetic-ui-packages](https://github.com/kineticdata/kinetic-ui-packages) repository contains branches with the source code for the packages that are available. You can follow the detailed instructions in the [README.md](https://github.com/kineticdata/kinetic-ui-packages/blob/master/README.md) file in that repo to add the source code of these pre-built packages into your bundle.

## How the Components Package Works

The `components` package in this repository allows the user to override components that are found in the pre-built `@kineticdata/bundle-components` package, as well as some components found in other pre-built `@kineticdata/bundle-*` packages.

The prebuilt packages `@kineticdata/bundle-components` and `@kineticdata/bundle-common` provide a large number of reusable components that are used throughout the other packages such as `@kineticdata/bundle-services`, `@kineticdata/bundle-queue`, etc.

Unlike `@kineticdata/bundle-services`, you should not pull in the source code for these packages in order to customize them. Instead, this repository has its own `components` package where you can define your own components to override the ones defined by the pre-built package.

### Folder Structure

```shell
  .
  ├─ node_modules              # Contains installed dependencies for this package - created when you run 'yarn install'
  ├─ src                       # Contains the package source code
  │  ├─ components             # Contains React components that override pre-built components
  │  ├─ index.js               # The JavaScript entry point
  └─ package.json              # Package configuration file
```

### Package Dependency Tree

```shell
  .
  ├─ packages/app                               # App package imports multiple pre-built packages
  │  ├─ @kineticdata/bundle-common              # The common pre-built package imports the components package
  │  │  └─ @kineticdata/bundle-components
  │  ├─ @kineticdata/bundle-queue               # The queue pre-built package imports the common pre-built package
  │  │  └─ @kineticdata/bundle-common           # The common pre-built package imports the components package
  │  │     └─ @kineticdata/bundle-components
  │  ├─ @kineticdata/bundle-services            # The services pre-built package imports the common pre-built package
  │  │  └─ @kineticdata/bundle-common           # The common pre-built package imports the components package
  │  │     └─ @kineticdata/bundle-components
  │  └─ @kineticdata/bundle-settings            # The settings pre-built package imports the common pre-built package
  │     └─ @kineticdata/bundle-common           # The common pre-built package imports the components package
  │        └─ @kineticdata/bundle-components
  └─ packages/components                        # The local components package
     ├─ @kineticdata/bundle-common              # The common pre-built package imports the components package
     │  └─ @kineticdata/bundle-components
     └─ @kineticdata/bundle-components-default@npm:@kineticdata/bundle-components   # Aliased pre-built components package
```

As shown in the tree above, the `components` package is used within every other package, through the `common` package. Behind the scenes, the `@kineticdata/bundle-common` package imports all of the components exported from `@kineticdata/bundle-components` and exports them. This allows every other package, such as `@kineticdata/bundle-service`, to only have to know about and use `@kineticdata/bundle-common`.

This local `components` package has the same name in its `package.json` file as the pre-built `@kineticdata/bundle-components` package. This, along with some configuration in the bundle's root `package.json` file\*, enables the bundle to use this local `components` package (instead of the version published to NPM) in all instances where the `@kineticdata/bundle-components` dependency appears in the tree.

This allows us to define the same components that exist in the pre-built `@kineticdata/bundle-components` package, and have these components override the pre-built ones.

_**\*** The `bundle/package.json` file defines the following yarn resolution that tells the package to use any `5.x` version of the `@kineticdata/bundle-components` dependency (instead of the version specified in the pre-built packages), which will allow it to match the local `components` package as long as its major version number is `5`._

```
"resolutions": { "**/@kineticdata/bundle-components": "5.x" }
```

### Export Flow

Through the configuration above, this local `components` package is used in place of the pre-built one. This means that in order to make sure that everything that uses this package works correctly, this package needs to export every single component that the pre-built package exports.

To accomplish this, the `components` package imports the pre-built `@kineticdata/bundle-components` package from NPM using an alias of `@kineticdata/bundle-components-default`. This allows us to install the dependency from NPM without it affecting any other packages because its name is aliased.

The `src/index.js` file must have the below structure, which will export all of the pre-built components from the aliased `components` package, as well as any custom components you define as overrides.

```javascript
// Export all common components from the aliased pre-built components package
export * from '@kineticdata/bundle-components-default';

// Export any custom components you defined to override the default ones
export Card from './components/Card';
export PageTitle from './components/PageTitle';
...
```

### Overriding Components for Other Packages

Some pre-built packages (such as `@kineticdata/bundle-service`) also allow you to override some of their pre-defined components using the `components` package.

To do so, you will need to export a named object of these components from the `src/index.js` file. In addition to the above content, you will also need to add the below code to the `src/index.js` file.

```javascript
// Import any components that override components from other packages
import CategoryCard from './components/services/CategoryCard';
import ServiceCard from './components/services/ServiceCard';
// Create an named object of the above components, with the name corresponding to the package name
const services = {
  CategoryCard
  ServiceCard,
  ...
};

// The code that exports the default overrides should go here

// Export package specific override components
export { services };
```

### How Do I Know What Components Can Be Overridden?

This overriding strategy is currently new and is just starting to be implemented. As such, there aren't many components yet that can be overridden, and there is unfortunately no documentation yet for the ones that can be. We hope to imrpove on this soon!
