export default class LocalModListProvider {

    static provider: () => Promise<any>;

    static provide(provider: () => Promise<any>): void {
        this.provider = provider;
    }


}
