# Playbuddy

[![Build Status](https://travis-ci.org/ChicoState/PlayBuddy.svg?branch=development)](https://travis-ci.org/ChicoState/PlayBuddy)

A web application for finding on-going, or soon-to-start group
activities in your local area.

- [Playbuddy](#playbuddy)
  - [Project Structure](#project-structure)
  - [Continuous Integration](#continuous-integration)
  - [Contributing](#contributing)

## Project Structure

This repository holds everything needed to get the application up and running.
PlayBuddy is split between the [React Frontend](./frontend/) and the [API](./backend/).
In each are corresponding instructions to get the half working.
PlayBuddy is designed to be run from containers so there's provided Dockerfiles
to make setup as easy as possible.

## Continuous Integration

PlayBuddy uses [TravisCI](https://travis-ci.org/) to test code before it's deployed.
At the top is a link to see how our most recent build is doing.

## Contributing

Want to make PlayBuddy better?
Fantastic, so do we!
As an open source project we're always happy to have others contribute,
but we do ask that you follow a few guidelines when doing so.

1. Make a fork

   We follow a [Fork and Pull model](https://reflectoring.io/github-fork-and-pull/),
   so please fork the project for yourself so you can make your changes.

2. Create a branch

   Now that you've created your very own fork, create a new branch to house
   your changes.
   Feel free to name your branch however you like, but it might help if you
   give it a name that matches the changes it'll hold.

3. Make some changes

   Now's the fun part, it's time to make the changes to PlayBuddy!
   Each part of the project uses an Eslint configuration for code styling
   so please make sure to follow that when writing.

   Please refer to each part on how to use the configuration for that environment.

4. Create a pull request

   Now that you've made some changes, it's time to get them reviewed.
   Open a pull request from the branch you made before and our team will
   review it and make sure it's ready to go.
