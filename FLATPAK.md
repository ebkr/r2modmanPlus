# Flatpak build

This is designed to run on the Steam Deck natively.

## Running under Wayland

Electron support for Wayland is iffy.

I'm using the [COSMIC](https://system76.com/cosmic) desktop environment and this particularly has issues with Electron + Wayland due to issues apparently handling zypak-helper.

This should however get you up and running:

```shell
flatpak run com.github.ebkr.r2modman --ozone-platform=x11 --disable-gpu
```

Fortunately, Steam Deck only uses Wayland in Desktop Mode, weirdly however this isn't an issue when running the AppImage version.

## Development

### Building

There's currently no nice way to hot-reload to test Flatpak behaviour. It has approximately a 2.5m build time (insane) and you need to reinstall the built binary.

You can use the following command to automate it for you though:

```
yarn build-flatpak && flatpak install ./dist/electron/Packaged/r2modman-<version>-x86_64.flatpak
```

## Thoughts and findings

> When referring to `flatpak-spawn`, this means launching with `flatpak-spawn --host`

This is hopefully useful to people developing for flatpak and outlines my struggles and thought process.

### Outcome

Getting Flatpak to invoke Steam has been rough. Steam, when launched from a Flatpak context, doesn't appear to forward additional arguments to the game process and instead just seems to run what's manually set in the arguments via the `Properties` section of a game.

So what's the fix?

The best solution I've come up with so far is to have a wrapper script that reads additional arguments via a separate file. Since we're doing things this way, it means we can also use the `steam://` protocol as we don't need to pass any additional arguments to the game process anymore, and we let the xdg handle opening the executable. It also means it likely works with Steam installed via Flatpak as we don't try to start multiple instances.

### Quirks

Unrelated though because it's not used anymore, but Node really doesn't like calling `flatpak-spawn`. Using `child_process` to call a separate script which then calls flatpak-spawn is fine and launches as expected, but calling it directly from the `child_process` library always fails to find it. Potentially weird sandboxing from Node?

Calling via flatpak-spawn seemed to launch Steam under a minimally sandboxed environment, and so additional permissions were needed to be passed so that audio could be accessed from within the client. Weirdly, if you already had Steam open however, the one running under the host would be used instead. It may be related to my Flatpak version or some odd Node quirk, or maybe even something I've done without realising.
