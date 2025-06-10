export default class OnlineModListProvider {

    static provider: () => Promise<typeof import("*.vue")>;

    static provide(provider: () => Promise<any>): void {
        this.provider = provider;
    }


}
