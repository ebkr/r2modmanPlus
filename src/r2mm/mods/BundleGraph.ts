import ManifestV2 from '../../model/ManifestV2';
import Dependants from './Dependants';

/**
 * A bundle is an explicitly installed mod ("root") together with its transitive
 * dependency closure. Dependencies form a DAG rather than a tree (a dependency
 * can be shared by multiple roots), so enabling/disabling a whole bundle has to
 * reference-count shared members: a dependency stays enabled as long as any
 * enabled root still needs it.
 *
 * Roots are identified by the ManifestV2.installedAsDependency flag (set at
 * install time / backfilled on load), NOT recomputed here.
 */
export interface Bundle {
    root: ManifestV2;
    // root + its transitive dependencies, in no particular order.
    members: ManifestV2[];
}

export default class BundleGraph {

    /** Mods the user installed explicitly (top-level nodes of the bundle view). */
    public static getRoots(modList: ManifestV2[]): ManifestV2[] {
        return modList.filter((mod) => !mod.isInstalledAsDependency());
    }

    /**
     * The mods belonging to a root's bundle: the root itself plus its transitive
     * dependency closure. Cycle-safe (Dependants tracks visited mods).
     */
    public static getBundleMembers(root: ManifestV2, modList: ManifestV2[]): ManifestV2[] {
        const members = new Set<ManifestV2>([root]);
        Dependants.getDependencyList(root, modList).forEach((dep) => members.add(dep));
        return Array.from(members);
    }

    /** Build a Bundle per root. */
    public static getBundles(modList: ManifestV2[]): Bundle[] {
        return this.getRoots(modList).map((root) => ({
            root,
            members: this.getBundleMembers(root, modList),
        }));
    }

    /**
     * The set of mods to disable when the user disables `root`'s bundle: every
     * member of the bundle that is NOT still required by some other enabled root.
     * "Required by" includes being that other root itself, since each root is a
     * member of its own bundle.
     */
    public static computeDisableSet(root: ManifestV2, modList: ManifestV2[]): ManifestV2[] {
        const keepAlive = this.membersOfOtherEnabledRoots(root, modList);
        return this.getBundleMembers(root, modList).filter((mod) => !keepAlive.has(mod));
    }

    /**
     * The set of mods to enable when the user enables `root`'s bundle: the root
     * and its full dependency closure (mirrors single-mod enable pulling in
     * dependencies).
     */
    public static computeEnableSet(root: ManifestV2, modList: ManifestV2[]): ManifestV2[] {
        return this.getBundleMembers(root, modList);
    }

    /**
     * Roots (other than the current bundle's own root) that keep a given
     * dependency alive. Used to explain to the user why a shared dependency
     * won't be disabled.
     */
    public static getEnabledOwners(mod: ManifestV2, modList: ManifestV2[]): ManifestV2[] {
        return this.getRoots(modList)
            .filter((root) => root.isEnabled())
            .filter((root) => this.getBundleMembers(root, modList).includes(mod));
    }

    private static membersOfOtherEnabledRoots(root: ManifestV2, modList: ManifestV2[]): Set<ManifestV2> {
        const keepAlive = new Set<ManifestV2>();
        for (const other of this.getRoots(modList)) {
            if (other === root || !other.isEnabled()) {
                continue;
            }
            this.getBundleMembers(other, modList).forEach((mod) => keepAlive.add(mod));
        }
        return keepAlive;
    }
}
