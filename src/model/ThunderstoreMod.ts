import ThunderstoreVersion from './ThunderstoreVersion';
import ReactiveObjectConverterInterface from './safety/ReactiveObjectConverter';

export default class ThunderstoreMod extends ThunderstoreVersion implements ReactiveObjectConverterInterface {
    private versions: ThunderstoreVersion[] = [];
    private rating: number = 0;
    private owner: string = '';
    private packageUrl: string = '';
    private dateUpdated: string = '';
    private uuid4: string = '';
    private pinned: boolean = false;
    private deprecated: boolean = false;
    private totalDownloads: number = 0;
    private categories: string[] = [];
    private hasNsfwContent: boolean = false;
    private donationLink: string | undefined;

    public static parseFromThunderstoreData(data: any): ThunderstoreMod {
        const mod = new ThunderstoreMod();
        mod.setName(data.name);
        mod.setFullName(data.full_name);
        mod.setOwner(data.owner);
        mod.setDateCreated(data.date_created);
        mod.setDateUpdated(data.date_updated);
        mod.setDeprecatedStatus(data.is_deprecated);
        mod.setPinnedStatus(data.is_pinned);
        const versions = [];
        for (const version of data.versions) {
            versions.push(new ThunderstoreVersion().make(version));
        }
        mod.setVersions(versions);
        mod.setDownloadCount(
            mod.versions
                .map(version => version.getDownloadCount())
                .reduce((x, y) => x + y)
        );
        mod.setRating(data.rating_score);
        mod.setTotalDownloads(
            mod.getVersions()
                .map(x => x.getDownloadCount())
                .reduce((x, y) => x + y)
        );
        mod.setPackageUrl(data.package_url);
        mod.setCategories(data.categories);
        mod.setNsfwFlag(data.has_nsfw_content);
        mod.setDonationLink(data.donation_link);
        return mod;
    }

    // Imitate the order where mods are returned from Thunderstore package listing API.
    public static defaultOrderComparer(a: ThunderstoreMod, b: ThunderstoreMod): number {
        // Pinned mods first.
        if (a.isPinned() !== b.isPinned()) {
            return a.isPinned() ? -1 : 1;
        }

        // Deprecated mods last.
        if (a.isDeprecated() !== b.isDeprecated()) {
            return a.isDeprecated() ? 1 : -1;
        }

        // Sort mods with same boolean flags by update date.
        return a.getDateUpdated() >= b.getDateUpdated() ? -1 : 1;
    }

    public fromReactive(reactive: any): ThunderstoreMod {
        this.setName(reactive.name);
        this.setFullName(reactive.fullName);
        this.setOwner(reactive.owner);
        this.setPackageUrl(reactive.packageUrl);
        this.setDateCreated(reactive.dateCreated);
        this.setDateUpdated(reactive.dateUpdated);
        this.setDeprecatedStatus(reactive.deprecated);
        this.setPinnedStatus(reactive.pinned);
        this.setVersions(reactive.versions.map((x: ThunderstoreVersion) => new ThunderstoreVersion().fromReactive(x)));
        this.setDownloadCount(reactive.downloadCount);
        this.setRating(reactive.rating);
        this.setTotalDownloads(reactive.totalDownloads);
        this.setUuid4(reactive.uuid4);
        this.setCategories(reactive.categories);
        this.setNsfwFlag(reactive.hasNsfwContent);
        this.setDonationLink(reactive.donationUrl);
        return this;
    }

    public getVersions(): ThunderstoreVersion[] {
        return this.versions;
    }

    public setVersions(versions: ThunderstoreVersion[]) {
        this.versions = versions;
    }

    public getLatestVersion(): ThunderstoreVersion {
        return this.getVersions().reduce(reduceToNewestVersion);
    }

    public getRating(): number {
        return this.rating;
    }

    public setRating(rating: number) {
        this.rating = rating;
    }

    public getOwner(): string {
        return this.owner;
    }

    public setOwner(owner: string) {
        this.owner = owner;
    }

    public getPackageUrl(): string {
        return this.packageUrl;
    }

    public setPackageUrl(url: string) {
        this.packageUrl = url;
    }

    public getDateUpdated(): string {
        return this.dateUpdated;
    }

    public setDateUpdated(date: string) {
        this.dateUpdated = date;
    }

    public getUuid4(): string {
        return this.uuid4;
    }

    public setUuid4(uuid4: string) {
        this.uuid4 = uuid4;
    }

    public isPinned(): boolean {
        return this.pinned;
    }

    public setPinnedStatus(pin: boolean) {
        this.pinned = pin;
    }

    public isDeprecated(): boolean {
        return this.deprecated;
    }

    public setDeprecatedStatus(deprecated: boolean) {
        this.deprecated = deprecated;
    }

    public getTotalDownloads(): number {
        return this.totalDownloads;
    }

    public setTotalDownloads(total: number) {
        this.totalDownloads = total;
    }

    public getCategories(): string[] {
        return this.categories;
    }

    public setCategories(categories: string[]) {
        this.categories = categories;
    }

    public getNsfwFlag(): boolean {
        return this.hasNsfwContent;
    }

    public setNsfwFlag(isNsfw: boolean) {
        this.hasNsfwContent = isNsfw;
    }

    public getDonationLink(): string | undefined {
        return this.donationLink;
    }

    public setDonationLink(url: string | undefined) {
        this.donationLink = url;
    }
}

function reduceToNewestVersion(v1: ThunderstoreVersion, v2: ThunderstoreVersion) {
    return v1.getVersionNumber().isNewerThan(v2.getVersionNumber()) ? v1 : v2;
};
