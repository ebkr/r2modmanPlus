<script setup lang="ts">
import { ExternalLink } from '../all';
import { computed, onMounted, ref } from 'vue';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import VersionNumber from '../../model/VersionNumber';

const appName = computed<string>(() => ManagerInformation.APP_NAME);
const portableUpdateAvailable = ref<boolean>(false);
const updateTagName = ref<string>('');

async function isManagerUpdateAvailable() {
    if (!ManagerInformation.IS_PORTABLE) {
        return;
    }
    return fetch('https://api.github.com/repos/ebkr/r2modmanPlus/releases')
        .then(response => response.json())
        .then((parsed: any) => {
            parsed.sort((a: any, b: any) => {
                if (b !== null) {
                    const versionA = new VersionNumber(a.name);
                    const versionB = new VersionNumber(b.name);
                    return versionA.isNewerThan(versionB);
                }
                return 1;
            });
            let foundMatch = false;
            parsed.forEach((release: any) => {
                if (!foundMatch && !release.draft) {
                    const releaseVersion = new VersionNumber(release.name);
                    if (releaseVersion.isNewerThan(ManagerInformation.VERSION)) {
                        portableUpdateAvailable.value = true;
                        updateTagName.value = release.tag_name;
                        foundMatch = true;
                        return;
                    }
                }
            });
            portableUpdateAvailable.value = true;
        }).catch(err => {
        // Do nothing, potentially offline. Try next launch.
    });
}

onMounted(async () => {
    isManagerUpdateAvailable();
})
</script>

<template>
    <div class='notification margin-top margin-right' v-show="portableUpdateAvailable">
        <div class='container'>
            <p>
                An {{ appName }} update is available.
                <ExternalLink :url="`https://github.com/ebkr/r2modmanPlus/releases/tag/${updateTagName}`">
                    Click here to go to the release page.
                </ExternalLink>
            </p>
        </div>
    </div>
</template>
