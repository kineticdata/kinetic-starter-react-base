# Customer Project Default

This project is the default implementation, and custom starting point, for Kinetic bundles built with [React](https://reactjs.org/).

---

## Table of Contents

- [Bundle Development Quick Start](#bundle-development-quick-start)
- [Starting a Custom Bundle](#starting-a-custom-bundle)
- [Folder Structure](#folder-structure)

## Bundle Development Quick Start

**Requirements:** Node.js (v12.x or v14.x), Yarn, and knowledge of React.

From a command line open inside the `bundle` directory, run the below commands to start a development server.

```shell
$ yarn install
$ yarn start
```

Upon `start`, you will be prompted to enter a Kinetic Request CE server to connect to.

That server must have an OAuth client created with the following values (Kinetic Management Console > Space Settings Page > OAuth Tab):

```
Name          ->  Kinetic Bundle - Dev
Description   ->  oAuth Client for client-side bundles in development mode
Client ID     ->  kinetic-bundle-dev
Client Secret ->  <any value>
Redirect URI  ->  http://localhost:3000/app/oauth/callback
```

The server must also have the following trusted domains (Kinetic Management Console > Space Settings Page > Security Tab):

```
Trusted Resource Domain   ->    http://localhost:3000
Trusted Frame Domain      ->    localhost:3000
```

Once the development server starts up, you can access it at [http://localhost:3000](http://localhost:3000). Any changes you make to your local code will then automatically cause the server to reload with your new changes.

Happy developing!

**For detailed bundle development instructions, please see the [Bundle README](bundle/README.md).**

## Starting a Custom Bundle

**Requirements:** GitHub account and knowledge of git.

In order to customize or build your own custom bundle, it is recommended to begin with this project. You can either [fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) this repository, or create your own new repository and configure this repository as its upstream, by following the instructions below.

1. [Create a Github repository.](https://docs.github.com/en/github/getting-started-with-github/create-a-repo)

   **Do NOT check the 'Initialize this repository with a README' checkbox.** It must remain unchecked so that we can merge in the history from this repository to allow future syncing.

   Let's use the repository name `awesome-custom-bundle` in the below examples.

2. [Clone your repository to your local machine](https://docs.github.com/en/github/using-git/getting-changes-from-a-remote-repository#cloning-a-repository) and change to the newly cloned repository.

   ```shell
   $ git clone https://github.com/<USERNAME>/awesome-custom-bundle.git
   > Cloning into 'awesome-custom-bundle'...
   $ cd awesome-custom-bundle
   ```

3. Set this repository as the upstream in your `awesome-custom-bundle` repository. We'll also update the push upstream url to an invalid value to prevent accidental pushes to the upstream, in case you happen to have access to do so. Finally, running `git remote -v` will show us the configured remotes.

   ```shell
   $ git remote add upstream https://github.com/kineticdata/customer-project-default.git --no-tags
   $ git remote set-url --push upstream no_push
   $ git remote -v
   > origin      https://github.com/<USERNAME>/awesome-custom-bundle.git (fetch)
   > origin      https://github.com/<USERNAME>/awesome-custom-bundle.git (push)
   > upstream    https://github.com/kineticdata/customer-project-default.git (fetch)
   > upstream    no_push (push)
   ```

4. Fetch the upstream branches. Then create a branch in your repo by checking out the upstream branch. This will bring over all the code and history from the upstream, allowing you to merge in future changes from the upstream to your local repo. The `--no-track` flag will make sure this branch does not track the upstream, as we'll want it to track origin since we'll be making changes in it. Lastly, we'll push the our master branch to the origin remote.

   ```shell
   $ git fetch upstream
   > From https://github.com/kineticdata/customer-project-default
   >  * [new branch]      develop    -> upstream/develop
   >  * [new branch]      master     -> upstream/master
   $ git checkout -b master upstream/master --no-track
   $ git push -u origin master
   > To https://github.com/<USERNAME>/awesome-custom-bundle.git
   >  * [new branch]      master     -> master
   ```

You are now ready to start developing in your custom bundle repository. See the [Bundle README](bundle/README.md) for detailed bundle development instructions.

In order to pull the latest changes from the upstream `customer-project-default` repository into your custom `awesome-custom-bundle` repository, follow the below instructions. You will need to manually resolve any conflicts during the merge.

```shell
$ git checkout master
$ git fetch upstream
$ git merge upstream/master
$ git push origin master
```

###### Notes

- You can use either the master branch (latest stable release) or the develop branch (latest unreleased changes) from the upstream. It is not recommended to use other upstream branches if they exist.
- You can name your local/origin branch whatever you'd like; master was just used in the above examples.
- Once you start customizing your bundle, it will be your responsibility to merge in and resolve any conflicts from the upstream when we make changes to `customer-project-default`.

## Folder Structure

```shell
  .
  ├─ artifacts               # Contains artifacts generated for the project
  ├─ bundle                  # Contains the bundle React code
  │  ├─ packages             # Individual packages that define different parts of the bundle
  │  │  ├─ app               # Entry point to the bundle application
  │  │  ├─ components        # Package that allows for overriding common components
  │  │  └─ ...               # Other custom packages may be added
  │  └─ package.json         # Monorepo configuration file
  └─ plugins                 # Contains custom plugins for the project
```

- #### artifacts

  Directory containing artifacts for the project, such as space exports generated from the SDK, or special documentation such as ADRs.

- #### bundle

  Directory containing all of the bundle code. See the [Bundle README](bundle/README.md) for detailed bundle development instructions.

  - #### packages

    The bundle consists of multiple packages, where each package defines one area of functionality (e.g. service portal package).

    - #### app

      The app package is the entry point to the entire bundle, and defines the rendering and authentication wrappers, as well as a default content renderer. This package is rendered when the bundle is loaded, and then in turn renders the content of the other packages as needed.

    - #### components

      The components package exists to allow for overriding of common layout components used by other packages. _This package is currently a work in progress._

    - #### _other packages_

      The majority of the prebuilt Kinetic packages are deployed to NPM, and are installed into the App package from NPM, so their code isn't part of this bundle.
      New packages may be added and connected into the App package to provide custom functionality.

- #### plugins

  Directory containing all of the custom plugins (such as handlers, bridge adapters, etc.) created for the project.
