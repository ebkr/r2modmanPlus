# r2modman

[![Discord](https://img.shields.io/discord/727304496522461185?label=r2modman%20Discord&style=for-the-badge)](https://discord.gg/jE2zWHY)

[![GitHub](https://img.shields.io/github/license/ebkr/r2modmanPlus?color=orange&style=for-the-badge)](https://github.com/ebkr/r2modmanPlus)

| [Features](#features) | [What is a mod manager?](#what-is-a-mod-manager) | [Installing](#installing) | [Help](#help) | [Feedback and suggestions](#feedback-and-suggestions) | [Changelog](#changelog) | [Screenshots](#screenshots) |
|---|---|---|---|---|---|---|

## This fork
This fork is a slightly modified version of r2modman. It is specifically modified to run on modern MacOS systems with Silicon processors. The automatic directory detection and validation was removed so it can be used with more flexibility. This version also features an optional json to lets you define launchers overrides for easier use with CrossOver (+ Game Porting Toolkit).

More info on how to setup CrossOver bottles will eventually be published.

## Optional JSON
You can find an optional json in ```r2modman.app/Contents/Frameworks/game.json```
For each games, a launcher override can be defined in this file. Ex:
```
{ 
    ...
    "crossOverLaunchers": {"modded": "/Users/USER/Applications/CrossOver/GAME/MODDEDGAME.app", "vanilla": "/Users/USER/Applications/CrossOver/GAME/GAME.app"}
    ...
}
```

## Features
- Support for Risk of Rain 2, Dyson Sphere Program, Valheim, GTFO, BONEWORKS, and more
- A clean user interface designed to make modding as simple as possible
- Safer mod installation allowing you to play the game through Steam normally
- Mod profiles to switch between different sets of mods quickly and easily
- Export profiles to easily share both your mods and configs with friends
- Download and install mods directly from the manager
- View and update any outdated mods
- Edit configs directly from the manager
- Auto-updates
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

##### Note
- Temporary workaround to force Proton on Linux systems
    - Place a `.forceproton` file in the game directory whilst a solution is in development

### Updating
r2modman will automatically download any available updates whilst you use it.

If an update has been downloaded, it will be installed once you have closed the application.

## Help
### Manager errors:
1. Check the [wiki](https://github.com/ebkr/r2modmanPlus/wiki).
2. If you can't find the solution, join the community modding discord and ask for help in the appropriate channels.

### Mod errors:
1. Join the relevant community modding discord and ask for help in the appropriate channels.

## Feedback and suggestions
It's encouraged to provide as much feedback as you'd like, and fully open to criticism.

Suggestions are welcome and there are already some suggestions that have made it in to the manager!
From small features such as always-expanded cards, all the way to larger features such as code-based profile exports.

The only thing you have to consider when suggesting a feature is the impact it will have on users who don't have a lot of experience with computers.

## Screenshots

Game selection

![](https://i.imgur.com/mmzY9xQ.png)

Installed mod view

![](https://i.imgur.com/d7w4qEl.png)

Downloadable mods

![](https://i.imgur.com/eoIAMMP.png)

Config editor

![](https://i.imgur.com/RT6HsxF.png)

Profiles

![](https://i.imgur.com/nLfNaQJ.png)
