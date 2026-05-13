import { ref } from 'vue';
import GameImageProvider from '../../providers/generic/image/GameImageProvider';

export function useGameImageComposable() {
    const imageSrc = ref<string>(GameImageProvider.placeholderUrl);

    async function setIcon(iconUrl: string) {
        imageSrc.value = await GameImageProvider.resolve(iconUrl);
    }

    return { imageSrc, setIcon };
}
