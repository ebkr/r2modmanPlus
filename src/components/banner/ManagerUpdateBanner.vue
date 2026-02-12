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
            portableUpdateAvailable.value = parsed.find((release: any) => {
                if (release.draft) {
                    return false;
                }
                const releaseVersion = new VersionNumber(release.name);
                return releaseVersion.isNewerThan(ManagerInformation.VERSION);
            }) !== undefined;
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
        <p>
            An {{ appName }} update is available.
            <ExternalLink :url="`https://github.com/ebkr/r2modmanPlus/releases/tag/${updateTagName}`">
                Click here to go to the release page.
            </ExternalLink>
        </p>
    </div>
</template>

<style scoped lang="scss">
.notification {
    margin-bottom: 0.5rem;
}
</style>
