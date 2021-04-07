import { StorePlatform } from '../../model/game/StorePlatform';

export default class StorePlatformMetadata {

    private readonly _storePlatform: StorePlatform;
    private readonly _storeIdentifier: string | undefined;

    constructor(storePlatform: StorePlatform, storeIdentifier?: string) {
        this._storePlatform = storePlatform;
        this._storeIdentifier = storeIdentifier;
    }

    get storePlatform(): StorePlatform {
        return this._storePlatform;
    }

    get storeIdentifier(): string | undefined {
        return this._storeIdentifier;
    }
}
