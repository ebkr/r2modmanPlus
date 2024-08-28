# Adding a game

## Requirements
### Game metadata
- Game image (png/jpg - 188x250px)
- App ID for available platforms.
- Folder name relative to root directory ( EG: _steamapps/common/_**Risk of Rain 2** OR _steamapps/common/_**BONEWORKS/BONEWORKS** )
- Game data directory (if applicable). Usually **executable name**

### Mod loader
- An uploaded mod loader package on TS
  - Package identifier
  - Mod loader type (BepInEx/MelonLoader/Northstar/etc)
  - Format to unpack loader
    - BepInEx contents is usually one folder deeper than the package root.

### An understanding of the game's installation rules
- Subdir vs State vs None
  - If the mod loader is already used in existing places then this can usually just be copied and lightly modified.

## Adding a new game listing

### Add a new entry to GameManager.ts
  - **DisplayName**
    - How it appears when presented to the user.
  - **InternalFolderName**
    - The folder name where files related to profiles and cached packages are saved under.
      - Server listings can share this InternalFolderName to have profiles shared between both game/server.
    - _Try to keep this without spaces - Helps with max path character limit_
  - **SettingsIdentifier**
    - Used to scope settings for games.
  - **SteamFolderName**
    - Used to resolve the game dir. Only Steam related currently, but not a requirement.
  - **ExeName**
    - An array of different executable names (for all platforms). For `StorePlatform` types such as `OTHER` and `STEAM_DIRECT` then the first found executable is used and called when the game is launched.
  - **DataFolderName**
    - Required for Unreal games relying on unreal-shimloader.
    - Relevant for Mono (C#) Unity games, which use it for the `Preloader Fix` in the manager settings.
  - **TsUrl**
    - The Thunderstore API endpoint for the listing.
  - **ExclusionsUrl**
    - The URL used to load package exclusions. Generally just kept the same. No real reason to change until it becomes a large file as extra overhead to maintain.
  - **Platforms**
    - Array of `StorePlatformMetadata` for the different supported storefronts. Identifier is not required, however is expected for Steam and EGS (more potentially in future).
  - **GameImage**
    - Name of the file to display on the GameSelectionScreen view.
      - The image file should be placed under `/src/assets/images/game_selection/`. Ensure resolution is 188x250px.
  - **DisplayMode**
    - Is the game selection presented to the user? (VISIBLE/HIDDEN).
  - **InstanceType**
    - Is it a game or a server? Only affects the tab the listing is displayed in on the GameSelectionScreen view.
  - **PackageLoader**
    - Default package loader to use for game launch rules. Saves having to write new rules each time.
  - **AdditionalSearchStrings (Optional)**
    - Other names that can be used to search for a game on the GameSelectionScreen view.
      - EG: RoR2, NASB, TABS, etc.
      - Pattern is lowercase although likely isn't necessary.

### Creating new installation rules
- See all files under `/src/r2mm/installing/default_installation_rules/`
  - `game_rules` stores all game specific rules.
    - Make a new rule file here.
  - `generic` is unused currently. Plans to have a standard "BepInEx" rule for example where other rules can build on top of it.
  - `InstallationRuleApplicator.ts` is used to load the installation rules. The app will result in a white screen if this is not modified.

To add a new game rule you'll need the following:
- **gameName**
  - The InternalFolderName for the game listing.
- **rules**
  - The installation rules to be applied
- **relativeFileExclusions**
  - Currently only for state-based installs. Used to strip specific files such as `manifest.json` to reduce conflict management abuse.

#### How to write rules
- **route**
  - The path relative to the profile folder.
- **isDefaultLocation**
  - If no files can be resolved, place them here following the `trackingMethod` given.
- **defaultFileExtensions**
  - Similar to `isDefaultLocation` but for any matching extensions.
- **trackingMethod**
  - SUBDIR
    - Places files in their own namespaced folder inside of the route.
  - STATE
    - Places files as-is into the route. Has conflict management built-in.
  - NONE
    - Places files as-is into the route. These files do not have conflict management and cannot be managed further. (No disable/uninstall behaviour).
    - Ideal for configs.
- **subRoutes**
  - Useful to allow multiple nested resolutions where override folders may be required at both a high and low level of the route.
  - See BONEWORKS install rules for an example.
  - Allows us to grant or restrict access to the raw BepInEx folder for example depending on the ending of the route name.

> Remember to add this to `InstallationRuleApplicator.ts`

#### Quick note: Resolving a directory
To summarise, a directory is placed (according to the `trackingMethod`) if the end of the route name matches.

See: [Structuring your Thunderstore package](https://github.com/ebkr/r2modmanPlus/wiki/Structuring-your-Thunderstore-package) for detailed information on how rules are handled.

### How to handle the mod loader
We have a "nice" `ModLoaderVariantRecord.ts` file which records which mod loader packages are associate with each game, and how to handle them.
- Key is the InternalFolderName
- Array can contain multiple `ModLoaderPackageMapping` objects
  - **PackageName**
    - The TS package name
  - **RootFolder**
    - Used for BepInEx. The subfolder where the files are located to be extracted into the profile dir.
  - **LoaderType**
    - BEPINEX / MELON_LOADER / NORTHSTAR / etc

## Finally, test
You should always test manually to ensure no white screen is present on startup.

There is also a test suite to ensure that the installation rules work as intended (under `/test/folder-structure-testing`).
This suite works by adding files to any folders you create when running populator.mjs. (Should run depopulator.mjs prior to repopulating).

> Folder names such as `BIE_GameSpecific_GTFO_GameData_Files` are created by the populator. You do not need to create these files.

### Running populator tests
- You'll need to run either `test:unit:ci` or `test:unit:ui`
- Test files are located under `/test/jest/__tests__/impl/install_logic/game_specific/`
  - These are generally only needed if any rules were modified after being copied.

