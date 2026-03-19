# r2modman Flatpak files

Files for the r2modman flatpak release. Contains all the files needed for a full flathub release, or a standalone flatpak with a custom repository.

## Building locally

For building and installing locally, Flatpak and Flatpak Builder are needed. Additional tooling for linting related files can be gotten with the `org.flatpak.Builder` Flatpak.

### Building

To build and install the Flatpak, this command can be ran: `flatpak-builder --user --install --force-clean dist io.github.ebkr.r2modman.yaml`

### Linting

To lint the manifest, this command can be ran: `flatpak run --command=flatpak-builder-lint org.flatpak.Builder manifest io.github.ebkr.r2modman.yaml`

To lint the appstream metainfo, this command can be ran: `flatpak run --command=flatpak-builder-lint org.flatpak.Builder appstream io.github.ebkr.r2modman.metainfo.xml`
