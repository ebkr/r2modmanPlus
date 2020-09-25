import ManifestV2 from '../../model/ManifestV2';

export default class Dependants {

    public static getDependantList(manifestMod: ManifestV2, modList: ManifestV2[]): Set<ManifestV2> {
        const dependants = new Set<ManifestV2>();

        // For all mods
        modList.forEach(mod => {
            // Get mod dependencies
            mod.getDependencies().forEach(dependency => {
                // If mod name equals mod trying to get dependants
                if (dependency.startsWith(manifestMod.getName() + "-")) {
                    dependants.add(mod);
                    // Get dependants of new mod
                    this.getDependantList(mod, modList).forEach(recursive => {
                        dependants.add(recursive);
                    })
                }
            })
        })
        return dependants;
    }

    public static getDependencyList(manifestMod: ManifestV2, modList: ManifestV2[]): Set<ManifestV2> {
        const dependencies = new Set<ManifestV2>();
        manifestMod.getDependencies().forEach(dependant => {
            modList.forEach(mod => {
                if (dependant.startsWith(mod.getName() + "-")) {
                    dependencies.add(mod);
                    this.getDependencyList(mod, modList).forEach(recursive => {
                        dependencies.add(recursive);
                    })
                }
            })
        })
        return dependencies;
    }

}
