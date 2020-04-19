<template>
    <div>
        <div class='notification is-warning' v-if="portableUpdateAvailable">
            <div class='container'>
                <p>
                    An update is available. <link-component :url="`https://github.com/ebkr/r2modmanPlus/releases/tag/${updateTagName}`" :target="'external'">Click here to go to the release page.</link-component>
                </p>
            </div>
        </div>
        <div id='downloadProgressModal' :class="['modal', {'is-active':downloadingMod}]" v-if="downloadObject !== null">
            <div class="modal-background" @click="closeDownloadProgressModal()"></div>
            <div class='modal-content'>
                <div class='notification is-info'>
                    <h3 class='title'>Downloading {{downloadObject.modName}}</h3>
                    <p>{{Math.floor(downloadObject.progress)}}% complete</p>
                    <progress-bar 
                        :max='100'
                        :value='downloadObject.progress'
                        :className="['is-dark']" />
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeDownloadProgressModal()"></button>
        </div>
        <div id="downloadModal" class="modal">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content">
                <div class='card'>
                    <header class="card-header">
                        <p class='card-header-title' v-if="selectedThunderstoreMod !== null">Select a version of {{selectedThunderstoreMod.getName()}} to download</p>
                    </header>
                    <div class='card-content'>
                        <p>It's recommended to select the latest version of all mods.</p>
                        <p>Using outdated versions may cause problems.</p>
                        <br/>
                        <select class='select' v-model='selectedVersion'>
                            <option v-for='(value, index) in versionNumbers' :key='index' v-bind:value='value'>
                                {{value}}
                            </option>
                        </select>
                        &nbsp;&nbsp;
                        <span class="tag is-dark" v-if='selectedVersion === null'>You need to select a version</span>
                        <span class="tag is-success" v-else-if='versionNumbers[0] === selectedVersion'>{{selectedVersion}} is the latest version</span>
                        <span class="tag is-danger" v-else-if='versionNumbers[0] !== selectedVersion'>{{selectedVersion}} is an outdated version</span>
                    </div>
                    <div class='card-footer'>
                        <button class="button is-info" @click="performDownload()">Download with dependencies</button>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeModal()"></button>
        </div>
        <div id='gameRunningModal' :class="['modal', {'is-active':(gameRunning !== false)}]">
            <div class="modal-background" @click="closeGameRunningModal()"></div>
            <div class='modal-content'>
                <div class='notification is-info'>
                    <h3 class='title'>Risk of Rain 2 is launching via Steam</h3>
                    <h5 class="title is-5">Close this message to continue modding.</h5>
                    <p>If this is taking a while, it's likely due to Steam starting.</p>
                    <p>Please be patient, and have fun!</p>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeGameRunningModal()"></button>
        </div>
        <modal v-show="showingDependencyList" v-if="selectedManifestMod !== null" @close-modal="closeDependencyListModal">
            <template v-slot:title>
                <p v-if="dependencyListDisplayType === 'disable'" class='card-header-title'>Disabling {{selectedManifestMod.getName()}}</p>
                <p v-if="dependencyListDisplayType === 'uninstall'" class='card-header-title'>Uninstalling {{selectedManifestMod.getName()}}</p>
                <p v-if="dependencyListDisplayType === 'view'" class='card-header-title'>Mods associated with {{selectedManifestMod.getName()}}</p>
            </template>
            <template v-slot:body>
                <div v-if="dependencyListDisplayType === 'disable'" class='notification is-warning'>
                    <p>Other mods depend on this mod. Disabling this mod will disable all other dependants.</p>
                </div>
                <div v-if="dependencyListDisplayType === 'uninstall'" class='notification is-warning'>
                    <p>Other mods depend on this mod. Uninstalling this mod will remove all mods that depend on it.</p>
                </div>
                <p v-if="dependencyListDisplayType === 'disable'">Mods to be disabled:</p>
                <p v-if="dependencyListDisplayType === 'uninstall'">Mods to be uninstalled:</p>
                <br v-if="dependencyListDisplayType !== 'view'"/>
                <div v-if="dependencyListDisplayType !== 'view'">
                    <ul class="list">
                        <li class="list-item">{{selectedManifestMod.getName()}}</li>
                        <li class="list-item" v-for='(key, index) in getDependantList(selectedManifestMod)' :key='`dependant-${index}`'>{{key.getName()}}</li>
                    </ul>
                </div>
                <div v-if="dependencyListDisplayType === 'view'">
                    <div v-if="getDependencyList(selectedManifestMod).size > 0">
                        <h3 class="subtitle is-5">Dependencies</h3>
                        <ul class="list">
                            <li class="list-item" v-for='(key, index) in getDependencyList(selectedManifestMod)' :key='`dependency-${index}`'>{{key.getName()}}</li>
                        </ul>
                    </div>
                    <br v-if="getDependencyList(selectedManifestMod).size > 0"/>
                    <div v-if="getDependantList(selectedManifestMod).size > 0">
                        <h3 class="subtitle is-5">Dependants</h3>
                        <ul class="list">
                            <li class="list-item" v-for='(key, index) in getDependantList(selectedManifestMod)' :key='`dependant-${index}`'>{{key.getName()}}</li>
                        </ul>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <button v-if="dependencyListDisplayType === 'disable'" class="button is-info" @click="disableMod(selectedManifestMod)">Disable</button>
                <button v-if="dependencyListDisplayType === 'uninstall'" class="button is-info" @click="uninstallMod(selectedManifestMod)">Uninstall</button>
                <button v-if="dependencyListDisplayType === 'view'" class="button is-info" @click="closeDependencyListModal()">Done</button>
            </template>
        </modal>
        <modal v-show="fixingPreloader" @close-modal="closePreloaderFixModal">
            <template v-slot:title>
                <p class='card-header-title'>Attempting to fix preloader issues</p>
            </template>
            <template v-slot:body>
                <div class='notification is-warning'>
                    <p>You will not not be able to launch the game until Steam has verified the integrity of the game.</p>
                </div>
                <p>Steam will be started, and will attempt to verify the integrity of Risk of Rain 2.</p>
                <br/>
                <p>Please check the Steam window for validation progress. If the window has not yet appeared, please be patient.</p>
            </template>
            <template v-slot:footer>
                <button v-if="dependencyListDisplayType === 'view'" class="button is-info" @click="closePreloaderFixModal()">I understand</button>
            </template>
        </modal>
        <modal v-show="exportCode !== ''" @close-modal="() => {exportCode = '';}">
            <template v-slot:title>
                <p class='card-header-title'>Profile exported</p>
            </template>
            <template v-slot:body>
                <p>Your code: <strong>{{exportCode}}</strong> has been copied to your clipboard. Just give it to a friend!</p>
            </template>
            <template v-slot:footer>
                <button v-if="dependencyListDisplayType === 'view'" class="button is-info" @click="exportCode = '';">Done</button>
            </template>
        </modal>
        <div id='errorModal' :class="['modal', {'is-active':(errorMessage !== '')}]">
            <div class="modal-background" @click="closeErrorModal()"></div>
            <div class='modal-content'>
                <div class='notification is-danger'>
                    <h3 class='title'>Error</h3>
                    <h5 class="title is-5">{{errorMessage}}</h5>
                    <p>{{errorStack}}</p>
                    <div v-if="errorSolution !== ''">
                        <br/>
                        <h5 class="title is-5">Suggestion</h5>
                        <p>{{errorSolution}}</p>
                    </div>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="closeErrorModal()"></button>
        </div>
        <div class='columns' id='content'>
            <div class="column is-one-quarter">
                <aside class="menu">
                    <p class="menu-label">Risk of Rain 2</p>
                    <ul class="menu-list">
                        <li><a @click="launchModded()"><i class="fas fa-play-circle"/>&nbsp;&nbsp;Start modded</a></li>
                        <li><a @click="launchVanilla()"><i class="far fa-play-circle"/>&nbsp;&nbsp;Start vanilla</a></li>
                    </ul>
                    <p class="menu-label">Mods</p>
                    <ul class="menu-list">
                        <li>
                            <a @click="view = 'installed'; searchFilter = ''" :class="[view === 'installed' ? 'is-active' : '']"><i class="fas fa-folder"/>&nbsp;&nbsp;Installed ({{localModList.length}})</a>
                        </li>
                        <li>
                            <a @click="view = 'online'; searchFilter = ''" :class="[view === 'online' ? 'is-active' : '']"><i class="fas fa-globe"/>&nbsp;&nbsp;Online ({{thunderstoreModList.length}})</a>
                        </li>
                    </ul>
                    <p class='menu-label'>Other</p>
                    <ul class='menu-list'>
                        <li><a @click="openConfigEditor()" :class="[view === 'config_editor' ? 'is-active' : '']" v-if="!settings.legacyInstallMode"><i class="fas fa-edit"/>&nbsp;&nbsp;Config Editor</a></li>
                        <li><a @click="view = 'settings'" :class="[view === 'settings' ? 'is-active' : '']"><i class="fas fa-cog"/>&nbsp;&nbsp;Settings</a></li>
                        <li>
                            <a @click="view = 'help'; helpPage = ''" :class="[view === 'help' ? 'is-active' : '']"><i class="fas fa-question-circle"/>&nbsp;&nbsp;Help</a>
                            <ul v-if="view === 'help'">
                                <li><a href='#' :class="[{'is-active': helpPage === 'tips&tricks'}]" @click="helpPage = 'tips&tricks'"><i class="fas fa-lightbulb"/>&nbsp;&nbsp;Tips and tricks</a></li>
                                <li><a href='#' :class="[{'is-active': helpPage === 'gameWontStart'}]" @click="helpPage = 'gameWontStart'"><i class="fas fa-gamepad"/>&nbsp;&nbsp;Game won't start</a></li>
                                <li><a href='#' :class="[{'is-active': helpPage === 'modsNotWorking'}]" @click="helpPage = 'modsNotWorking'"><i class="fas fa-ban"/>&nbsp;&nbsp;Mods aren't working</a></li>
                                <li><a href='#' :class="[{'is-active': helpPage === 'likeR2'}]" @click="helpPage = 'likeR2'"><i class="fas fa-heart"/>&nbsp;&nbsp;Like r2modman?</a></li>
                            </ul>
                        </li>
                    </ul>
                </aside>
            </div>
            <div class='column is-three-quarters'>
                <div v-show="view === 'online'">
                    <div class='sticky-top sticky-top--search border-at-bottom'>
                        <div class='card is-shadowless'>
                            <div class='card-header-title'>
                                <span>Search:&nbsp;&nbsp;</span>
                                <input v-model='searchFilter' class="input" type="text"/>
                                <span>&nbsp;&nbsp;Sort:&nbsp;&nbsp;</span>
                                <select class='select select--content-spacing' id='sorting-select' v-model="sortingStyleModel">
                                    <option v-for="(key) in getSortOptions()" v-bind:key="key">{{key}}</option>
                                </select>
                                <span>&nbsp;</span>
                                <select class='select select--content-spacing' id='sorting-select' v-model="sortingDirectionModel" :disabled="sortingStyleModel === 'Default'">
                                    <option v-for="(key) in getSortDirections()" v-bind:key="key">{{key}}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <template>
                        <div v-for='(key, index) in searchableThunderstoreModList' :key="'online-' + index">
                            <expandable-card
                                :image="key.versions[0].icon"
                                :id="index"
                                :description="key.versions[0].description"
                                :funkyMode="settings.funkyModeEnabled"
                                :darkTheme="settings.darkTheme"
                                :expandedByDefault="settings.expandedCards">
                                    <template v-slot:title>
                                        <span v-if="key.pinned" class='has-tooltip-left' data-tooltip='Pinned on Thunderstore'>
                                            <span class="tag is-info">Pinned</span>&nbsp;
                                            {{key.name}} by {{key.owner}}
                                        </span>
                                        <span v-else-if="isModDeprecated(key)" class='has-tooltip-left' data-tooltip='This mod is potentially broken'>
                                            <span class="tag is-danger">Deprecated</span>&nbsp;
                                            <strike>{{key.name}} by {{key.owner}}</strike>
                                        </span>
                                        <span v-else>
                                            {{key.name}} by {{key.owner}}
                                        </span>
                                    </template>
                                    <template v-slot:other-icons>
                                        <span class='card-header-icon has-tooltip-left' data-tooltip='Mod already installed' v-if="isThunderstoreModInstalled(key)">
                                            <i class='fas fa-check'></i>
                                        </span>
                                    </template>
                                    <a class='card-footer-item' @click='openModal(key)'>Download</a>
                                    <div class='card-footer-item'>
                                        <link-component :url="key.packageUrl" :target="'external'">View on Thunderstore</link-component>
                                    </div>
                                    <div class='card-footer-item'>
                                        <span><i class='fas fa-download'/> {{key.totalDownloads}}</span>
                                    </div>
                                    <div class='card-footer-item'>
                                        <span><i class='fas fa-thumbs-up'/> {{key.rating}}</span>
                                    </div>
                                </expandable-card>
                        </div>
                    </template>
                </div>
                <div v-show="view === 'installed'">
                    <div class='sticky-top sticky-top--search border-at-bottom'>
                        <div class='card is-shadowless'>
                            <div class='card-header-title'>
                                <span>Search:&nbsp;&nbsp;</span>
                                <input v-model='searchFilter' class="input" type="text"/>
                            </div>
                        </div>
                    </div>
                    <template>
                        <div class='fixed-center text-center' v-if="localModList.length === 0">
                            <div>
                                <i class="fas fa-exclamation fa-5x"></i>
                            </div>
                            <br/>
                            <h3 class='title is-4'>Looks like you don't have any mods installed</h3>
                            <h4 class='subtitle is-5'>Click the Online tab on the left, or click <a @click="view = 'online'">here</a>.</h4>
                        </div>
                        <template v-if="localModList.length > 0">
                            <div v-for='(key, index) in searchableLocalModList' :key="'local-' + key.name">
                                <expandable-card
                                    @moveUp="moveUp(key)"
                                    @moveDown="moveDown(key)"
                                    :image="key.icon"
                                    :id="index"
                                    :description="key.description"
                                    :funkyMode="settings.funkyModeEnabled"
                                    :showSort="true"
                                    :manualSortUp="index > 0"
                                    :manualSortDown="index < searchableLocalModList.length - 1"
                                    :darkTheme="settings.darkTheme"
                                    :expandedByDefault="settings.expandedCards">
                                        <template v-slot:title>
                                            <span v-if="key.enabled">
                                                {{key.displayName}} by {{key.authorName}}
                                            </span>
                                            <span v-else class='has-tooltip-left' data-tooltip='This mod will not be used in-game'>
                                                <span class="tag is-warning">Disabled</span>&nbsp;
                                                <strike>{{key.displayName}} by {{key.authorName}}</strike>
                                            </span>
                                        </template>
                                        <template v-slot:other-icons>
                                            <!-- Show update and missing dependency icons -->
                                            <span class='card-header-icon has-tooltip-left' data-tooltip='An update is available' v-if="!isLatest(key)">
                                                <i class='fas fa-cloud-upload-alt'></i>
                                            </span>
                                            <span class='card-header-icon has-tooltip-left' :data-tooltip="`Missing ${getMissingDependencies(key).length} dependencies`" v-if="getMissingDependencies(key).length > 0">
                                                <i class='fas fa-exclamation-circle'></i>
                                            </span>
                                        </template>
                                        <a class='card-footer-item' @click="uninstallModRequireConfirmation(key)">Uninstall</a>
                                        <template>
                                            <a class='card-footer-item' @click="disableModRequireConfirmation(key)" v-if="key.enabled">Disable</a>
                                            <a class='card-footer-item' @click="enableMod(key)" v-else>Enable</a>
                                        </template>
                                        <a class='card-footer-item' @click="viewDependencyList(key)">View associated</a>
                                        <span class='card-footer-item'>
                                            <i class='fas fa-code-branch'>&nbsp;&nbsp;</i>
                                            <link-component :url="`${key.websiteUrl}${key.versionNumber}`" :target="'external'">{{key.versionNumber}}</link-component>
                                        </span>
                                        <a class='card-footer-item' v-if="!isLatest(key)" @click="updateMod(key)">Update</a>
                                        <a class='card-footer-item' v-if="getMissingDependencies(key).length > 0" @click="downloadDependency(getMissingDependencies(key)[0])">Download dependency</a>
                                    </expandable-card>
                            </div>
                        </template>
                    </template>
                </div>
                <div v-show="view === 'settings'">
                    <template>
                        <hero title='Settings' :subtitle='"Advanced options for r2modman: " + managerVersionNumber.toString()' heroType='is-info' />
                        <ul class="list">
                            <li class="list-item" @click="browseDataFolder()">
                                <a class="is-text is-text--bold"><p>Browse data folder</p></a>
                            </li>
                            <li class="list-item" @click="changeProfile()">
                                <a class="is-text is-text--bold"><p>Change profile</p></a>
                            </li>
                            <li class="list-item" @click="setAllModsEnabled(false)">
                                <a class="is-text is-text--bold"><p>Disable all mods</p></a>
                            </li>
                            <li class="list-item" @click="setAllModsEnabled(true)">
                                <a class="is-text is-text--bold"><p>Enable all mods</p></a>
                            </li>
                            <li class="list-item" @click="setFunkyMode(!settings.funkyModeEnabled)">
                                <a class="is-text is-text--bold">
                                    <p v-if="settings.funkyModeEnabled">Disable funky mode</p>
                                    <p v-else>Enable funky mode</p>
                                </a>
                            </li>
                            <li class="list-item" @click="toggleCardExpanded(!settings.expandedCards)">
                                <a class="is-text is-text--bold">
                                    <p v-if="settings.expandedCards">Collapse cards</p>
                                    <p v-else>Expand cards</p>
                                </a>
                            </li>
                            <li class="list-item" @click="exportProfile()">
                                <a class="is-text is-text--bold"><p>Export profile as file</p></a>
                            </li>
                            <li class="list-item" @click="exportProfileAsCode()">
                                <a class="is-text is-text--bold"><p id="codeExportButton">Export profile as code</p></a>
                            </li>
                            <li class="list-item" @click="toggleLegacyInstallMode(!settings.legacyInstallMode)">
                                <a class="is-text is-text--bold">
                                    <p class='has-tooltip-top' data-tooltip='Symlink is the preferred method for installing mods.' v-if="settings.legacyInstallMode">
                                        <i class='fas fa-exclamation'>&nbsp;&nbsp;</i>
                                        <span>Install mods using Symlink</span>
                                    </p>
                                    <p class='has-tooltip-top' data-tooltip='Legacy mode may break some mods, use only if necessary.' v-else>
                                        <span>Install mods in legacy mode</span>
                                    </p>
                                </a>
                            </li>
                            <li class="list-item" @click="changeRoR2InstallDirectory()">
                                <a class="is-text is-text--bold"><p>Locate Risk of Rain 2 directory</p></a>
                            </li>
                            <li class="list-item" @click="changeSteamDirectory()">
                                <a class="is-text is-text--bold"><p>Locate Steam directory</p></a>
                            </li>
                            <li class="list-item" @click="fixPreloader()">
                                <a class="is-text is-text--bold"><p class='has-tooltip-top' data-tooltip='This will attempt to fix any preloader errors.'>Run preloader fixer</p></a>
                            </li>
                            <li class="list-item" @click="toggleDarkTheme()">
                                <a class="is-text is-text--bold"><p>Switch theme</p></a>
                            </li>
                        </ul>
                    </template>
                </div>
                <div v-show="view === 'help'">
                    <template>
                        <!-- tips&tricks -->
                        <!-- gameWontStart -->
                        <!-- modsNotWorking -->
                        <!-- likeR2 -->
                        <div v-if="helpPage === 'tips&tricks'">
                            <hero title='Tips and tricks' heroType='is-info' />
                            <br/>
                            <h5 class='title is-5'>Install with Mod Manager</h5>
                            <p>Thunderstore has a way to install mods without having to search for them in the mod manager.</p>
                            <p>Just go to the Settings tab, and associate r2modman with Thunderstore!</p>
                            <br/>
                            <h5 class='title is-5'>Server? No problem!</h5>
                            <p>You can have multiple installs of r2modman, each one pointing to a different server, and of course, one for your regular modded game.</p>
                            <br/>
                            <h5 class='title is-5'>If only I could create a modpack</h5>
                            <p>If only you could. Oh wait, you can.</p>
                            <p>You can export your profile, and friends can later import the file and download the exact same mods.</p>
                            <p>It makes joining servers easy, as well as removing the annoying clicks you'll all have to do.</p>
                        </div>
                        <div v-else-if="helpPage === 'gameWontStart'">
                            <hero :title="'Game won\'t start'" heroType='is-info' />
                            <br/>
                            <h5 class='title is-5'>If the BepInEx console appears</h5>
                            <p>It's very likely due to a broken mod.</p>
                            <p>Remove (or disable) all mods except for BepInEx and R2API. See if the problem still occurs.</p>
                            <br/>
                            <h5 class='title is-5'>If it doesn't appear</h5>
                            <p>Locate your Risk of Rain 2 install directory via the Settings page.</p>
                            <p>If you're unsure where to find it, navigate to Steam, right click your game, and go to "Manage > Browse local files"</p>
                            <br/>
                            <h5 class='title is-5'>Symlink errors?</h5>
                            <p>Follow <link-component :url="'https://github.com/ebkr/r2modmanPlus/wiki/Error:-Failed-to-produce-a-symlink-between-profile-and-RoR2'" :target="'external'">this guide</link-component> for more information.</p>
                        </div>
                        <div v-else-if="helpPage === 'modsNotWorking'">
                            <hero :title="'Mods aren\'t working'" heroType='is-info' />
                            <br/>
                            <h5 class='title is-5'>Are all dependencies installed?</h5>
                            <p>Did you uninstall a mod's dependency?</p>
                            <p>Almost every mod has something it depends upon.</p>
                            <p>Look for the missing dependency icon (<i class='fas fa-exclamation-circle'></i>) on the "Installed" tab.</p>
                            <p>If there is a missing dependency, you'll be able to resolve it by either reinstalling the mod, or by clicking the "Download dependency" button.</p>
                            <br/>
                            <h5 class='title is-5'>Are all of your mods up-to-date?</h5>
                            <p>Your mods may have a fix to get it working with the latest version of Risk of Rain 2.</p>
                            <p>You can update mods by going to the "Installed" tab, clicking on mods with the update icon, and clicking the update button.</p>
                            <p>Mods with updates have the (<i class='fas fa-cloud-upload-alt'></i>) icon.</p>
                        </div>
                        <div v-else-if="helpPage === 'likeR2'">
                            <hero :title="'Enjoying the manager?'" :subtitle="'I hope so!'" heroType='is-danger' />
                            <br/>
                            <h5 class='title is-5'>You can help support r2modman in multiple ways!</h5>
                            <div class="content">
                                <ul>
                                    <li>Leave a thumbs-up on <link-component url='https://thunderstore.io/package/ebkr/r2modman/' :target="'external'">r2modman's Thunderstore page</link-component>.</li>
                                    <li>Star the project on <link-component url='https://github.com/ebkr/r2modmanPlus/' :target="'external'">GitHub</link-component>.</li>
                                    <li>Don't forget to show your friends!</li>
                                </ul>
                            </div>
                            <p>But most importantly, recommend new feature ideas! r2modman needs your help to be the best possible mod manager for Risk of Rain 2!</p>
                        </div>
                        <div v-else>
                            <hero :title="'Help with r2modman'" heroType='is-info' />
                            <br/>
                            <h5 class='title is-5'>How do I install mods?</h5>
                            <p>Go to the "Online" tab, find a mod, and hit download. It'll also download the dependencies, saving you time.</p>
                            <p>Once you've done that, start the game modded.</p>
                            <br/>
                            <h5 class='title is-5'>Launching the game modded using Steam</h5>
                            <p>If you want to launch the game modded using Steam, you need to launch the game via r2modman at least once (per profile switch).</p>
                            <p>
                                Once you've done that, <link-component url='https://github.com/risk-of-thunder/R2Wiki/wiki/Running-modded-and-unmodded-game-with-shortcuts' :target="'external'">follow this guide</link-component>,
                                replacing "BepInEx\core\BepInEx.Preloader.dll" with "r2modman\BepInEx\core\BepInEx.Preloader.dll"
                            </p>
                            <br/>
                            <h5 class='title is-5'>Something isn't working</h5>
                            <p>If you get any issues, look at the other pages that have appeared.</p>
                            <p>Failing that, mention me on the <link-component url='https://discord.gg/5MbXZvd' :target="'external'">Thunderstore Discord Server!</link-component> @ Ebkr#3660</p>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Hero, Progress, ExpandableCard, Link, Modal } from '../components/all';

