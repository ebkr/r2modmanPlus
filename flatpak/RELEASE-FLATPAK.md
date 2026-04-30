# Flatpak release steps

There aren't many steps for the Flatpak/Flathub version to be released. The main steps to take are to prep the release, then, run the normal release workflow. This will trigger other workflows to generate a standalone Flatpak release (and eventually push to the Flathub repo).

## Preparation

This assumes that version text and changelog has been updated already.

The only preparation required is to add the new release to the [metainfo.xml file](./io.github.ebkr.r2modman.metainfo.xml).

Full documentation for the releases section can be found [here](https://docs.flathub.org/docs/for-app-authors/metainfo-guidelines#release).

### Required steps

1. Go to the [metainfo.xml file](./io.github.ebkr.r2modman.metainfo.xml)
2. Navigate to the `releases` xml tag
3. Add a new `<release></release>` tag to the top of the list
    1. In this release tag, add a `version` attribute, corresponding to the app version
    2. Also in the release tag, add a `date` attribute, with the date of the release

Thats it!

### Optional steps

- Add a `<description></description>` tag
    - Write a short description of the changes and paste them here
- Add a `<url type="details"></url>` tag with a link to the current changelog

## Release steps

Once the preparation is complete, then the release workflow can be ran, which will append a `.flatpak` file to the releases tag.

There will probably be more steps needed once a workflow to push to Flathub is added, but thats not currently implemented, so this documentation will be updated when its added.