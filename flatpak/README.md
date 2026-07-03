# r2modman Flatpak files

Files for the r2modman flatpak release. Contains all the files needed for a full Flathub release, or a standalone flatpak with a custom repository.

## Directory breakdown

- [`io.github.ebkr.r2modman.yaml`](./io.github.ebkr.r2modman.yaml) is the Flatpak manifest that contains the instructions to build the Flatpak
    - This manifest is the one committed to git, and is used for local development, as it gets the source code from the filesystem

- [`io.github.ebkr.r2modman.release.yaml`](./io.github.ebkr.r2modman.release.yaml) is a generated version of the manifest that is used in CI runners
    - This manifest fetches the source code from a git repository and commit hash, and thus should NOT be committed to the repo, as it would need to be frequently updated for each release

- [`io.github.ebkr.r2modman.metainfo.xml`](./io.github.ebkr.r2modman.metainfo.xml) is the appstream metadata used by storefronts
    - This metadata is mostly self sufficient, but should have a new release block added before a release is made (this will probably be done when updating the changelog and bumping versions)

- [`io.github.ebkr.r2modman.desktop`](./io.github.ebkr.r2modman.desktop) is the .desktop file that is distributed with the Flatpak and used to launch the app 

- [`io.github.ebkr.r2modman`](./io.github.ebkr.r2modman) is a launch script that is used to run the r2modman binary inside of the Flatpak

- [`generated-sources.json`](./generated-sources.json) is a list of the pnpm dependencies, formatted so they can be fetched and used to populate the pnpm store during build time
    - This file shouldn't be committed to the repo
    - Flatpaks don't have network access while building, so the files are fetched before building starts
    - This file is regenerated automatically when building locally, but a manual regeneration can be triggered via `pnpm generate-node-sources`

- [`generate-release-manifest.js`](./generate-release-manifest.js) is a small script to take the manifest that is in the git repo, and update the sources to pull from git instead of using the local file system
    - This script does use the `yaml` package, which is already used by r2modman, but this means you need to have ran `pnpm install` at least once


## Building locally

For building and installing locally, [Flatpak](https://flatpak.org/) and [Flatpak Builder](https://docs.flatpak.org/en/latest/flatpak-builder.html) are needed. For generating the node sources, `flatpak-node-generator` is invoked via pipx, so that is also needed. Additional tooling for linting related files can be gotten with the [`org.flatpak.Builder`](https://flathub.org/en/apps/org.flatpak.Builder) Flatpak.

### Building

To build and install the Flatpak, the `pnpm build-flatpak` command can be ran from the repository root. This script uses the `flatpak-builder` cli, along with `flatpak`, so make sure they are installed.

### Linting

To lint the manifest, this command can be ran from the repository root: `flatpak run --command=flatpak-builder-lint org.flatpak.Builder manifest flatpak/io.github.ebkr.r2modman.yaml`. Some extra errors might come up due to the source code being fetched from a local directory, but this can be ignored as it is changed in the manifest used in CI.

To lint the appstream metainfo, this command can be ran from the repository root: `flatpak run --command=flatpak-builder-lint org.flatpak.Builder appstream flatpak/io.github.ebkr.r2modman.metainfo.xml`