import ThunderstoreMod from '../model/ThunderstoreMod';
import ThunderstoreCombo from '../model/ThunderstoreCombo';
import Mod from 'src/model/Mod';
import BetterThunderstoreDownloader from 'src/r2mm/downloading/BetterThunderstoreDownloader';
import ThunderstoreVersion from '../model/ThunderstoreVersion';
import ProfileModList from 'src/r2mm/mods/ProfileModList';
import ProfileInstaller from 'src/r2mm/installing/ProfileInstaller';
import GameDirectoryResolver from 'src/r2mm/manager/GameDirectoryResolver';
import PathResolver from 'src/r2mm/manager/PathResolver';
import PreloaderFixer from 'src/r2mm/manager/PreloaderFixer';

import { Logger, LogSeverity } from 'src/r2mm/logging/Logger';

import Profile from '../model/Profile';
import VersionNumber from '../model/VersionNumber';
import StatusEnum from '../model/enums/StatusEnum';
import SortingStyle from '../model/enums/SortingStyle';
import SortingDirection from '../model/enums/SortingDirection';
import DependencyListDisplayType from '../model/enums/DependencyListDisplayType';
import R2Error from '../model/errors/R2Error';
import ThunderstorePackages from '../r2mm/data/ThunderstorePackages';
import ManifestV2 from '../model/ManifestV2';
import ManagerSettings from '../r2mm/manager/ManagerSettings';
import ThemeManager from '../r2mm/manager/ThemeManager';
import GameRunner from '../r2mm/manager/GameRunner';
import ModLinker from '../r2mm/manager/ModLinker';
import ModBridge from '../r2mm/mods/ModBridge';
import Dependants from '../r2mm/mods/Dependants';
import ManagerInformation from '../_managerinf/ManagerInformation';

