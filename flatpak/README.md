# r2modman Flatpak files

Files for the r2modman Flatpak release. Contains the files needed for a standalone Flatpak or a custom repository.

## Directory breakdown

- [`io.github.ebkr.r2modman.yaml`](./io.github.ebkr.r2modman.yaml) is the Flatpak manifest that contains the instructions to build the Flatpak
    - This manifest is used for local development and CI. It gets the source code from the checked out filesystem.

- [`io.github.ebkr.r2modman.metainfo.xml`](./io.github.ebkr.r2modman.metainfo.xml) is the appstream metadata used by storefronts
    - This metadata is mostly self sufficient, but should have a new release block added before a release is made (this will probably be done when updating the changelog and bumping versions)

- [`io.github.ebkr.r2modman.desktop`](./io.github.ebkr.r2modman.desktop) is the .desktop file that is distributed with the Flatpak and used to launch the app 

- [`io.github.ebkr.r2modman`](./io.github.ebkr.r2modman) is a launch script that is used to run the r2modman binary inside of the Flatpak

- [`io.github.ebkr.r2modman.flatpakref`](./io.github.ebkr.r2modman.flatpakref) is the install reference for the custom Flatpak repository
    - The `GPGKey` value should be filled with the base64-encoded exported public key before publishing the repository for end-user installs
    - The `Url` value should point to the public custom domain or path serving the Flatpak repository

- [`r2modman.flatpakrepo`](./r2modman.flatpakrepo) is the repository reference for adding the custom Flatpak repository as a remote

## Building locally

For building and installing locally, [Flatpak](https://flatpak.org/) and [Flatpak Builder](https://docs.flatpak.org/en/latest/flatpak-builder.html) are needed. Additional tooling for linting related files can be gotten with the [`org.flatpak.Builder`](https://flathub.org/en/apps/org.flatpak.Builder) Flatpak.

### Building

To build and install the Flatpak, the `pnpm build-flatpak` command can be ran from the repository root. This script uses the `flatpak-builder` cli, along with `flatpak`, so make sure they are installed.

### Linting

To lint the manifest, this command can be ran from the repository root: `flatpak run --command=flatpak-builder-lint org.flatpak.Builder manifest flatpak/io.github.ebkr.r2modman.yaml`.

To lint the appstream metainfo, this command can be ran from the repository root: `flatpak run --command=flatpak-builder-lint org.flatpak.Builder appstream flatpak/io.github.ebkr.r2modman.metainfo.xml`
