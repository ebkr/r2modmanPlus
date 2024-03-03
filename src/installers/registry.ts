import { PackageInstaller } from "./PackageInstaller";
import { ProfileLinker } from "./ProfileLinker";
import { BepInExInstaller } from "./BepInExInstaller";
import { GodotMLInstaller } from "./GodotMLInstaller";
import { MelonLoaderInstaller } from "./MelonLoaderInstaller";
import { InstallRuleInstaller } from "./InstallRuleInstaller";
import { ShimloaderInstaller, ShimloaderPluginInstaller, ShimloaderLinker } from "./ShimloaderInstaller";
import { SplotchInstaller, SplotchPluginInstaller, SplotchLinker } from "./SplotchInstaller";


const _PackageInstallers = {
    // "legacy": new InstallRuleInstaller(),  // TODO: Enable
    "bepinex": new BepInExInstaller(),
    "godotml": new GodotMLInstaller(),
    "melonloader": new MelonLoaderInstaller(),
    "shimloader": new ShimloaderInstaller(),
    "shimloader-plugin": new ShimloaderPluginInstaller(),
    "splotch": new SplotchInstaller(),
    "splotch-plugin": new SplotchPluginInstaller(),
}

const _ProfileLinkers = {
    "shimloader-linker": new ShimloaderLinker(),
    "splotch-linker": new SplotchLinker(),
}

export type PackageInstallerId = keyof typeof _PackageInstallers;
export const PackageInstallers: {[key in PackageInstallerId]: PackageInstaller} = _PackageInstallers;

export type ProfileLinkerId = keyof typeof _ProfileLinkers;
export const ProfileLinkers: {[key in ProfileLinkerId]: ProfileLinker} = _ProfileLinkers;
