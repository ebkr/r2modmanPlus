import { ref, watch } from 'vue';
import GameImageProvider from '../../providers/generic/image/GameImageProvider';

export function useGameImageComposable(iconUrl: () => string) {
    const imageSrc = ref<string>(GameImageProvider.instance.placeholderUrl);

    watch(iconUrl, async (current) => {
        imageSrc.value = await GameImageProvider.instance.resolve(current);
    }, { immediate: true });

    return { imageSrc };
}
