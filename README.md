<p align="center">
  <img src="https://user-images.githubusercontent.com/11495867/71873445-879d2400-3162-11ea-82dc-bbd0593a48e7.png">
</p>

# Twitter Ads API Analytics Debugger

An Electron-based desktop application for Twitter Ads Analytics API.

![ea4d4a412df65a6d8cd4a623fee7a710](https://user-images.githubusercontent.com/11495867/72020738-c68cc000-32af-11ea-9ad8-a8b1b0cdf5e7.gif)

## Installation

### Supported platforms

- macOS
- Windows

### Download

Please download the latest version from the [releases](https://github.com/smaeda-ks/twitter-ads-api-analytics-debugger/releases) page.  
This application is built as a single executable file so there are no "install" steps at all.

### Authentication

Please configure your OAuth 1.0a tokens by clicking the top-right button.  
Need a way to generate tokens easily? Try this tool - [tw-oob-oauth-cli](https://github.com/smaeda-ks/tw-oob-oauth-cli).

<img width="842" alt="Screen Shot 2020-01-07 at 14 59 12" src="https://user-images.githubusercontent.com/11495867/71872356-85859600-315f-11ea-9241-2231588fd1e4.png">

This app stores token to the system's credential storage (i.e., `Keychain` for macOS and `Credential Vault` for Windows).

## Development

### requirements

- Node.js version 12+

### npm install

```sh
$ git clone https://github.com/smaeda-ks/twitter-ads-api-analytics-debugger
$ cd ./twitter-ads-api-analytics-debugger
$ npm install
```

You probably need to run the following command after `npm install` as this app uses some native modules:

```sh
$ ./node_modules/.bin/electron-rebuild
```

### launch App

From the source directory:

```sh
$ npx electron .
```

You can also specify `--dev` option when launching. This will enable live-reloading (using [electron-reload](https://github.com/yan-foto/electron-reload)).

```sh
$ npx electron . --dev
```

### build package

If you need to build locally, try the following commands.

```sh
# macOS
$ npm run build:mac

# Windows
$ npm run build:win

# built packages are in the dist directory
$ ls ./dist
```