import * as fs from 'fs-extra';
import { isUndefined, isNull } from 'util';
import { ipcRenderer, app, clipboard } from 'electron';
import { spawn } from 'child_process';

@Component({
    components: {
        'hero': Hero,
        'progress-bar': Progress,
        'expandable-card': ExpandableCard,
        'link-component': Link,
        'modal': Modal
    }
})
export default class Manager extends Vue {
    view: string = 'installed';

    thunderstoreModList: ThunderstoreMod[] = [];
    searchableThunderstoreModList: ThunderstoreMod[] = [];
    
    localModList: ManifestV2[] = [];
    searchableLocalModList: ManifestV2[] = [];

    versionNumbers: string[] = [];
    selectedThunderstoreMod: ThunderstoreMod | null = null;
    selectedManifestMod: ManifestV2 | null = null;

    selectedVersion: string | null = null;

    searchFilter: string = '';

    errorMessage: string = '';
    errorStack: string = '';
    errorSolution: string = '';

    gameRunning: boolean = false;

    settings = new ManagerSettings();

    // Increment by one each time new modal is shown
    downloadObject: any | null = null;
    downloadingMod: boolean = false;

    helpPage: string = '';

    sortingStyleModel: string = SortingStyle.DEFAULT;
    sortingStyle: string = SortingStyle.DEFAULT;

