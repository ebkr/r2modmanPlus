import ThunderstoreVersion from './ThunderstoreVersion';
import ReactiveObjectConverterInterface from './safety/ReactiveObjectConverter';

export default class ThunderstoreMod extends ThunderstoreVersion implements ReactiveObjectConverterInterface {
    private versions: ThunderstoreVersion[] = [];
    private rating: number = 0;
    private owner: string = '';
    private packageUrl: string = '';
    private dateCreated: Date = new Date();
    private dateUpdated: Date = new Date();
    private uuid4: string = '';
    private pinned: boolean = false;
    private deprecated: boolean = false;
    private totalDownloads: number = 0;

    public parseFromThunderstoreData(data: any): ThunderstoreMod {
        this.setName(data.name);
        this.setFullName(data.full_name);
        this.setOwner(data.owner);
        this.setDateCreated(data.date_created);
        this.setDateUpdated(data.date_updated);
        console.log("tsm:", data);
        this.setDeprecatedStatus(data.is_deprecated);
        this.setPinnedStatus(data.is_pinned);
        for (const version of data.versions) {
            const tsVersion: ThunderstoreVersion = new ThunderstoreVersion().make(version);
            this.versions = [...this.versions, tsVersion];
        }
        this.setDownloadCount(
            this.versions
                .map(version => version.getDownloadCount())
                .reduce((x, y) => x + y)
        );
        this.setRating(data.rating_score);
        this.setTotalDownloads(
            this.getVersions()
                .map(x => x.getDownloadCount())
                .reduce((x, y) => x + y)
        );
        return this;
    }

    public fromReactive(reactive: any): ThunderstoreMod {
        this.setName(reactive.name);
        this.setFullName(reactive.fullName);
        this.setOwner(reactive.owner);
        this.setPackageUrl(reactive.packageUrl);
        this.setDateCreated(reactive.dateCreated);
        this.setDateUpdated(reactive.dateUpdated);
        this.setDeprecatedStatus(reactive.deprecated);
        this.setPinnedStatus(reactive.pinnedStatus);
        this.setVersions(reactive.versions.map((x: ThunderstoreVersion) => new ThunderstoreVersion().fromReactive(x)));
        this.setDownloadCount(reactive.downloadCount);
        this.setRating(reactive.rating);
        this.setTotalDownloads(reactive.totalDownloads);
        this.setUuid4(reactive.uuid4);
        return this;
    }

    public getVersions(): ThunderstoreVersion[] {
        return this.versions;
    }

    public setVersions(versions: ThunderstoreVersion[]) {
        this.versions = versions;
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

    public getDateCreated(): Date {
        return this.dateCreated;
    }

    public setDateCreated(date: Date) {
        this.dateCreated = date;
    }
    
    public getDateUpdated(): Date {
        return this.dateUpdated;
    }

    public setDateUpdated(date: Date) {
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
}