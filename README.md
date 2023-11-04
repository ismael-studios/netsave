# Netsave

- A Standard compliant React Native App Utilizing:

[TypeScript](https://www.typescriptlang.org/)

[Redux](https://redux.js.org/)

[AWS](https://aws.amazon.com/)

## How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application with `yarn` or `npm i`

**Step 4:** create a `.env` file with the contents of `.env.example`

## How to Run App

After following the setup steps above you may:

1. Run Build for either OS

- for iOS
  - run `npx react-native run-ios`
- for Android
  - run `npx react-native run-android`

**Notes:**

1. This codebase is compatible is compatible with both Android Studio and Xcode applications. Therefore, all updates and changes made to this codebase should keep these compatibilities.

## :no_entry_sign: Standard Compliant

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
This project adheres to Standard. Our CI enforces this, so we suggest you enable linting to keep your project compliant during development.

**To Lint on Commit**

This is implemented using [husky](https://github.com/typicode/husky). There is no additional setup needed.

**Bypass Lint**

If you have to bypass lint for a special commit that you will come back and clean (pushing something to a branch etc.) then you can bypass git hooks with adding `--no-verify` to your commit command.

**Understanding Linting Errors**

The linting rules are from JS Standard and React-Standard. [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).

## About the App

API Documentation can be found here: https://www.getpostman.com/collections/9c688821c1ad6f5a2f25

All app source files can be found in the `src` directory. Custom components are kept in `src/components`. Screen components are kept in `src/screens`.

Redux / Saga related files can be found in `src/store/redux` & `src/store/saga`. We are using Redux persist to manage users' sessions. API Related files can be found in `src/services`.

Common functions and tasks should be kept in `src/helpers`. External classes should be kept in `src/lib`.

Fonts and Images are stored in `src/assets`. For android related usages, they are stored in `android/src/src/main/res`.

Code relating to the app's look and feel including colors, margin spacing, etc can be found in `src/common`. Font sizes, Button sizes, Color hexes etc.

We are using React-Navigation and related Screens and Stacks can be found in `src/navigation`

This project uses [react-native-config](https://github.com/luggit/react-native-config) to expose config variables based on the chosen environment. Therefore, API keys and other sensitive information will be stored in a `.env` file.

Switching the environment is done via the `.env` file by changing the `ENV` variable to either `dev`, `staging` or `production`.
