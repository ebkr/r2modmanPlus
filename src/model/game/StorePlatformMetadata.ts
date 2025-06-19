import { Platform } from '../schema/ThunderstoreSchema';

export default class StorePlatformMetadata {

    private readonly _storePlatform: Platform;
    private readonly _storeIdentifier: string | undefined;

    constructor(storePlatform: Platform, storeIdentifier?: string) {
        this._storePlatform = storePlatform;
        this._storeIdentifier = storeIdentifier;
    }

    get storePlatform(): Platform {
        return this._storePlatform;
    }

    get storeIdentifier(): string | undefined {
        return this._storeIdentifier;
    }
}
