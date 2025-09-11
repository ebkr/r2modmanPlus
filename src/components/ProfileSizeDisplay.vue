<template>
    <span>{{ fileSizeText }}</span>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import FileUtils from '../utils/FileUtils';
import Profile from '../model/Profile';
import FsProvider from '../providers/generic/file/FsProvider';
import path from 'path';

interface Props {
    profileName: string;
}

const props = defineProps<Props>();

const fileSizeText = ref<string>('Calculating...');

const calculateSize = async () => {
    try {
        const profilePath = path.join(Profile.getRootDir(), props.profileName);
        const profileSize = await calculateDirectorySize(profilePath);
        fileSizeText.value = FileUtils.humanReadableSize(profileSize);
    } catch (error) {
        console.error(`Error calculating the size of the profile ${props.profileName}:`, error);
        fileSizeText.value = 'Error';
    }
};

onMounted(() => {
    calculateSize();
});

const calculateDirectorySize = async (directoryPath: string): Promise<number> => {
    const fs = FsProvider.instance;

    try {
        const stat = await fs.lstat(directoryPath);
        if (!stat.isDirectory()) {
            return stat.size;
        }

        const entries = await fs.readdir(directoryPath);
        const sizePromises = entries.map(async (entry) => {
            const entryPath = path.join(directoryPath, entry);
            try {
                const entryStat = await fs.lstat(entryPath);
                if (entryStat.isDirectory()) {
                    return await calculateDirectorySize(entryPath);
                } else {
                    return entryStat.size;
                }
            } catch (error) {
                console.warn(`Skipping the file ${entryPath}:`, error);
                return 0;
            }
        });

        const sizes = await Promise.all(sizePromises);
        return sizes.reduce((total, size) => total + size, 0);
    } catch (error) {
        console.error(`Error accessing the directory ${directoryPath}:`, error);
        return 0;
    }
}
</script>
