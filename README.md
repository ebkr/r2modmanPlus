> [!WARNING]
> There has been a rise in third-party redistribution sites which are claiming to be official.
>
> There are only two legitimate places to download r2modman which are:
>
> - [Thunderstore](https://thunderstore.io/package/ebkr/r2modman/)
> - [GitHub](https://github.com/ebkr/r2modmanPlus/releases/latest)

# r2modman

[![Discord](https://img.shields.io/discord/727304496522461185?label=r2modman%20Discord&style=for-the-badge)](https://discord.gg/jE2zWHY)

[![GitHub](https://img.shields.io/github/license/ebkr/r2modmanPlus?color=orange&style=for-the-badge)](https://github.com/ebkr/r2modmanPlus)

| [Features](#features) | [What is a mod manager?](#what-is-a-mod-manager) | [Installing](#installing) | [Help](#help) | [Feedback and suggestions](#feedback-and-suggestions) | [Changelog](#changelog) | [Screenshots](#screenshots) |
|---|---|---|---|---|---|---|

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

### Windows
1. Click "Manual Download" on Thunderstore.
2. Inside the downloaded **.zip** file. Run the "r2modman Setup X.X.X.exe" (where X.X.X is the current version).
3. Follow the steps in the installer.

### Linux

If you are on Linux, please do not install the `.exe` files of r2modman. Instead, use one of the following methods:

#### Steam Deck

The Steam Deck relies on Flatpak installations if you'd like to use r2modman in game mode.

If you prefer to run the manager in desktop mode, you can use either the Flatpak (recommended) or the AppImage.

#### Flatpak and AppImage

1. Click "Manual Download" on Thunderstore.
2. Extract the downloaded **.zip** file.
2. Inside the extracted folder, there will be:
  - A `flatpak-setup.sh` file. Run this script if you want to install r2modman via Flatpak. (Recommended).
  - An AppImage file for regular usage. This file may need to be marked as executable (`chmod +x <filename>.AppImage`).

The `flatpak-setup.sh` script consists of:
```bash
flatpak remote-add --if-not-exists r2builds https://r2builds.ebkr.dev/flatpak/r2modman.flatpakrepo
flatpak install -y r2builds io.github.ebkr.r2modman
```

You will need elevated privileges (sudo) to run the `flatpak-setup.sh` script or the commands as listed above.

If you'd prefer not to use sudo/elevated privileges to install the Flatpak, then you can run the following manually:
```bash
flatpak remote-add --user --if-not-exists r2builds http://r2builds.ebkr.dev/flatpak/r2modman.flatpakrepo
flatpak install --user io.github.ebkr.r2modman
```

#### Platform-specific builds

_If you'd prefer to install platform specific builds then you can find them under the latest GitHub release on the ebkr/r2modmanPlus repository_

Platform builds:
 - deb
 - rpm
 - pacman
 - tar.gz

 You can access the list of release files here: https://github.com/ebkr/r2modmanPlus/releases/latest

 _Problems with Linux builds should be reported in the [r2modman discord](https://discord.gg/jE2zWHY)._

#### Note
- Temporary workaround to force Proton on Linux systems
    - Place a `.forceproton` file in the game directory whilst a solution is in development

## Updating
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

![](https://cdn.imgchest.com/files/865952ff6b49.png)

Installed mod view

![](https://cdn.imgchest.com/files/30a03e402178.png)

Online mods

![](https://cdn.imgchest.com/files/fe4abf3f137c.png)

Config editor

![](https://cdn.imgchest.com/files/06ed5a930bf1.png)

Profiles

![](https://cdn.imgchest.com/files/a23d6834a8d5.png)
