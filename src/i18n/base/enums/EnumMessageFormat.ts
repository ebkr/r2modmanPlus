import SortingStyle from "../../../model/enums/SortingStyle";
import { LaunchType } from "../../../model/real_enums/launch/LaunchType";
import { SortConfigFile } from "../../../model/real_enums/sort/SortConfigFile";
import { SortDirection } from "../../../model/real_enums/sort/SortDirection";
import {SortLocalDisabledMods} from "../../../model/real_enums/sort/SortLocalDisabledMods";
import { SortNaming } from "../../../model/real_enums/sort/SortNaming";



export type EnumMessageFormat = {
    sortNaming: { [key in keyof typeof SortNaming]: string; },
    sortDirection: { [key in keyof typeof SortDirection]: string; },
    sortLocalDisabledMods: { [key in keyof typeof SortLocalDisabledMods]: string; },
    sortingStyle: { [key in keyof typeof SortingStyle]: string; },
    launchType: { [key in keyof typeof LaunchType]: string; },
    sortConfigFile: { [key in keyof typeof SortConfigFile]: string; }
}
