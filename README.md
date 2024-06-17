
# KineticData Starter - Base

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![@KineticData KineticData](https://img.shields.io/badge/GitHub%20-KineticData-lightgrey.svg?style=flat-square)](https://github.com/kineticdata/kinetic-starter-react-base)
[![@KineticLib react](https://img.shields.io/badge/@KineticLib%20-react-lightgreen.svg?style=flat-square)](https://www.npmjs.com/package/@kineticdata/react) 

The Kinetic Data `kinetic-starter-react-base` is intended to be an agnostic foundation for new partners and clients to get familiar with the Kinetic Platform and how it connects and interacts with the front end. This codebase comes with the cannonical Kinetic routes already created: `Kapps`, `Forms`, `Form View`, `Submissions`, and `Submission View`. Additionally, agnostic components have been included as well, along with a global state management system using React Context. As is, the Starter Base assumes the user is a Space Admin since user permissions unique on a case by case basis they will need to be added in both the Kinetic Platform and updated here in the Starter Base to match.Whether you are looking to practice interacting with the Kinetic Platform or to begin a new Kinetic project, this is the place to start!

## Table of Contents

* [Quick Start](#quick-start)
* [Installation](#installation)
* [Basic usage](#basic-usage)
* [What's included](#whats-included)
* [Documentation](#documentation)
* [License](#copyright-and-license)

## Quick Start

- Clone the repo: `git clone https://github.com/kineticdata/kinetic-starter-react-base`

### Installation

``` bash
$ yarn install
```
### Basic usage

``` bash
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

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

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

## Documentation

Documentation for the Kinetic Starter - Base can be found [here](https://docs.kineticdata.com/).

## License  

Code released under [the MIT license](https://github.com/coreui/coreui-free-react-admin-template/blob/main/LICENSE).


