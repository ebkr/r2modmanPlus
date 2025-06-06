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
import { PackageLoader } from '../model/schema/ThunderstoreSchema';

/**
 * Package loader installer registry
 */
type LoaderInstallers = Exclude<PackageLoader, PackageLoader.None>;

const PackageLoaderInstallers: Record<LoaderInstallers, PackageInstaller> = {
    [PackageLoader.Bepinex]: new BepInExInstaller(),
    [PackageLoader.Gdweave]: new GDWeaveInstaller(),
    [PackageLoader.Godotml]: new GodotMLInstaller(),
    [PackageLoader.Lovely]: new LovelyInstaller(),
    [PackageLoader.Melonloader]: new MelonLoaderInstaller(),
    [PackageLoader.Northstar]: new NorthstarInstaller(),
    [PackageLoader.RecursiveMelonloader]: new RecursiveMelonLoaderInstaller(),
    [PackageLoader.Returnofmodding]: new ReturnOfModdingInstaller(),
    [PackageLoader.Shimloader]: new ShimloaderInstaller(),
};

export function getPackageLoaderInstaller(loader: PackageLoader): PackageInstaller|null {
    if (loader === PackageLoader.None) {
        return null;
    }

    return PackageLoaderInstallers[loader];
}


/**
 * Plugin installer registry
 */
type InstallRuleInstallers = PackageLoader.Bepinex | PackageLoader.Godotml | PackageLoader.Melonloader | PackageLoader.Northstar;
type PluginInstallers = Exclude<PackageLoader, InstallRuleInstallers>;

const PluginInstallers: Record<PluginInstallers, PackageInstaller> = {
    [PackageLoader.Gdweave]: new GDWeavePluginInstaller(),
    [PackageLoader.Lovely]: new LovelyPluginInstaller(),
    [PackageLoader.None]: new DirectCopyInstaller(),
    [PackageLoader.RecursiveMelonloader]: new RecursiveMelonLoaderPluginInstaller(),
    [PackageLoader.Returnofmodding]: new ReturnOfModdingPluginInstaller(),
    [PackageLoader.Shimloader]: new ShimloaderPluginInstaller(),
};

function isPluginInstaller(loader: PackageLoader): loader is PluginInstallers {
    return !(
        loader === PackageLoader.Bepinex ||
        loader === PackageLoader.Godotml ||
        loader === PackageLoader.Melonloader ||
        loader === PackageLoader.Northstar
    );
}

export function getPluginInstaller(loader: PackageLoader): PackageInstaller|null {
    if (!isPluginInstaller(loader)) {
        return null;
    }

    return PluginInstallers[loader];
}
