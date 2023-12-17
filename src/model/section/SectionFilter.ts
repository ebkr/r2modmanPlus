export default class SectionFilter {

    public readonly label: string;
    public readonly displayName: string;
    public readonly excludeCategories: string[];
    public readonly requireCategories: string[];

    constructor(label: string, displayName: string, excludeCategories: string[],
                requireCategories: string[]) {

        this.label = label;
        this.displayName = displayName;
        this.excludeCategories = excludeCategories;
        this.requireCategories = requireCategories;
    }

    public static fromData(label: string, data: any): SectionFilter {
        var excludeCategories = [];
        var requireCategories = [];
        if (Object.prototype.hasOwnProperty.call(data, "excludeCategories")) {
            excludeCategories = data.excludeCategories;
        }
        if (Object.prototype.hasOwnProperty.call(data, "requireCategories")) {
            requireCategories = data.requireCategories;
        }
        return new SectionFilter(label, data.name, excludeCategories, requireCategories);
    }
}
