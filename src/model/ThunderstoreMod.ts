import Mod from './Mod';
import ThunderstoreVersion from './ThunderstoreVersion';
import VersionNumber from './VersionNumber';
import { version } from 'punycode';

export default class ThunderstoreMod extends ThunderstoreVersion {
    private versions: ThunderstoreVersion[] = [];
    private rating: number = 0;
    private owner: string = '';
    private packageUrl: string = '';
    private dateCreated: Date = new Date();
    private dateUpdated: Date = new Date();
    private uuid4: string = '';
    private pinned: boolean = false;
    private deprecated: boolean = false;

    public parseFromThunderstoreData(data: any): ThunderstoreMod {
        this.setName(data.name);
        this.setFullName(data.full_name);
        this.setOwner(data.owner);
        this.setDateCreated(data.date_created);
        this.setDateUpdated(data.date_updated);
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
}