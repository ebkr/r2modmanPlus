import ThunderstoreVersion from './ThunderstoreVersion';

export default class ThunderstoreMod extends ThunderstoreVersion {
    private versions: ThunderstoreVersion[] = [];
    private rating: number = 0;
    private owner: string = '';
    private packageUrl: string = '';
    private dateCreated: string = '';
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

    public getVersions(): ThunderstoreVersion[] {
        return this.versions;
    }

    public setVersions(versions: ThunderstoreVersion[]) {
        this.versions = versions;
    }

    public getLatestVersion(): ThunderstoreVersion {
        return this.getVersions().reduce(reduceToNewestVersion);
    }

    public getLatestDependencyString(): string {
        return `${this.getFullName()}-${this.getLatestVersion().toString()}`;
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
