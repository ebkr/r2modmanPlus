import { BepInExInstaller } from "./BepInExInstaller";
import { GodotMLInstaller } from "./GodotMLInstaller";
import { MelonLoaderInstaller } from "./MelonLoaderInstaller";
import { PackageInstaller } from "./PackageInstaller";


const _PackageInstallers = {
    "bepinex": new BepInExInstaller(),
    "godotml": new GodotMLInstaller(),
    "melonloader": new MelonLoaderInstaller(),
}

export type PackageInstallerId = keyof typeof _PackageInstallers;
export const PackageInstallers: {[key in PackageInstallerId]: PackageInstaller} = _PackageInstallers;