    sortingDirectionModel: string = SortingDirection.STANDARD;
    sortDescending: boolean = true;

    showThunderstoreSorting: boolean = false;

    showingDependencyList: boolean = false;
    dependencyListDisplayType: string = DependencyListDisplayType.DISABLE;

    portableUpdateAvailable: boolean = false;
    updateTagName: string = '';

    fixingPreloader: boolean = false;

    managerVersionNumber: VersionNumber = ManagerInformation.VERSION;

    exportCode: string = '';


    @Watch('searchFilter')
    filterModLists() {
        this.generateModlist();
        this.searchableLocalModList = this.localModList.filter((x: ManifestV2) => {
            return x.getName().toLowerCase().search(this.searchFilter.toLowerCase()) >= 0 ||  this.searchFilter.trim() === ''
        });
        this.searchableThunderstoreModList = this.thunderstoreModList.filter((x: Mod) => {
            return x.getFullName().toLowerCase().search(this.searchFilter.toLowerCase()) >= 0 ||  this.searchFilter.trim() === ''
        });
        this.searchableThunderstoreModList.sort((a: ThunderstoreMod, b: ThunderstoreMod) => {
            let result: boolean;
            switch(this.sortingStyle) {
                case SortingStyle.LAST_UPDATED: 
                    result = this.sortDescending ? a.getDateUpdated() < b.getDateUpdated(): a.getDateUpdated() > b.getDateUpdated();
                    break;
                case SortingStyle.ALPHABETICAL: 
                    result = this.sortDescending ? a.getName().localeCompare(b.getName()) > 0: a.getName().localeCompare(b.getName()) < 0;
                    break;
                case SortingStyle.DOWNLOADS:
                    result = this.sortDescending ? a.getDownloadCount() < b.getDownloadCount(): a.getDownloadCount() > b.getDownloadCount();
                    break;
                case SortingStyle.RATING: 
                    result = this.sortDescending ? a.getRating() < b.getRating(): a.getRating() > b.getRating();
                    break;
                case SortingStyle.DEFAULT:
                    result = true;
                    break;
                default:
                    result = true;
                    break;
            }
            return result ? 1 : -1;
        })
    }

