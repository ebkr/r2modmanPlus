<template>
	<div class='card is-shadowless card--is-clickable card--is-cozy cursor-pointer' 
	   :class="{'card--is-disabled': isInstalled(), 'card--is-deprecated': mod.isDeprecated()}">
		<figure class='card-image image is-72x72 image-parent mod-logo' v-if="icon !== ''">
			<img :src='icon' alt='Mod Logo' class='image-overlap'/>
			<img v-if="funkyMode" src='../../assets/funky_mode.png' alt='Mod Logo' class='image-overlap'/>
		</figure>
		<header class='card-header is-shadowless' :id='id'>
			<span class='card-header-title'>
				<span v-if='isInstalled()' class='icon is-success' data-tooltip='This mod is installed.'>
					<i class='fas fa-check' aria-hidden='true'></i>
				</span>
				<span class='card-title card-title--is-large'>
					{{mod.getName()}}
				</span>
				<span v-if="mod.isPinned()" class="tag is-info has-tooltip-top"
					  data-tooltip='This mod is pinned on Thunderstore.'>Pinned</span>&nbsp;
				<span v-if="mod.isDeprecated()" class="tag is-danger has-tooltip-top"
					  data-tooltip='This mod has been marked as deprecated, suggesting that an alternative be used instead.'>
						Deprecated
				</span>
			</span>
		</header>
		<div class='card-header-icons'>
			<ExternalLink :url="mod.getPackageUrl()" :target="'external'" class='card-header-icon button is-info requires-card-hover'>
				<span class='icon'>
					<i class='fas fa-eye' aria-hidden='true'></i>
				</span>
				<span class='card-header-icon-label'>View on Thunderstore</span>
			</ExternalLink>
			<a v-if='!isInstalled()' class='card-header-icon button is-success requires-card-hover' @click='$emit("install-mod")'>
				<span class='icon'>
					<i class='fas fa-download' aria-hidden='true'></i>
				</span>
				<span class='card-header-icon-label'>Install</span>
			</a>
			<a v-else class='card-header-icon button is-danger is-colored-button-only requires-card-hover' @click='$emit("uninstall-mod")'>
				<span class='icon'>
					<i class='fas fa-trash' aria-hidden='true'></i>
				</span>
				<span class='card-header-icon-label'>Uninstall</span>
			</a>
		</div>
		<footer class='card-footer card-footer-borderless'>
			<span class='card-footer-item non-selectable'>
				<external-link v-if='mod.getOwner()' target="link" 
							   :url="`https://thunderstore.io/package/${mod.getOwner()}`">
								{{mod.getOwner()}}
				</external-link>
			</span>
			<span class='card-footer-item non-selectable'>
				<label class='card-footer-item-label'>Last updated:</label>
				<span class='card-footer-item-value'>{{getReadableDate(mod.getDateUpdated())}}</span>
			</span>
			<span class='card-footer-item non-selectable'>
				<span class='has-tooltip-top' data-tooltip='Downloads'><i class='fas fa-download'/> {{mod.getTotalDownloads()}}</span>
			</span>
			<span class='card-footer-item non-selectable'>
				<span class='has-tooltip-top' data-tooltip='Likes'><i class='fas fa-thumbs-up'/> {{mod.getRating()}}</span>
			</span>
		</footer>
		<div class='card-content card-content--is-compressed'>
			<div class='content'>
				<p v-if="description !== ''" class="card-description">
					{{description}}
				</p>
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import ManifestV2 from 'src/model/ManifestV2';
import ThunderstoreMod from 'src/model/ThunderstoreMod';
import ModBridge from 'src/r2mm/mods/ModBridge';
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator'
import ExternalLink from '../ExternalLink.vue';

@Component({
	components: {
		ExternalLink,
	}
})
export default class OnlineModCard extends Vue {

    @Prop()
    id: string | undefined;
	
	@Prop()
	mod: ThunderstoreMod | undefined;

    @Prop({default: false})
	funkyMode: boolean | undefined;
	
	get latestVersion() {
		return this.mod?.getVersions()?.[0];
	}
	
	get icon() {
		return this.latestVersion?.getIcon();
	}
	
	get description() {
		return this.latestVersion?.getDescription();
	}

	get localModList(): ManifestV2[] {
		return this.$store.state.localModList;
	}

	isInstalled() {
		const matchedMod = (this.mod && this.localModList.find((local: ManifestV2) => local.getName() === this.mod!.getFullName()));
		return matchedMod != undefined;
	}

	getReadableDate(date: Date): string {
		const dateObject: Date = new Date(date);
		return `${dateObject.toDateString()}, ${dateObject.toLocaleTimeString()}`
	}
}
</script>
