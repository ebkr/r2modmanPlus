### 3.2.10
#### Games added
- Bendy and the Ink Machine
- Forsaken Frontiers
- Return From Core
- Mimesis
- Five Nights at Freddy's: Into the Pit
  - EGS support
- Broforce
- Megabonk
  - Linux executable can now be selected

#### Bugs fixed
- Being offline no longer prevents the manager from loading into a game
- Updates are now checked on app startup instead of after game selection
- EGS games can be launched again

### 3.2.9
#### Games added
- Megabonk
- An Unfinished Game
- Easy Delivery Co
- Jump Space
- CloverPit
- Grey Hack
- Slasher's Keep

#### Changes
- Hollow Knight: Silksong Linux can now be selected
- NSFW indicator in the preview panel and mod list row in the online section
- Preview metadata can be collapsed to reveal allow for more preview space

### 3.2.8
#### Changes
- Config Editor
  - Config Editor headers are now less obtrusive
  - Config Editor now supports multi-select options
  - When loading a large number of config files, a spinner is shown instead of hanging the application
  - "Show more" functionality now restricts per line length until selected
- Linux Native/Proton detection and install fixes

### 3.2.7
#### Changes
- GTK version issue preventing launches should no longer be present
- Resonite Renderer path in mods (affecting AudioBridge) should now resolve as intended
- First-time install of Linux wrapper is now written to disk correctly

### 3.2.6
#### Changes
- Linux wrapper is now resolved correctly if not previously present

### 3.2.5
#### Changes
- Fixed several bugs causing rendering issues

### 3.2.4
#### Games added
- Hollow Knight: Silksong
- Resonite
- House of Legacy
- Beton Brutal
- Pair A Dice
- Maltese's Fluffy Onsen
- Paper Animal Adventure
- PAC-MAN WORLD Re-PAC
- Darkwater

#### Changes
- Preview panel can now be resized
- Download and install progress is now better reflected
- The entire application has upgraded to Vue 3 along with some other internal tooling upgrades

### 3.2.3
#### Games added
- Len's Island
- Mage Arena
- Ostranauts
- Patapon 1+2 Replay

### 3.2.2
#### Games added
- Bad North
- Logic World
- Lost Skies Island Creator
- Mycopunk
- Vellum
- Word Play

#### Other changes
This release primarily focuses on improved Linux support, of which:
- The `Other` platform option no longer hangs the application on Linux
- You can now manually choose between Native, Proton, and Auto launch behaviour

### 3.2.1
#### Games added
- PEAK
- Painting VR
- DEPO : Death Epileptic Pixel Origins
- 9 Kings
- Guilty as Sock!
- Return of the Obra Dinn
- ASKA
- PIGFACE (Demo)

#### Other changes
- General bug fixes and enhancements

### 3.2.0
#### Major changes
- You can now preview a mod's README, CHANGELOG, and dependencies all within the Online section.
- Profile management now belongs in the bottom left of the screen.
  - You can use this to:
    - Change profile
    - Export profile
    - Import local mods

#### Games added
- ANEURISM IV
- Lost Skies
- Labyrinthine

### 3.1.58
#### Games added
- Schedule 1
- Zort
- Disco Elysium
- Odd Remedy
- Dusk
- Monster Train 2
- My Dream Setup
- Hades 2 (@xiaoxiao921)
- Gatekeeper
- Pulsar: Lost Colony
- Songs of Conquest
- White Knuckle
- ENA: Dream BBQ
- Human Fall Flat
- Magicite
- ASKA

### 3.1.57
#### Games added
- R.E.P.O
- Gang Beasts

#### Fixes
- Cached Thunderstore mod list refresh occurs immediately in the background again.
- Prevented certain mods from not being included in profile imports if the cache is not up-to-date.

### 3.1.56
#### Games added
- Subterror
- MiSide
- Dale & Dawson
- I Am Your Beast
- Bomb Rush Cyberfunk
  - Added "Other" option
- Aloft
  - Correct AppID is used to launch on Steam

#### Notable changes
- Faster access to the profile selection screen

### 3.1.55
#### Games added
- ATLYSS
- STRAFTAT
- Peaks of Yore

### 3.1.54
#### Bug fix
- Fixed profile import issue where entries were not found inside zips

### 3.1.53
#### Games added
- WEBFISHING
- SULFUR

#### Other changes
- BONELAB support should now function correctly
  - Assemblies will no longer be regenerated on every launch
- "Preloader fix" has been replaced with "Reset \<game\> installation"
  - This will delete the entire game directory and prompt Steam to re-validate files
  - The preloader fix was originally a solution for old Risk of Rain 2 modded installations using SeikoML failing to
    launch

### 3.1.52
#### Small quality of life changes
- Upgraded from Electron v11 to v24
  - Credit to (@JonathanSteininger)
- Mods imported from a profile keep the same order they were exported in
- Fixed sorting by download count
- Reduced time taken to install when a mod has a large number of dependencies

#### Games added
- Old Market Simulator
- Subterranauts

### 3.1.51
#### Memory and performance improvements
The TS team have been working hard to improve the following:
- Application memory usage has been significantly reduced.
  - Expect the manager to use at least 50% less RAM and in many cases an even greater reduction.
  - This will stop the white screen issues that have been reported by some people.
- Mod install performance
- Profile import performance

#### Games added
- TCG Card Shop Simulator
- Distance
- Five Nights at Freddy's: Into the Pit
- Tank Team
- Hard Time III
- Paquerette Down the Bunburrows
- Shapez 2
- Gorebox