    // eslint-disable-next-line
    openModal(vueMod: any) {
        if (this.view === 'online') {
            const mod = new ThunderstoreMod().fromReactive(vueMod);
            this.selectedThunderstoreMod = mod;
            this.selectedVersion = mod.getVersions()[0].getVersionNumber().toString();
            this.versionNumbers = mod.getVersions()
                .map((version: ThunderstoreVersion) => version.getVersionNumber().toString());
            const modal: Element | null = document.getElementById('downloadModal');
            if (modal !== null) {
                modal.className = 'modal is-active';
            }
        }
    }

    closeModal() {
        const modal: Element | null = document.getElementById('downloadModal');
        if (modal !== null) {
            modal.className = 'modal';
        }
    }

    closeErrorModal() {
        this.errorMessage = '';
        this.errorStack = '';
    }

    closeGameRunningModal() {
        this.gameRunning = false;
    }

    openThunderstoreSortingModal() {
        this.showThunderstoreSorting = true;
    }

    closeSortingModal() {
        this.showThunderstoreSorting = false;
    }

    @Watch('sortingStyleModel')
    @Watch('sortingDirectionModel')
    applySort() {
        this.sortingStyle = this.sortingStyleModel;
        this.sortDescending = this.sortingDirectionModel == SortingDirection.STANDARD;
        this.filterModLists();
    }

    showError(error: R2Error) {
        this.errorMessage = error.name;
        this.errorStack = error.message;
        this.errorSolution = error.solution;
    }

    closePreloaderFixModal() {
        this.fixingPreloader = false;
    }

    fixPreloader() {
        const res = PreloaderFixer.fix();
        if (res instanceof R2Error) {
            this.showError(res);
        } else {
            this.fixingPreloader = true;
        }
    }

    private generateModlist() {
        this.searchableThunderstoreModList = this.thunderstoreModList;
        this.searchableLocalModList = this.localModList;
    }

