/**
 * Must be public to allow Vue to correctly recognise rebuild from JSON.parse()
 */
export default class ConfigLine {

    public value: string;
    public comments: string[];
    public allowedValues: string[];
    public commentsExpanded: boolean = false;
    private readonly range: number[];

    public constructor(value: string, comments: string[], allowedValues?: string[]) {
        this.value = value;
        this.comments = comments;
        this.allowedValues = allowedValues || [];
        this.range = this.parseRange();
    }

    public hasRange() {
        return this.range.length === 2;
    }

    public getMinRange() {
        return this.hasRange() ? this.range[0] : 0;
    }

    public getMaxRange() {
        return this.hasRange() ? this.range[1] : 0;
    }

    private parseRange(): number[] {
        for (let comment of this.comments) {
            if (comment.startsWith('# Acceptable value range')) {
                // regex to get all numbers inside a string
                const range: string[] = comment.match(/\d+/g) || [];
                return range.map(x => Number(x));
            }
        }

        return [];
    }
}
