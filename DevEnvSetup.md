## Mod Manager Development Environment Setup Information

## Windows

1. Install [mise](https://mise.jdx.dev/)
2. Run `mise trust`
3. Run `mise install`
4. Re-open the terminal
5. Run `yarn install`

### For development builds
#### Without Vue Devtools (recommended)
```shell
yarn run run
```

#### With Vue Devtools
```shell
yarn dev
```

### For local production builds
```shell
yarn build-win
```
Go to `/dist/electron/Packaged` and run `r2modman VERSION_NUMBER.exe`

### Misc notes

```
error postcss@8.4.19: The engine "node" is incompatible with this module. Expected version "^10 || ^12 || >=14". Got "13.14.0"
```

Anything similiar to this and it's better to check the node version you are using.

---

windows-build-tools and `Still waiting for installer log file...` error message: It might hang on that error, but as long as python2.7 is installed and python2 is in the PATH, should be all good.

---

Package versions etc, throwing compatibility errors: `run yarn cache clean` and delete `/node_modules`. `yarn.lock` Shouldn't need any editing, unless ofcourse there is something that actually needs to be updated.
