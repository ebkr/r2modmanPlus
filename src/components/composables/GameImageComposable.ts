import { ref, watchEffect } from 'vue';
import GameImageProvider from '../../providers/generic/image/GameImageProvider';

export function useGameImageComposable(iconUrl: () => string) {
    const imageSrc = ref<string>(GameImageProvider.placeholderUrl);

    watchEffect(async () => {
        imageSrc.value = await GameImageProvider.resolve(iconUrl());
    });

    return { imageSrc };
}
