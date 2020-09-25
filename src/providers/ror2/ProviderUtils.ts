import ProviderError from '../../model/errors/ProviderError';

export default class ProviderUtils {

    public static throwNotProvidedError(providerName: string): ProviderError {
        return new ProviderError(
            `${providerName} has not been provided`,
            `A provider needs to be specified for the ${providerName} class`,
            "Declare the provider in your custom App.vue override"
        );
    }

}