    installModAfterDownload(mod: ThunderstoreMod, version: ThunderstoreVersion): R2Error | void {
        const manifestMod: ManifestV2 = new ManifestV2().fromThunderstoreMod(mod, version);
        const installError: R2Error | null = ProfileInstaller.installMod(manifestMod);
        if (!(installError instanceof R2Error)) {
            const newModList: ManifestV2[] | R2Error = ProfileModList.addMod(manifestMod);
            if (!(newModList instanceof R2Error)) {
                this.localModList = newModList;
                this.filterModLists();
            }
        } else {
            // (mod failed to be placed in /{profile} directory)
            this.showError(installError);
        }
    }

    performDownload() {
        const refSelectedThunderstoreMod: ThunderstoreMod | null = this.selectedThunderstoreMod;
        const refSelectedVersion: string | null = this.selectedVersion;
        if (refSelectedThunderstoreMod === null || refSelectedVersion === null) {
            // Shouldn't happen, but shouldn't throw an error.
            return;
        }
        const version = refSelectedThunderstoreMod.getVersions()
            .find((modVersion: ThunderstoreVersion) => modVersion.getVersionNumber().toString() === refSelectedVersion);
        if (version === undefined) {
            return;
        }
        this.downloadHandler(refSelectedThunderstoreMod, version);
    }

    downloadHandler(tsMod: ThunderstoreMod, tsVersion: ThunderstoreVersion) {
        const statusMap = {
            progress: 0,
            modName: tsMod.getName()
        }
        this.downloadObject = statusMap;
        this.downloadingMod = true;
        this.closeModal();
        BetterThunderstoreDownloader.download(tsMod, tsVersion, this.thunderstoreModList, (progress: number, modName: string, status: number, err: R2Error | null) => {
            if (status === StatusEnum.FAILURE) {
                if (!isNull(err)) {
                    this.downloadingMod = false;
                    this.showError(err);
                }
            } else if (status === StatusEnum.PENDING) {
                this.downloadObject = Object.assign({}, {
                    progress: progress,
                    modName: modName
                });
            }
        }, (downloadedMods: ThunderstoreCombo[]) => {
            downloadedMods.forEach(combo => {
                this.installModAfterDownload(combo.getMod(), combo.getVersion())
            })
            this.downloadingMod = false;
        });
    }

    closeDownloadProgressModal() {
        this.downloadingMod = false;
    }

    closeDependencyListModal() {
        this.showingDependencyList = false;
    }

    uninstallMod(vueMod: any) {
        let mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        try {
            Dependants.getDependantList(mod, this.localModList).forEach(dependant => {
                const result = this.performUninstallMod(dependant);
                if (result instanceof R2Error) {
                    throw result;
                }
            });
            const result = this.performUninstallMod(mod);
            if (result instanceof R2Error) {
                throw result;
            }
        } catch(e) {
            // Failed to uninstall mod.
            const err: R2Error = e;
            Logger.Log(LogSeverity.ACTION_STOPPED, `${err.name}\n-> ${err.message}`);
        }
        this.closeDependencyListModal();
        this.filterModLists();
    }

    // eslint-disable-next-line
    performUninstallMod(mod: ManifestV2): R2Error | void {
        const uninstallError: R2Error | null = ProfileInstaller.uninstallMod(mod);
        if (uninstallError instanceof R2Error) {
            // Uninstall failed
            this.showError(uninstallError);
            return uninstallError;
        }
        const modList: ManifestV2[] | R2Error = ProfileModList.removeMod(mod);
        if (modList instanceof R2Error) {
            // Failed to remove mod from local list.
            this.showError(modList);
            return modList;
        }
        this.localModList = modList;
    }

