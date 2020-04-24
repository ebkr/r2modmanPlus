<template>
	<div>
		<hero title='Config editor' subtitle='Make changes to your configuration files' heroType='is-info'/>
		<div class='notification is-warning'>
			<p class='container'>Configuration files are generated after launching the game, with the mod installed, at
				least once.
			</p>
		</div>
		<div class='columns'>
			<div class='column is-full'>
				<article class='media'>
					<div class='media-content'>
						<div class='content'>
							<div class='container' v-if="editing === false">
								<div>
									<i class='fas fa-long-arrow-alt-left margin-right'/>
									<strong><a @click="backToManager()">Go back</a></strong>
									<br/><br/>
								</div>
								<div>
									<input class="input" type="text" placeholder="Search for config files"
									       v-model="filterText"/>
									<br/><br/>
								</div>
								<div v-for='(file, index) in shownConfigFiles' :key="`config-file-${file.name}`">
									<expandable-card
											:id="index"
											:visible="false">
										<template v-slot:title>
											<span>{{file.name}}</span>
										</template>
										<a class='card-footer-item' @click="editFile(file.name)">Edit Config</a>
										<a class='card-footer-item' @click="deleteConfig(file.name)">Delete</a>
									</expandable-card>
								</div>
							</div>
							<div class='container' v-else>
								<div>
									<div class='sticky-top sticky-top--buttons'>
										<button class='button is-info' @click="saveChanges()">Save changes</button>&nbsp;
										<button class='button is-danger' @click="editing = false;">Cancel</button>
									</div>
									<br/>
									<h4 class='title is-4'>{{loadedFile}}</h4>
									<div>
										<h5 class='subtitle is-5'>Sections</h5>
										<ul>
											<li v-for='(_, key) in variables' :key="`section-link-${key}`">
												<a :href="`#section-${key}`" v-if="key.length > 0">{{key}}</a>
												<a :href="`#section-${key}`" v-else>{{[UNTITLED]}}</a>
											</li>
										</ul>
										<hr/>
										<div v-for='(vars, key) in variables' :key="`section-${key}`">
											<br/>
											<h5 :id="`section-${key}`" class='subtitle is-5 sticky-top'>[{{key}}]</h5>
											<div v-for='(varValue, varName) in vars' :key="`vars-${varName}`">
												<div class='field has-addons has-tooltip-top'
												     :data-tooltip="getCommentDisplay(varValue.comments).length > 0 ? getCommentDisplay(varValue.comments) : undefined">
													<div class='control is-expanded'>
														<input class='input' type='text' :value="varName" width="250"
														       disabled readonly/>
													</div>
													<div class='control is-expanded'>
														<input :id="`${key}-${varName}`" class='input' type='text'
														       :value="varValue.value"
														       @change="updateVariableText(key, varName, this)"/>
													</div>
													<hr class='hr'/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</article>
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
	import Vue from 'vue';
	import { Component, Watch } from 'vue-property-decorator';
	import { Hero, ExpandableCard } from '../components/all';

	import Profile from 'src/model/Profile';
	import ConfigFile from 'src/model/file/ConfigFile';
	import ConfigLine from 'src/model/file/ConfigLine';

	import { Logger, LogSeverity } from 'src/r2mm/logging/Logger';

	import * as fs from 'fs-extra';
	import * as path from 'path';
	import BepInExTree from '../model/file/BepInExTree';
	import R2Error from '../model/errors/R2Error';

	@Component({
		components: {
			'hero': Hero,
			'expandable-card': ExpandableCard
		}
	})
	export default class ConfigEditor extends Vue {

		private shownConfigFiles: ConfigFile[] = [];
		private configFiles: ConfigFile[] = [];
		private loadedFile: string = '';
		private fileText: string = '';

		private editing: boolean = false;
		private variables: { [section: string]: { [variable: string]: ConfigLine } } = {};

		private filterText: string = '';

		@Watch('filterText')
		textChanged() {
			this.shownConfigFiles = this.configFiles.filter((conf: ConfigFile) => conf.getName().toLowerCase().match(this.filterText.toLowerCase()));
		}

		editFile(fileName: string) {
			const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
			this.loadedFile = fileName;
			this.fileText = fs.readFileSync(path.join(configLocation, `${fileName}.cfg`)).toString();

			// Find all variables offered within config script.
			this.variables = {};
			let section = 'root';
			let comments: string[] = [];
			this.fileText.split('\n').forEach((line: string) => {
				if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
					section = line.trim().substring(1, line.trim().length - 1);
					this.variables[section] = {};
					comments = [];
				} else if (!line.trim().startsWith('#') && line.search('=') > 0) {
					const sides = line.split('=');
					this.variables[section][sides[0].trim()] = new ConfigLine(sides[1].trim(), comments);
					comments = [];
				} else if (line.trim().startsWith('#')) {
					comments.push(line.trim());
				}
			});
			window.scrollTo(0, 0);
			this.editing = true;
		}

		saveChanges() {
			const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
			let builtString = '';
			let section = 'root';
			this.fileText.split('\n').forEach((line: string) => {
				if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
					section = line.trim().substring(1, line.trim().length - 1);
					builtString += line + '\n';
				} else if (!line.trim().startsWith('#') && line.search('=') > 0) {
					const sides = line.split('=');
					builtString += `${sides[0].trim()} = ${this.variables[section][sides[0].trim()].getValue()}\n`;
				} else {
					builtString += line + '\n';
				}
			});
			fs.writeFileSync(path.join(configLocation, `${this.loadedFile}.cfg`), builtString.trim());
			window.scrollTo(0, 0);
			this.editing = false;
		}

		backToManager() {
			this.$router.push('/manager');
		}

		updateVariableText(section: string, variable: string) {
			const element: HTMLElement | null = document.getElementById(`${section}-${variable}`);
			if (element instanceof HTMLElement) {
				const inputField = element as HTMLInputElement;
				this.variables[section][variable].setValue(inputField.value);
			}
		}

		deleteConfig(fileName: string) {
			const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
			const filePath: string = path.join(configLocation, `${fileName}.cfg`);
			fs.removeSync(filePath);
			this.configFiles = this.configFiles.filter(file => file.getName() !== fileName);
			this.textChanged();
		}

		getCommentDisplay(comments: string[]): string {
			let split: string[] = [];
			if (comments.length > 0) {
				split = comments.reduce((x: string, y: string) => x + y).split('#');
			}
			return split.join('\n').trim();
		}

		created() {
			const configLocation: string = path.join(Profile.getActiveProfile().getPathOfProfile(), 'BepInEx', 'config');
			if (fs.pathExistsSync(configLocation)) {
				const tree: BepInExTree | R2Error = BepInExTree.buildFromLocation(configLocation);
				if (tree instanceof BepInExTree) {
					tree.getRecursiveFiles().forEach(file => {
						if (path.extname(file).toLowerCase() === '.cfg') {
							this.configFiles.push(new ConfigFile(file.substring(configLocation.length + 1, file.length - 4), file));
						}
					});
				} else {
					Logger.Log(LogSeverity.ACTION_STOPPED, `${tree.name}\n-> ${tree.message}`);
				}
			}
			this.textChanged();
		}

	}
</script>
