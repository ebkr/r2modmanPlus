import { BepInExInstaller } from './BepInExInstaller';
import { GodotMLInstaller } from './GodotMLInstaller';
import { MelonLoaderInstaller } from './MelonLoaderInstaller';
import { PackageInstaller } from './PackageInstaller';
import { ShimloaderInstaller, ShimloaderPluginInstaller } from './ShimloaderInstaller';
import { LovelyInstaller, LovelyPluginInstaller } from './LovelyInstaller';
import { NorthstarInstaller } from './NorthstarInstaller';


const _PackageInstallers = {
    // "legacy": new InstallRuleInstaller(),  // TODO: Enable
    "bepinex": new BepInExInstaller(),
    "northstar": new NorthstarInstaller(),
    "godotml": new GodotMLInstaller(),
    "melonloader": new MelonLoaderInstaller(),
    "shimloader": new ShimloaderInstaller(),
    "shimloader-plugin": new ShimloaderPluginInstaller(),
    "lovely": new LovelyInstaller(),
    "lovely-plugin": new LovelyPluginInstaller(),
}

export type PackageInstallerId = keyof typeof _PackageInstallers;
export const PackageInstallers: {[key in PackageInstallerId]: PackageInstaller} = _PackageInstallers;