    disableModRequireConfirmation(vueMod: any) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        if (this.getDependantList(mod).size === 0) {
            this.performDisable(mod);
        } else {
            this.showDependencyList(mod, DependencyListDisplayType.DISABLE);
        }
    }

    uninstallModRequireConfirmation(vueMod: any) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        if (this.getDependantList(mod).size === 0) {
            this.performUninstallMod(mod);
            this.filterModLists();
        } else {
            this.showDependencyList(mod, DependencyListDisplayType.UNINSTALL);
        }
    }

    viewDependencyList(vueMod: any) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        this.showDependencyList(mod, DependencyListDisplayType.VIEW);
    }

    disableMod(vueMod: any) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        try {
            Dependants.getDependantList(mod, this.localModList).forEach(dependant => {
                const result = this.performDisable(dependant);
                if (result instanceof R2Error) {
                    throw result;
                }
            });
            const result = this.performDisable(mod);
            if (result instanceof R2Error) {
                throw result;
            }
        } catch(e) {
            // Failed to disable mod.
            const err: R2Error = e;
            Logger.Log(LogSeverity.ACTION_STOPPED, `${err.name}\n-> ${err.message}`);
        }
        this.closeDependencyListModal();
    }

    // eslint-disable-next-line
    performDisable(mod: ManifestV2): R2Error | void {
        const disableErr: R2Error | void = ProfileInstaller.disableMod(mod);
        if (disableErr instanceof R2Error) {
            // Failed to disable
            this.showError(disableErr);
            return disableErr;
        }
        const updatedList = ProfileModList.updateMod(mod, (updatingMod: ManifestV2) => {
            updatingMod.disable();
        });
        if (updatedList instanceof R2Error) {
            // Failed to update mod list.
            this.showError(updatedList);
            return updatedList;
        }
        this.localModList = updatedList;
        this.filterModLists();
    }

    enableMod(vueMod: any) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        try {
            Dependants.getDependencyList(mod, this.localModList).forEach(dependant => {
                const result = this.performEnable(dependant);
                if (result instanceof R2Error) {
                    throw result;
                }
            });
            const result = this.performEnable(mod);
            if (result instanceof R2Error) {
                throw result;
            }
        } catch(e) {
            // Failed to disable mod.
            const err: R2Error = e;
            Logger.Log(LogSeverity.ACTION_STOPPED, `${err.name}\n-> ${err.message}`);
        }
    }

    // eslint-disable-next-line
    performEnable(vueMod: any): R2Error | void {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const disableErr: R2Error | void = ProfileInstaller.enableMod(mod);
        if (disableErr instanceof R2Error) {
            // Failed to disable
            this.showError(disableErr);
            return disableErr;
        }
        const updatedList = ProfileModList.updateMod(mod, (updatingMod: ManifestV2) => {
            updatingMod.enable();
        });
        if (updatedList instanceof R2Error) {
            // Failed to update mod list.
            this.showError(updatedList);
            return updatedList;
        }
        this.localModList = updatedList;
        this.filterModLists();
    }

    // eslint-disable-next-line
    isModDeprecated(key: any) {
        if (key.deprecated) {
            return true;
        } else {
            const mod: ThunderstoreMod = new ThunderstoreMod().fromReactive(key);
            if (this.isModDependencyDeprecated(mod)) {
                return true;
            }
        }
        return false;
    }

    getSortOptions() {
        const options = [];
        const sorting: {[key: string]: string} = SortingStyle;
        for(const key in sorting) {
            options.push(sorting[key]);
        }
        return options;
    }

    getSortDirections() {
        const options = [];
        const sorting: {[key: string]: string} = SortingDirection;
        for(const key in sorting) {
            options.push(sorting[key]);
        }
        return options;
    }

    isModDependencyDeprecated(mod: ThunderstoreMod): boolean {
        let shouldStrikethrough = false;
        this.thunderstoreModList.forEach((tsMod: ThunderstoreMod) => {
            if (!shouldStrikethrough) {
                mod.getDependencies().forEach((dependency: string) => {
                    if (dependency.startsWith(tsMod.getFullName())) {
                        if (tsMod.isDeprecated()) {
                            shouldStrikethrough = true;
                            return;
                        } else {
                            shouldStrikethrough = this.isModDependencyDeprecated(tsMod);
                        }
                    }
                });
            }
        });
        return shouldStrikethrough;
    }

    // eslint-disable-next-line
    isThunderstoreModInstalled(vueMod: any) {
        const mod: ThunderstoreMod = new ThunderstoreMod().fromReactive(vueMod);
        return this.localModList.find((local: ManifestV2) => local.getName() === mod.getFullName()) != undefined;
    }

    prepareLaunch() {
        let dir: string | R2Error = '';
        if (this.settings.riskOfRain2Directory === null) {
            dir = GameDirectoryResolver.getDirectory();
        } else {
            dir = this.settings.riskOfRain2Directory;
        }
        if (dir instanceof R2Error) {
            // Show folder selection dialog.
            this.showError(dir);
        } else {
            const setInstallDirError: R2Error | void = this.settings.setRiskOfRain2Directory(dir);
            if (setInstallDirError instanceof R2Error) {
                this.showError(setInstallDirError);
                return;
            }
        }
    }

    isLatest(vueMod: any): boolean {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const latestVersion: ThunderstoreVersion | void = ModBridge.getLatestVersion(mod, this.thunderstoreModList);
        if (latestVersion instanceof ThunderstoreVersion) {
            return mod.getVersionNumber()
                .isEqualTo(latestVersion.getVersionNumber());
        }
        return true;
    }

    updateMod(vueMod: any) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const tsMod = ModBridge.getThunderstoreModFromMod(mod, this.thunderstoreModList);
        if (tsMod instanceof ThunderstoreMod) {
            this.selectedThunderstoreMod = tsMod;
            this.selectedVersion = tsMod.getVersions()[0].getVersionNumber().toString();
            this.versionNumbers = tsMod.getVersions()
                .map((version: ThunderstoreVersion) => version.getVersionNumber().toString());
            const modal: Element | null = document.getElementById('downloadModal');
            if (modal !== null) {
                modal.className = 'modal is-active';
            }
        }
    }

    getMissingDependencies(vueMod: any): string[] {
        const mod: Mod = new Mod().fromReactive(vueMod);
        return mod.getDependencies().filter((dependency: string) => {
            // Include in filter is mod isn't found.
            return isUndefined(this.localModList.find((localMod: ManifestV2) => dependency.toLowerCase().startsWith(localMod.getName().toLowerCase())))
        });
    }

    downloadDependency(missingDependency: string) {
        const mod: ThunderstoreMod | undefined = this.thunderstoreModList.find((tsMod: ThunderstoreMod) => missingDependency.toLowerCase().startsWith(tsMod.getFullName().toLowerCase()));
        if (isUndefined(mod)) {
            return;
        }
        this.selectedThunderstoreMod = mod;
        this.selectedVersion = mod.getVersions()[0].getVersionNumber().toString();
        this.versionNumbers = mod.getVersions()
            .map((version: ThunderstoreVersion) => version.getVersionNumber().toString());
        const modal: Element | null = document.getElementById('downloadModal');
        if (modal !== null) {
            modal.className = 'modal is-active';
        }
    }

    showDependencyList(vueMod: any, displayType: string) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        this.selectedManifestMod = mod;
        this.dependencyListDisplayType = displayType;
        this.showingDependencyList = true;
    }

    getDependantList(mod: ManifestV2): Set<ManifestV2> {
        return Dependants.getDependantList(mod, this.localModList);
    }

    getDependencyList(mod: ManifestV2): Set<ManifestV2> {
        return Dependants.getDependencyList(mod, this.localModList);
    }

    moveUp(vueMod: any) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const updatedList = ProfileModList.shiftModEntryUp(mod);
        if (updatedList instanceof R2Error) {
            this.showError(updatedList);
            return;
        }
        this.localModList = updatedList;
        this.filterModLists();
    }

    moveDown(vueMod: any) {
        const mod: ManifestV2 = new ManifestV2().fromReactive(vueMod);
        const updatedList = ProfileModList.shiftModEntryDown(mod);
        if (updatedList instanceof R2Error) {
            this.showError(updatedList);
            return;
        }
        this.localModList = updatedList;
        this.filterModLists();
    }

    launchModded() {
        this.prepareLaunch();
        if (this.settings.riskOfRain2Directory !== null && fs.existsSync(this.settings.riskOfRain2Directory)) {
            const newLinkedFiles = ModLinker.link();
            if (newLinkedFiles instanceof R2Error) {
                this.showError(newLinkedFiles);
                return;
            } else {
                const saveError = this.settings.setLinkedFiles(newLinkedFiles);
                if (saveError instanceof R2Error) {
                    this.showError(saveError);
                    return;
                }
            }
            this.gameRunning = true;
            GameRunner.playModded(this.settings.riskOfRain2Directory, (err: R2Error | null)=>{
                if (!isNull(err)) {
                    this.showError(err);
                }
                this.gameRunning = false;
            });
        } else {
            return new R2Error('Failed to start Risk of Rain 2', 'The Risk of Rain 2 directory does not exist', 
                'Set the Risk of Rain 2 directory in the settings screen');
        }
    }

    launchVanilla() {
        this.prepareLaunch();
        if (this.settings.riskOfRain2Directory !== null && fs.existsSync(this.settings.riskOfRain2Directory)) {
            this.gameRunning = true;
            GameRunner.playVanilla(this.settings.riskOfRain2Directory, (err: R2Error | null)=>{
                if (!isNull(err)) {
                    this.showError(err);
                }
                this.gameRunning = false;
            });
        } else {
            return new R2Error('Failed to start Risk of Rain 2', 'The Risk of Rain 2 directory does not exist', 
                'Set the Risk of Rain 2 directory in the settings screen');
        }
    }

    changeRoR2InstallDirectory() {
        const ror2Directory: string = this.settings.riskOfRain2Directory || 'C:/Program Files (x86)/Steam/steamapps/common/Risk of Rain 2';
        ipcRenderer.once('receive-selection', (_sender: any, files: string[] | null) => {
            if (!isNull(files) && files.length === 1) {
                this.settings.setRiskOfRain2Directory(files[0]);
            }
        })
        ipcRenderer.send('open-dialog', {
            title: 'Locate Risk of Rain 2 Directory',
            defaultPath: ror2Directory,
            properties: ['openDirectory'],
            buttonLabel: 'Select Directory',
        });
    }

    changeSteamDirectory() {
        const ror2Directory: string = this.settings.steamDirectory || 'C:/Program Files (x86)/Steam';
        ipcRenderer.once('receive-selection', (_sender: any, files: string[] | null) => {
            if (!isNull(files) && files.length === 1) {
                this.settings.setSteamDirectory(files[0]);
            }
        })
        ipcRenderer.send('open-dialog', {
            title: 'Locate Steam Directory',
            defaultPath: ror2Directory,
            properties: ['openDirectory'],
            buttonLabel: 'Select Directory',
        });
    }

    setAllModsEnabled(enabled: boolean) {
        this.localModList.forEach((mod: ManifestV2) => {
            let profileErr: R2Error | void;
            if (enabled) {
                profileErr = ProfileInstaller.enableMod(mod);
            } else {
                profileErr = ProfileInstaller.disableMod(mod);
            }
            if (profileErr instanceof R2Error) {
                this.showError(profileErr);
                return;
            }
            const update: ManifestV2[] | R2Error = ProfileModList.updateMod(mod, (updatingMod: ManifestV2) => {
                if (enabled) {
                    updatingMod.enable();
                } else {
                    updatingMod.disable();
                }
            })
            if (update instanceof R2Error) {
                this.showError(update);
                return;
            }
            this.localModList = update;
        });
        this.filterModLists();
        this.view = 'installed';
    }

    setFunkyMode(value: boolean) {
        this.settings.setFunkyMode(value);
    }

    exportProfile() {
        const exportErr = ProfileModList.exportModList();
        if (exportErr instanceof R2Error) {
            this.showError(exportErr);
        }
    }

    exportProfileAsCode() {
        const uploadText = 'Uploading profile, please wait.';
        const regularText = 'Export profile as code';
        const element: HTMLElement | null = document.getElementById('codeExportButton');
        if (isNull(element) || element.innerHTML === uploadText) {
            return;
        }
        element.innerHTML = uploadText;
        const exportErr = ProfileModList.exportModListAsCode(code => {
            console.log(code);
            this.exportCode = code;
            clipboard.writeText(code, 'clipboard');
            element.innerHTML = regularText;
        });
        if (exportErr instanceof R2Error) {
            element.innerHTML = regularText;
            this.showError(exportErr);
        }
    }

    changeProfile() {
        this.$router.push({path: '/profiles'});
    }

    browseDataFolder() {
        spawn('powershell.exe', ['explorer', `${PathResolver.ROOT}`]);
    }

    toggleCardExpanded(expanded: boolean) {
        if (expanded) {
            this.settings.expandCards();
        } else {
            this.settings.collapseCards();
        }
        this.view = 'installed';
    }

    toggleLegacyInstallMode(expanded: boolean) {
        const result: R2Error | void = this.settings.setLegacyInstallMode(expanded);
        if (result instanceof R2Error) {
            this.showError(result);
        }
    }

    toggleDarkTheme() {
        const result: R2Error | void = this.settings.toggleDarkTheme();
        if (result instanceof R2Error) {
            this.showError(result);
        }
        ThemeManager.apply();
    }

    openConfigEditor() {
        this.$router.push('/config-editor');
    }

    isManagerUpdateAvailable() {
        if (!ManagerInformation.IS_PORTABLE) {
            return;
        }
        fetch('https://api.github.com/repos/ebkr/r2modmanPlus/releases')
            .then(response => response.json())
            .then((parsed: any) => {
                parsed.sort((a: any, b: any) => {
                    if (!isNull(b)) {
                        const versionA = new VersionNumber(a.name);
                        const versionB = new VersionNumber(b.name);
                        return versionA.isNewerThan(versionB);
                    }
                    return 1;
                })
                let foundMatch = false;
                parsed.forEach((release: any) => {
                    if (!foundMatch && !release.draft) {
                        const releaseVersion = new VersionNumber(release.name);
                        if (releaseVersion.isNewerThan(ManagerInformation.VERSION)) {
                            this.portableUpdateAvailable = true;
                            this.updateTagName = release.tag_name;
                            foundMatch = true;
                            return;
                        }
                    }
                })
            }).catch(err => {
                // Do nothing, potentially offline. Try next launch.
            });
        return;
    }

    created() {
        this.settings.load();
        const newModList: ManifestV2[] | R2Error = ProfileModList.getModList(Profile.getActiveProfile());
        if (!(newModList instanceof R2Error)) {
            this.localModList = newModList;
        } else {
            Logger.Log(LogSeverity.ACTION_STOPPED, `Failed to retrieve local mod list\n-> ${newModList.message}`);
        }
        this.thunderstoreModList = ThunderstorePackages.PACKAGES;
        this.generateModlist();
        ipcRenderer.on('install-from-thunderstore-string', (_sender: any, data: string) => {
            const combo: ThunderstoreCombo | R2Error = ThunderstoreCombo.fromProtocol(data, this.thunderstoreModList);
            if (combo instanceof R2Error) {
                this.showError(combo);
                Logger.Log(LogSeverity.ACTION_STOPPED, `${combo.name}\n-> ${combo.message}`);
                return;
            }
            this.downloadHandler(combo.getMod(), combo.getVersion());

        });
        this.isManagerUpdateAvailable();
    }
}

</script>
