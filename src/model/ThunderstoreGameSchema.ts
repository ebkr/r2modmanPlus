import ReactiveObjectConverterInterface from './safety/ReactiveObjectConverter';
import SectionFilter from './section/SectionFilter';

/*
"atomicrops": {
    "uuid": "0730de09-f183-4cdc-ba4e-ddff5077f99b",
    "label": "atomicrops",
    "meta": {
        "displayName": "Atomicrops",
        "iconUrl": "None"
    },
    "distributions": [],
    "thunderstore": {
        "displayName": "Atomicrops",
        "categories": {
            "mods": {
            "label": "Mods"
            },
            "modpacks": {
            "label": "Modpacks"
            },
            "tools": {
            "label": "Tools"
            },
            "libraries": {
            "label": "Libraries"
            },
            "misc": {
            "label": "Misc"
            },
            "audio": {
            "label": "Audio"
            }
        },
        "sections": {
            "mods": {
            "name": "Mods",
            "excludeCategories": [
                "modpacks"
            ]
            },
            "modpacks": {
            "name": "Modpacks",
            "requireCategories": [
                "modpacks"
            ]
            }
        },
        "discordUrl": "https://discord.gg/4G3sfhYp"
    }
}
*/

export default class ThunderstoreGameSchema implements ReactiveObjectConverterInterface {

    private uuid: string = '';
    private label: string = '';
    private displayName: string = '';
    private sections: SectionFilter[] = [];

    public static parseFromThunderstoreData(data: any): ThunderstoreGameSchema {
        console.log("parseFromThunderstoreData")
        console.log(data)
        const mod = new ThunderstoreGameSchema();
        if (Object.prototype.hasOwnProperty.call(data, "thunderstore")) {
            console.log("has thunderstore")
            if (Object.prototype.hasOwnProperty.call(data.thunderstore, "sections")) {
                console.log("has sections")
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
