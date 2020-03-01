import ManifestV2 from 'src/model/ManifestV2';

export default class Dependants {

    public static getDependantList(manifestMod: ManifestV2, modList: ManifestV2[]): Set<ManifestV2> {
        const dependants = new Set<ManifestV2>();
        modList.forEach(dependant => {
            dependant.getDependencies().forEach(mod => {
                if (mod.startsWith(manifestMod.getName())) {
                    dependants.add(dependant);
                    this.getDependantList(dependant, modList).forEach(recursive => {
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
                if (dependant.startsWith(mod.getName())) {
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