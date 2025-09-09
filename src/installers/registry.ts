import { BepInExInstaller } from './BepInExInstaller';
import { GodotMLInstaller } from './GodotMLInstaller';
import { MelonLoaderInstaller } from './MelonLoaderInstaller';
import { PackageInstaller } from './PackageInstaller';
import { ShimloaderInstaller, ShimloaderPluginInstaller } from './ShimloaderInstaller';
import { LovelyInstaller, LovelyPluginInstaller } from './LovelyInstaller';
import { NorthstarInstaller } from './NorthstarInstaller';
import { ReturnOfModdingInstaller, ReturnOfModdingPluginInstaller } from './ReturnOfModdingInstaller';
import { GDWeaveInstaller, GDWeavePluginInstaller } from './GDWeaveInstaller';
import { RecursiveMelonLoaderInstaller, RecursiveMelonLoaderPluginInstaller } from './RecursiveMelonLoaderInstaller';
import { DirectCopyInstaller } from './DirectCopyInstaller';
import { BepisLoaderInstaller } from './BepisLoaderInstaller';
import { PackageLoader } from '../model/schema/ThunderstoreSchema';

/**
 * Package loader installer registry
 */
type LoaderInstallers = Exclude<PackageLoader, PackageLoader.NONE>;

const PackageLoaderInstallers: Record<LoaderInstallers, PackageInstaller> = {
    [PackageLoader.BEPINEX]: new BepInExInstaller(),
    [PackageLoader.BEPISLOADER]: new BepisLoaderInstaller(),
    [PackageLoader.GDWEAVE]: new GDWeaveInstaller(),
    [PackageLoader.GODOTML]: new GodotMLInstaller(),
    [PackageLoader.LOVELY]: new LovelyInstaller(),
    [PackageLoader.MELONLOADER]: new MelonLoaderInstaller(),
    [PackageLoader.NORTHSTAR]: new NorthstarInstaller(),
    [PackageLoader.RECURSIVE_MELONLOADER]: new RecursiveMelonLoaderInstaller(),
    [PackageLoader.RETURN_OF_MODDING]: new ReturnOfModdingInstaller(),
    [PackageLoader.SHIMLOADER]: new ShimloaderInstaller(),
};

export function getPackageLoaderInstaller(loader: PackageLoader): PackageInstaller|null {
    if (loader === PackageLoader.NONE) {
        return null;
    }

    return PackageLoaderInstallers[loader];
}


/**
 * Plugin installer registry
 */
type InstallRuleInstallers = PackageLoader.BEPINEX | PackageLoader.BEPISLOADER | PackageLoader.GODOTML | PackageLoader.MELONLOADER | PackageLoader.NORTHSTAR;
type PluginInstallers = Exclude<PackageLoader, InstallRuleInstallers>;

const PluginInstallers: Record<PluginInstallers, PackageInstaller> = {
    [PackageLoader.GDWEAVE]: new GDWeavePluginInstaller(),
    [PackageLoader.LOVELY]: new LovelyPluginInstaller(),
    [PackageLoader.NONE]: new DirectCopyInstaller(),
    [PackageLoader.RECURSIVE_MELONLOADER]: new RecursiveMelonLoaderPluginInstaller(),
    [PackageLoader.RETURN_OF_MODDING]: new ReturnOfModdingPluginInstaller(),
    [PackageLoader.SHIMLOADER]: new ShimloaderPluginInstaller(),
};

function isPluginInstaller(loader: PackageLoader): loader is PluginInstallers {
    return !(
        loader === PackageLoader.BEPINEX ||
        loader === PackageLoader.BEPISLOADER ||
        loader === PackageLoader.GODOTML ||
        loader === PackageLoader.MELONLOADER ||
        loader === PackageLoader.NORTHSTAR
    );
}

export function getPluginInstaller(loader: PackageLoader): PackageInstaller|null {
    if (!isPluginInstaller(loader)) {
        return null;
    }

    return PluginInstallers[loader];
}
