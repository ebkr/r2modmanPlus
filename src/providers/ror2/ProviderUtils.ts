import ProviderError from '../../model/errors/ProviderError';

export default class ProviderUtils {

    public static throwNotProvidedError(providerName: string): ProviderError {
        return new ProviderError(
            `${providerName} has not been provided`,
            `A provider needs to be specified for the ${providerName} class`,
            "Declare the provider in your custom App.vue override"
        );
    }

    public static throwMethodError(provider: any, providerName: string, methodName: string): ProviderError {
        return new ProviderError(
            `Provider does not implement method: ${methodName}`,
            `ProfileProvider (${provider.instance.constructor.name}) does not implement ${providerName}::${methodName}`,
            `Override the behaviour of the ${methodName} method.`
        );
    }

    public static throwGetterError(provider: any, providerName: string, getterName: string): ProviderError {
        return new ProviderError(
            `Provider does not implement getter: ${getterName}`,
            `ProfileProvider (${provider.instance.constructor.name}) does not implement ${providerName}->${getterName}`,
            `Override the behaviour of the ${getterName} getter.`
        );
    }

    public static throwSetterError(provider: any, providerName: string, setterName: string): ProviderError {
        return new ProviderError(
            `Provider does not implement setter: ${setterName}`,
            `ProfileProvider (${provider.instance.constructor.name}) does not implement ${providerName}=>${setterName}`,
            `Override the behaviour of the ${setterName} setter.`
        );
    }

}
