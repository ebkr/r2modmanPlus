import ConfigFile from '../../model/file/ConfigFile';
import { SortConfigFile } from '../../model/real_enums/sort/SortConfigFile';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';

export default class ConfigSort {

    public static sort(configList: ConfigFile[], order: SortConfigFile,
                       direction: SortDirection) {


        const updateList = [...configList];
        const sortedList = updateList.sort((a, b) => {
            switch (order) {
                case SortConfigFile.NAME:
                    return a.getName().localeCompare(b.getName());
                case SortConfigFile.LAST_UPDATED:
                    return a.getLastUpdated() > b.getLastUpdated() ? -1 : 1;
            }
        });
        if (direction === SortDirection.STANDARD) {
            return sortedList;
        }
        return sortedList.reverse();
    }

}
