import ThunderstoreVersion from './ThunderstoreVersion';

export default class ThunderstoreMod extends ThunderstoreVersion {
    private rating: number = 0;
    private owner: string = '';
    private packageUrl: string = '';
    private dateCreated: string = '';
    private dateUpdated: string = '';
    private uuid4: string = '';
    private pinned: boolean = false;
    private deprecated: boolean = false;
    private categories: string[] = [];
    private hasNsfwContent: boolean = false;
    private donationLink: string | undefined;
    private latestVersion: string = '';

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

    public static parseFromThunderstoreData(data: any): ThunderstoreMod {
        const mod = new ThunderstoreMod();
        mod.setName(data.name);
        mod.setFullName(data.full_name);
        mod.setOwner(data.owner);
        mod.setDateCreated(data.date_created);
        mod.setDateUpdated(data.date_updated);
        mod.setDeprecatedStatus(data.is_deprecated);
        mod.setPinnedStatus(data.is_pinned);
        mod.setRating(data.rating_score);
        mod.setDownloadCount(
            data.versions.reduce(
                (x: number, y: {downloads: number}) => x + y.downloads,
                0
            )
        );
        mod.setPackageUrl(data.package_url);
        mod.setCategories(data.categories);
        mod.setNsfwFlag(data.has_nsfw_content);
        mod.setDonationLink(data.donation_link);
        mod.setLatestVersion(data.versions[0].version_number);
        mod.setDescription(data.versions[0].description);
        mod.setIcon(data.versions[0].icon);
        return mod;
    }

    public getLatestVersion(): string {
        return this.latestVersion;
    }

    public setLatestVersion(versionNumber: string) {
        this.latestVersion = versionNumber;
    }

    public getLatestDependencyString(): string {
        return `${this.getFullName()}-${this.getLatestVersion()}`;
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

    public getDateCreated(): string {
        return this.dateCreated;
    }

    public setDateCreated(date: string) {
        this.dateCreated = date;
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
