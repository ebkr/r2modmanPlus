# r2modman

[![Discord](https://img.shields.io/discord/727304496522461185?label=r2modman%20Discord&style=for-the-badge)](https://discord.gg/jE2zWHY)

[![GitHub](https://img.shields.io/github/license/ebkr/r2modmanPlus?color=orange&style=for-the-badge)](https://github.com/ebkr/r2modmanPlus)

| [Features](#features) | [What is a mod manager?](#what-is-a-mod-manager) | [Installing](#installing) | [Help](#help) | [Feedback and suggestions](#feedback-and-suggestions) | [Changelog](#changelog) |
|---|---|---|---|---|---|

## Features
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
1. Click "Manual Download" on [Thunderstore](https://dsp.thunderstore.io/package/ebkr/r2modman_dsp/).
2. Inside the downloaded **.zip** file. Run the "r2modman Setup X.X.X.exe" (where X.X.X is the current version).
3. Follow the steps in the installer.

#### Linux
1. Click "Manual Download" on [Thunderstore](https://dsp.thunderstore.io/package/ebkr/r2modman_dsp/).
2. Inside the download **.zip** file there is an AppImage release.

**Alternative Linux builds are available. Please ask if you require them:**

**Available builds:**
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
2. If you can't find the solution, join the [modding discord server](https://discord.gg/rMpGrch5tT) and ask for help in the **#tech-support** channel.

### Mod errors:
1. Join the [modding discord server](https://discord.gg/rMpGrch5tT) and ask for help in the **#tech-support** channel.

## Feedback and suggestions
Feedback can help r2modman become the best mod manager for Dyson Sphere Program.
It's encouraged to provide as much feedback as you'd like, and fully open to criticism.

Suggestions are welcome and there are already some suggestions that have made it in to the manager!
From small features such as always-expanded cards, all the way to larger features such as code-based profile exports.

The only thing you have to consider when suggesting a feature is the impact it will have on users who don't have a lot of experience with computers.

## Changelog
### 3.1.2 (DSP)
- Updated App IDs and Managed folder path for the preloader fix.

### 3.1.1
- Installing mods using the "Install with Mod Manager" button on Thunderstore will no longer produce duplicates.
- Updating mods should now reflect on the installed screen.
- Online section now shows 60 more mods per page.

### 3.1.0
- Linux support (thanks to AryToNeX).
- Updates will no longer prompt if a newer version is installed.
- New help screen.
- Upgraded Electron from 8 to 11.
- .modpack file is no longer required.
- Legacy/symlink install modes are no longer options. Replaced with direct launch parameters.
- Download progress will no longer stay at 0%.
- Backend is now async meaning fewer app hangs when installing mods.
- General fixes

