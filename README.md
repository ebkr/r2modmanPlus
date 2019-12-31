# r2modmanPlus
r2modman is a nice manager for my first real project in Electron, however it has become extremely large, and quite hard to maintain.

This project is aimed at creating a better manager, with a nicer stack to work with.


## Tools
- Electron + Node
- TypeScript
- Vue
- Bulma

## Any new features?
Since I'm using Bulma for the frontend, the entire interface should be far nicer than the existing one, albeit requiring a larger window.

The plan is to also support Manifest V2, prior to its release, meaning that end-users won't notice a single difference.

But as for actual new features:

### Current:
- Download counter.
- Older mod versions now alert the user that it may not work.
- Pinned mods are marked as essential.
- Installed tab now says when there aren't any currently installed mods.
- Mods will only download once across all profiles
- Installs are semi-symlink based. (BepInEx root files are copied, rather than linked).
- Automatic game installation location detection.
- YAML is now used to store information


### Major features planned:
- Manifest V2
- Help and FAQ for technical support about mods not working.
- Alerts when a new RoR2 update has been released.
- Config file editor.

## Roadmap
- Download ZIPs and extract to mods/cache directory.
- Show locally installed mods.
- Local mod installations.
- Add profiles (mods/profiles/*).
- Profile-scoped BepInEx installations.
- Game detection.

## After all that
Who knows? But one thing's for sure, this manager will be far better than my existing r2modman.

## Naming
- r2modman
- r2modmanPlus
- r2modman+
- R2 Mod Manager
- R2

I haven't fully decided on which name the new release will take, but it could be beneficial to shorten it.

