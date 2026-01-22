import ManifestV2 from '../../model/ManifestV2';

export default class Dependants {

    private static buildDependantIndex(modList: ManifestV2[]): Map<string, ManifestV2[]> {
        const index = new Map<string, ManifestV2[]>();
        for (const mod of modList) {
            for (const dep of mod.getDependencies()) {
                const depName = dep.substring(0, dep.lastIndexOf('-'));
                if (!index.has(depName)) {
                    index.set(depName, []);
                }
                index.get(depName)!.push(mod);
            }
        }
        return index;
    }

    private static buildModMap(modList: ManifestV2[]): Map<string, ManifestV2> {
        const map = new Map<string, ManifestV2>();
        for (const mod of modList) {
            map.set(mod.getName(), mod);
        }
        return map;
    }

    public static getDependantList(
        manifestMod: ManifestV2,
        modList: ManifestV2[],
        dependantSet?: Set<ManifestV2>,
        dependantIndex?: Map<string, ManifestV2[]>
    ): Set<ManifestV2> {
        const dependants = dependantSet || new Set<ManifestV2>();
        const index = dependantIndex || this.buildDependantIndex(modList);

        const directDependants = index.get(manifestMod.getName()) || [];
        for (const mod of directDependants) {
            if (!dependants.has(mod)) {
                dependants.add(mod);
                this.getDependantList(mod, modList, dependants, index);
            }
        }
        return dependants;
    }

    public static getDependencyList(
        manifestMod: ManifestV2,
        modList: ManifestV2[],
        dependencySet?: Set<ManifestV2>,
        modMap?: Map<string, ManifestV2>
    ): Set<ManifestV2> {
        const dependencies = dependencySet || new Set<ManifestV2>();
        const map = modMap || this.buildModMap(modList);

        for (const depString of manifestMod.getDependencies()) {
            const depName = depString.substring(0, depString.lastIndexOf('-'));
            const mod = map.get(depName);
            if (mod !== undefined && !dependencies.has(mod)) {
                dependencies.add(mod);
                this.getDependencyList(mod, modList, dependencies, map);
            }
        }
        return dependencies;
    }

}
