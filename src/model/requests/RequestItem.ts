export default class RequestItem {
    private name: string = '';
    private progress: number = 0;

    public constructor(name: string, progress: number) {
        this.name = name;
        this.progress = progress;
        return this;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getProgress(): number {
        return this.progress;
    }

    public setProgress(progress: number) {
        this.progress = progress;
    }

    public merge(other: RequestItem): RequestItem {
        return new RequestItem('', this.getProgress() + other.getProgress());
    }
}