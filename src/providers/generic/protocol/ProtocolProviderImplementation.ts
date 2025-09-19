import { ProtocolProvider } from './ProtocolProvider';

export const ProtocolProviderImplementation: ProtocolProvider = {
    getPublicAssetUrl: (url: string) => `public://${url}`,
}
