import ManifestV2 from '../../model/ManifestV2';
import { SortDirection } from '../../model/real_enums/sort/SortDirection';
import { SortLocalDisabledMods } from '../../model/real_enums/sort/SortLocalDisabledMods';
import { SortNaming } from '../../model/real_enums/sort/SortNaming';

export default class ModListSort {

    public static sortLocalModList(modList: ManifestV2[], sortDirection: SortDirection,
                                   disabledModPosition: SortLocalDisabledMods, sortNaming: SortNaming): ManifestV2[] {

        let updatedModList = [...modList];
        if (disabledModPosition === SortLocalDisabledMods.NONE) {
            updatedModList = updatedModList.filter(value => value.isEnabled());
        }
        updatedModList = updatedModList.sort((a, b) => {
            if (a === b) return 0;

            // Sort by mod data filter
            return this.compareData(a, b, sortNaming);
        });
        if (sortDirection === SortDirection.REVERSE) {
            updatedModList = updatedModList.reverse();
        }
        return updatedModList.sort((a, b) => {
            // Sort by deprecated filter
            if (disabledModPosition === SortLocalDisabledMods.FIRST) {
                const comparedPosition = this.compareDeprecated(a, b);
                if (comparedPosition !== 0) return -comparedPosition;
            } else if (disabledModPosition === SortLocalDisabledMods.LAST) {
                const comparedPosition = this.compareDeprecated(a, b);
                if (comparedPosition !== 0) return comparedPosition;
            }
            return 0;
        });
    }

    private static compareDeprecated(a: ManifestV2, b: ManifestV2): number {
        if (a.isEnabled() && b.isEnabled()) {
            return 0;
        } else if (!a.isEnabled() && b.isEnabled()) {
            return 1;
        } else if (a.isEnabled() && !b.isEnabled()) {
            return -1;
        } else {
            return 0;
        }
    }

    private static compareData(a: ManifestV2, b: ManifestV2, sortNaming: SortNaming): number {
        switch (sortNaming) {
            case SortNaming.MOD_NAME:
                return a.getDisplayName().localeCompare(b.getDisplayName());
            case SortNaming.AUTHOR:
                return a.getAuthorName().localeCompare(b.getAuthorName());
            case SortNaming.CUSTOM:
                return 0;
        }
    }

}
