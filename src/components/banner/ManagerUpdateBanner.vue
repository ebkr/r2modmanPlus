<script setup lang="ts">
import { ExternalLink } from '../all';
import { useI18n } from 'vue-i18n';
import { computed, onMounted, ref } from 'vue';
import ManagerInformation from '../../_managerinf/ManagerInformation';
import VersionNumber from '../../model/VersionNumber';


const { t } = useI18n();

const appName = computed<string>(() => ManagerInformation.APP_NAME);
const portableUpdateAvailable = ref<boolean>(false);

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
        <div class='container'>
            <p>
                {{ t('translations.banners.managerUpdate.title', { appName }) }}
                <ExternalLink :url="`https://github.com/ebkr/r2modmanPlus/releases/latest`">
                    {{ t('translations.banners.managerUpdate.linkText') }}
                </ExternalLink>
            </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.notification {
    margin-bottom: 0.5rem;
}
</style>
