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
    "returnofmodding": new ReturnOfModdingInstaller(),
    "returnofmodding-plugin": new ReturnOfModdingPluginInstaller(),
    "gdweave": new GDWeaveInstaller(),
    "gdweave-plugin": new GDWeavePluginInstaller(),
    "recursive-melonloader": new RecursiveMelonLoaderInstaller(),
    "recursive-melonloader-plugin": new RecursiveMelonLoaderPluginInstaller(),
}

export type PackageInstallerId = keyof typeof _PackageInstallers;
export const PackageInstallers: {[key in PackageInstallerId]: PackageInstaller} = _PackageInstallers;
