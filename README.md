# Kinetic Data Starter - Base

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![@KineticData KineticData](https://img.shields.io/badge/GitHub%20-KineticData-lightgrey.svg?style=flat-square)](https://github.com/kineticdata/kinetic-starter-react-base)
[![@KineticLib react](https://img.shields.io/badge/@KineticLib%20-react-lightgreen.svg?style=flat-square)](https://www.npmjs.com/package/@kineticdata/react) 

The Kinetic Data `kinetic-starter-react-base` is an agnostic foundation for new partners and clients to get familiar with the Kinetic Platform and learn how it connects and interacts with the front end. This codebase comes with the canonical Kinetic routes for `Kapps`, `Forms`, `Form View`, `Submissions`, and `Submission View` already created. Additionally, agnostic components have been included, along with a global state management system using React Context. Whether you are looking to practice interacting with the Kinetic Platform or to begin a new Kinetic project, this is the place to start!

## Table of Contents

* [Quick Start](#quick-start)
* [Installation](#installation)
* [Basic usage](#basic-usage)
* [What's included](#whats-included)
* [Kinetic Requirements](#kinetic-reqs)
* [Documentation](#documentation)
* [License](#copyright-and-license)

## Quick Start

### Create the Repository
- Clone the repo: 

```
git clone https://github.com/kineticdata/kinetic-starter-react-base
```


### Installation

``` bash
$ yarn install
```
### Basic usage

``` bash
# This will prompt you for the Kinetic space URL
$ yarn prestart

# dev server with hot reload at http://localhost:3000
$ yarn start
```

The local host will be available at [http://localhost:3000](http://localhost:3000). Changes to source files will update automatically.

#### Build

To build the project use `build`. The build artifacts will be stored in the `build/` directory.

```bash
# build for production with minification
$ yarn build
```

## What's included

This download contains the directories and files listed below. Common assets are logically grouped and both compiled and minified variations are provided. The folder structure is as follows:

```
kinetic-starter-react-base
├── public/          # static files
│   ├── index.html
│
├── src/             # project root
│   ├── Global/      # Components and files needed for the starter base.
│   ├── App.js
│   ├── index.js
│   ├── setupEnv.cjs # yarn prestart script to set up env files.
│
├── index.html       # html template
├── ...
├── package.json
├── ...
└── vite.config.mjs  # vite config
```

## Kinetic Requirements

Certain dependencies and files are required in order to establish a connection with the Kinetic Platform. In the case of removing items from the Starter Base please make sure these items are kept; or that they are added to new projects which may not be using the Base to begin development.

`Dependencies`
```bash
"qs": "^6.11.2",
"react-beautiful-dnd": "^11.0.5"
```

`setupEnv.cjs`
While not technically required, the `setupEnv.cjs` file handles setting up the connection to the correct Kinetic space properly. This is only necessary once, prior to running the application locally. See [Basic usage](#basic-usage).

`Proxy`
Ensuring the proxy is working correctly is essential for local development and proper authentication with the Kinetic Platform. At the base level of the app is the `vite.config.js` file, which controls the proxy. We manually update certain proxy headers in `server.proxy.configure` to ensure that they are correct.

## Documentation

See the [Kinetic Data Documentation Library](https://docs.kineticdata.com/) for more information on the Kinetic Starter - Base.

## License  

Code released under [the MIT license](https://github.com/coreui/coreui-free-react-admin-template/blob/main/LICENSE).