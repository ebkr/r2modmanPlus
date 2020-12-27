export default class HelpPageProvider {

    static provider: () => Promise<typeof import("*.vue")>;

    static provide(provider: () => Promise<typeof import("*.vue")>): void {
        this.provider = provider;
    }


}
