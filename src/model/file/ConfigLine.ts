/**
 * Must be public to allow Vue to correctly recognise rebuild from JSON.parse()
 */
export default class ConfigLine {

    public value: string;
    public comments: string[];
    public allowedValues: string[];
    public commentsExpanded: boolean = false;

    public constructor(value: string, comments: string[], allowedValues?: string[]) {
        this.value = value;
        this.comments = comments;
        this.allowedValues = allowedValues || [];
    }
}
