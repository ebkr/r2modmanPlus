import { BepInExInstaller } from "./BepInExInstaller";
import { GodotMLInstaller } from "./GodotMLInstaller";
import { MelonLoaderInstaller } from "./MelonLoaderInstaller";
import { PackageInstaller } from "./PackageInstaller";
import { InstallRuleInstaller } from "./InstallRuleInstaller";
import { ShimloaderInstaller, ShimloaderPluginInstaller } from "./ShimloaderInstaller";
import { LovelyInstaller, LovelyPluginInstaller } from "./LovelyInstaller";
import { ReturnOfModdingInstaller } from "./ReturnOfModdingInstaller";


const _PackageInstallers = {
    // "legacy": new InstallRuleInstaller(),  // TODO: Enable
    "bepinex": new BepInExInstaller(),
    "godotml": new GodotMLInstaller(),
    "melonloader": new MelonLoaderInstaller(),
    "shimloader": new ShimloaderInstaller(),
    "shimloader-plugin": new ShimloaderPluginInstaller(),
    "lovely": new LovelyInstaller(),
    "lovely-plugin": new LovelyPluginInstaller(),
    "returnofmodding": new ReturnOfModdingInstaller(),
}

export type PackageInstallerId = keyof typeof _PackageInstallers;
export const PackageInstallers: {[key in PackageInstallerId]: PackageInstaller} = _PackageInstallers;
