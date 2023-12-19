import ReactiveObjectConverterInterface from './safety/ReactiveObjectConverter';
import SectionFilter from './section/SectionFilter';

export default class ThunderstoreGameSchema implements ReactiveObjectConverterInterface {

    private uuid: string = '';
    private label: string = '';
    private displayName: string = '';
    private sections: SectionFilter[] = [];

    public static parseFromThunderstoreData(data: any): ThunderstoreGameSchema {
        const mod = new ThunderstoreGameSchema();
        if (Object.prototype.hasOwnProperty.call(data, "thunderstore")) {
            if (Object.prototype.hasOwnProperty.call(data.thunderstore, "sections")) {
                for (var [label, value] of Object.entries(data.thunderstore.sections)) {
                    mod.addSectionFitlers(SectionFilter.fromData(label, value));
                }
            }
        }
        mod.setUuid(data.uuid);
        mod.setLabel(data.label);
        mod.setDisplayName(data.meta.displayName);
        return mod;
    }

    public fromReactive(reactive: any): ThunderstoreGameSchema {
        this.setUuid(reactive.uuid);
        this.setLabel(reactive.label);
        this.setDisplayName(reactive.displayName);
        this.setSectionFitlers(reactive.sections);
        return this;
    }

    public getUuid(): string {
        return this.uuid;
    }

    public setUuid(uuid: string) {
        this.uuid = uuid;
    }


    public getLabel(): string {
        return this.label;
    }

    public setLabel(label: string) {
        this.label = label;
    }


    public getDisplayName(): string {
        return this.displayName;
    }

    public setDisplayName(displayName: string) {
        this.displayName = displayName;
    }

    public setSectionFitlers(sectionFilters: SectionFilter[]) {
        this.sections = sectionFilters;
    }

    public addSectionFitlers(sectionFilter: SectionFilter) {
        this.sections.push(sectionFilter)
    }
}
