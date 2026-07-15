import FsProvider from '../providers/generic/file/FsProvider';

// Candidate BepInEx preloader dll names, newest-first. Shared so preloader
// discovery stays consistent between manager-launch (GameInstructionParser) and
// external-launch (DoorstopConfigUtils) code paths.
export const BEPINEX_PRELOADER_DLLS = [
    "BepInEx.Unity.Mono.Preloader.dll",
    "BepInEx.Unity.IL2CPP.dll",
    "BepInEx.Preloader.dll",
    "BepInEx.IL2CPP.dll",
    "BepInEx.NET.CoreCLR.dll",
];

// Accepts both Profile and ImmutableProfile; only joinToProfilePath is needed.
interface ProfilePathLike {
    joinToProfilePath(...paths: string[]): string;
}

export async function getUnityDoorstopVersion(profile: ProfilePathLike): Promise<number> {
    if (await FsProvider.instance.exists(profile.joinToProfilePath(".doorstop_version"))) {
        const dvContent = (await FsProvider.instance.readFile(profile.joinToProfilePath(".doorstop_version"))).toString();
        const majorVersion = Number(dvContent.split(".")[0]);
        if (majorVersion && majorVersion > 3) {
            return majorVersion;
        }
    }
    return 3;
}