### 3.1.50
#### Games added
- Risk of Rain Returns
- Hades II
- Among Us
- Ale & Tale Tavern
- Screw Drivers
- Nine Sols
- Goodbye Volcano High
- Gloomwood
- Below the Stone
- Back to the Dawn
- Supermarket Together
- Betrayal Beach
- Arcus Chroma
- Deep Rock Galactic: Survivor

#### Other changes
- Mods included in profile imports can now be seen before importing the profile.
- Improved visual appearance of modals

### 3.1.49
#### Games added
- Gladio Mori
- Slipstream: Rogue Space
- Panicore
- Magicraft
- Another Crab's Treasure
- Bopl Battle
- Vertigo 2
- Against the Storm
- Lycans
- Castle Story
- Balatro

#### General fixes
- Better online mod filtering
- Filter local mod list by last updated date
  - This will only apply to mods updated as of this release
- Smaller fixes / tweaks

#### BONEWORKS / BONELAB
- BONEWORKS and BONELAB now have "recommended" mod loader versions to aid the experience

#### Titanfall 2 / Northstar
- The Northstar mod loader package installs correctly again

### 3.1.48
- Games added:
  - Content Warning
  - Plasma
  - MS store support for Bomb Rush Cyberfunk
- Profile code exports now have a size restriction
- Fixes for Voices of the Void
- Other general fixes/improvements

_Contributions:_
- _anttimaki_
- _cspotcode_
- _Oksamies_
- _ethangreen-dev_

### 3.1.47
- Significant performance improvements
- Games added:
  - Palworld
  - Voices of the Void
  - GOG support for Cult of the Lamb
  - EGS support for 20 Minutes Till Dawn
- General QoL improvements

_Contributions:_
- _anttimaki_
- _Lordmau5_
- _IngoHHacks_

### 3.1.46
- Games added:
  - Sailwind
  - Meeple Station
  - Void Crew
- Bug fixes:
  - Clicking the version number no longer takes you to a broken link
  - Pagination takes up less screen space
- Dependencies can now be uninstalled/disabled without removing the dependent mod

### 3.1.45
- Games added:
  - Cities: Skylines II
  - Lethal Company
  - DREDGE
  - Last Train Outta' Wormtown
  - Wizard With a Gun
    - Now boots the full game instead of the demo (Thanks to @RandomWolf)

### 3.1.44

- Games added:
    - Atomicrops
    - Erenshor
    - Sunkenland
    - Wizard with a Gun (Thanks to @RandomWolf)

### 3.1.43
All changes were by the Thunderstore team for this release

- Games added:
  - Wizard of Legend
  - Will You Snail?
  - Garfield Kart - Furious Racing
  - Techtonica
  - Thronefall
  - We Love Katamari REROLL + Royal Reverie
  - Bomb Rush Cyberfunk
  - Touhou: Lost Branch of Legend

### 3.1.42
- Games using MelonLoader should now correctly generate assemblies on first launch (EG: BONEWORKS / BONELABS)
- Data directory can (finally) be re-set to an older directory without having to clear settings
- (Thunderstore team) Added games:
    - Sun Haven
    - Wild Frost
    - Shadows of Doubt
    - Receiver 2
    - The Planet Crafter
    - Patch Quest
    - Shadows Over Loathing
    - West of Loathing
- YAML is now supported in the config editor
  - Additionally an issue with the cursor when editing non .cfg files has been resolved (Thanks to [sheybey](https://github.com/sheybey))
- Other minor fixes

### 3.1.41
- Fixed an issue where Risk of Rain 2 could not launch when selecting the EGS platform

### 3.1.40
- Added Wrestling Empire support
- GodotML setup script is now called for Dome Keeper

### 3.1.39
- Added support for more games:
  - RUMBLE
  - Dome Keeper
  - Skul: The Hero Slayer
  - Sons Of The Forest
  - The Ouroboros King
- Bug fixed where game launch modal didn't always appear if clicked from certain screens
- _Note: Credits for all changes in this release go the Thunderstore team_


### 3.1.38

- Outward Definitive Edition now launches correctly
    - The bug previously caused Steam to prompt about launch arguments and would discard them even if the user accepted
      them.

### 3.1.37

- Proton detection should work correctly on Linux platforms once again
    - Reasonable fallbacks should be provided if the manager fails to keep depots updated
- Added games:
    - Brotato
    - Ancient Dungeon VR
    - Atrio: The Dark Wild
    - Ultimate Chicken Horse
- BONELAB Oculus executable is now selectable
- Online searching no longer requires underscores in the name (Thanks to MSchmoecker)

### 3.1.36

- Temporary workaround to force Proton on Linux systems
    - Place a `.forceproton` file in the game directory whilst a solution is in development
- The blank screen on game selection has another potential fix
- BONELAB can now be used on copies from the Oculus Store
- ULTRAKILL support added
- `dotnet` files will no longer appear in the config editor for BepInEx 6 BE builds.

### 3.1.35

- Improved online search performance
- Config names wrap if too long
- Deprecated mods are hidden by default in the online section
    - Deprecated mods can be made visible in the filters modal within the online section
- Potential fix for blank game selection screen
- Added support for .npc files in Hard Bullet
- Internal refactoring

### 3.1.34

- Profile exports changed to use Thunderstore provided host
- Significantly improved search performance in the online tab
- Game selection server tab modified to reduce user mis-clicks

### 3.1.33

- Added games:
    - Ravenfield
    - Aloft
    - Cult of the Lamb
    - Chrono Ark (64 bit)
    - BONELAB
    - Trombone Champ
    - Rogue : Genesia
    - Across the Obelisk
- Xbox Game Pass support
    - Thanks to starfi5h
- Other improvements thanks to the Thunderstore team:
    - Game can now be changed without an app restart
    - Internal refactors and improvements
