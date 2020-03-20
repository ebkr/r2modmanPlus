export default class ConfigLine {

    private value: string;
    private comments: string[];

    public constructor(value: string, comments: string[]) {
        this.value = value;
        this.comments = comments;
    }

    public getValue(): string {
        return this.value;
    }

    public setValue(val: string) {
        this.value = val;
    }

    public getComments(): string[] {
        return this.comments;
    }

}