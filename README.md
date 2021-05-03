# r2modman

[![Discord](https://img.shields.io/discord/727304496522461185?label=r2modman%20Discord&style=for-the-badge)](https://discord.gg/jE2zWHY)

[![GitHub](https://img.shields.io/github/license/ebkr/r2modmanPlus?color=orange&style=for-the-badge)](https://github.com/ebkr/r2modmanPlus)

| [Features](#features) | [What is a mod manager?](#what-is-a-mod-manager) | [Installing](#installing) | [Help](#help) | [Feedback and suggestions](#feedback-and-suggestions) | [Changelog](#changelog) | [Screenshots](#screenshots) |
|---|---|---|---|---|---|---|

## Features
- Support for Risk of Rain 2, Dyson Sphere Program, Valheim, GTFO and Outward.
- A clean user interface designed to make modding as simple as possible.
- Safer mod installs allowing you to play the game through Steam normally.
- Mod profiles to switch between different sets of mods quickly and easily.
- Export profiles to easily share both your mods and configs with friends.
- Download and install mods directly from the manager.
- View and update any outdated mods.
- Edit configs directly from the manager.
- Manager auto-updates.
- And more!

## What is a mod manager?
It's quite simple really, a mod manager is an application to make it easier to control which mods you have installed.

You can choose to update, enable/disable or even uninstall mods with a simple click, all whilst keeping it available on another profile.

## Installing

### First time installing
#### Windows
1. Click "Manual Download" on Thunderstore.
2. Inside the downloaded **.zip** file. Run the "r2modman Setup X.X.X.exe" (where X.X.X is the current version).
3. Follow the steps in the installer.

#### Linux
1. Click "Manual Download" on Thunderstore.
2. Inside the download **.zip** file there is an AppImage release.

**If you'd prefer to install platform specific builds then you can find them under the latest GitHub release on the ebkr/r2modmanPlus repository**

**Platform builds:**
 - deb
 - rpm
 - pacman
 - tar.gz

 _Problems with Linux builds should be reported in the [r2modman discord](https://discord.gg/jE2zWHY)._

### Updating
r2modman will automatically download any available updates whilst you use it.

If an update has been downloaded, it will be installed once you have closed the application.

## Help
### Manager errors:
1. Check the [wiki](https://github.com/ebkr/r2modmanPlus/wiki).
2. If you can't find the solution, join the community modding discord and ask for help in the appropriate channels.

### Mod errors:
1. Join the [modding discord server](https://discord.gg/5MbXZvd) and ask for help in the appropriate channels.

## Feedback and suggestions
It's encouraged to provide as much feedback as you'd like, and fully open to criticism.

Suggestions are welcome and there are already some suggestions that have made it in to the manager!
From small features such as always-expanded cards, all the way to larger features such as code-based profile exports.

The only thing you have to consider when suggesting a feature is the impact it will have on users who don't have a lot of experience with computers.

## Changelog
### 3.1.13
- Directory resolution should work as intended for more users.
- The settings tabs and search now stay visible when scrolling down the page.
- Mods excluded from the manager are now updated without restarting the manager.
- Visible errors are now also written to the local log file.

### 3.1.12
- Fixed issue causing mod list to not use refreshed cache on initial launch.
- Profiles can now be updated using codes and files without having to export/delete/re-import.
- Increased timeout to 30s for slower connections.
- Minor visual tweaks and fixes.

### 3.1.11
- Added Outward support.
- Update all can now be accessed without going to the Settings screen.
- Fixed several settings.
- Config editor allows editing of JSON/TXT files again.
- API requests are now cached, allowing usage when the API is inaccessible.
  - Knowing if the API is down is currently only accessible from the "Refresh online mod list" setting. This will be fixed in a later update.
- Valheim BepInEx can now use the native version of the game.
- Other minor fixes.

## Screenshots

Installed mod view

![](https://i.imgur.com/XNVQBuQ.png)

Downloadable mods

![](https://i.imgur.com/Do6Awz0.png)

Dark theme

![](https://i.imgur.com/szsyGWB.png)

Config editor

![](https://i.imgur.com/U9av2H7.png)

Profiles

![](https://i.imgur.com/HtWQIWZ.png)

