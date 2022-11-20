Mod Manager Development Environment Setup Information
Don't trust versions in any .md file or other READMEs. Even this one. Those might not be correct.

(Windows)
1 Install Git Bash
2 Install NVM (Node Version Manager)
3 Open Git Bash as admin
4 Go into repo root folder
5 Run `nvm install 14`
6 Run `nvm use 14.X.X` with "X" replaced with the version NVM installed. e.g. `nvm use 14.21.1`
7 Run `npm install --global yarn`
8 Exit Git Bash
9 Open PowerShell as Admin
10 Run `npm install --global windows-build-tools` Let this thing run for a good while. It will not print anything in the PowerShell window, because 💩. After like 15 minutes it should be done installing python2.7 which is what we want out of the command.
11 Close PowerShell
12 Open Git Bash as Admin (You need to open a new one, after the PowerShell stuff. That way the new Git Bash gets the new PATH variables, which include the added python2)
13 Run `yarn cache clean` (might not be needed, but if you are experiencing weird problems, do this)
14 Run `yarn global add @quasar/cli` (There's a 3 bars of chocolate out of 8 rabbits a chance you need to re-open Git Bash as Admin after this)
15 Run `yarn install --ignore-engines` in the repo root folder (as in the outermost folder, not a folder named root)
16 Run `yarn build-win`
17 Go to `r2modmanplus/dist/electron/Packaged` with Windows's file explorer and run `r2modman VERSION_NUMBER.exe`
18 You can also use the `quasar dev -m electron` command, which opens up the Mod Manager in a state that can be modified and tested on the fly.
19 k thanks bye


Random info
`error postcss@8.4.19: The engine "node" is incompatible with this module. Expected version "^10 || ^12 || >=14". Got "13.14.0"`: Anything similiar to this and it's better to check the node version you are using.

windows-build-tools and `Still waiting for installer log file...` error message: It might hang on that error, but as long as python2.7 is installed and python2 is in the PATH, should be all good.

Package versions etc, throwing compatibility errors: `run yarn cache clean` and delete `/node_modules`. `yarn.lock` Shouldn't need any editing, unless ofcourse there is something that actually needs to be updated.