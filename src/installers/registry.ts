import { BepInExInstaller } from './BepInExInstaller';
import { GodotMLInstaller } from './GodotMLInstaller';
import { InstallRulePluginInstaller } from './InstallRulePluginInstaller';
import { MelonLoaderInstaller } from './MelonLoaderInstaller';
import { NoOpInstaller } from './NoOpInstaller';
import { PackageInstaller } from './PackageInstaller';
import { ShimloaderInstaller } from './ShimloaderInstaller';
import { LovelyInstaller, LovelyPluginInstaller } from './LovelyInstaller';
import { NorthstarInstaller } from './NorthstarInstaller';
import { ReturnOfModdingInstaller, ReturnOfModdingPluginInstaller } from './ReturnOfModdingInstaller';
import { GDWeaveInstaller, GDWeavePluginInstaller } from './GDWeaveInstaller';
import { RecursiveMelonLoaderInstaller, RecursiveMelonLoaderPluginInstaller } from './RecursiveMelonLoaderInstaller';
import { DirectCopyInstaller } from './DirectCopyInstaller';
import { BepisLoaderInstaller } from './BepisLoaderInstaller';
import { UMMInstaller } from './UMMInstaller';
import { RivetInstaller, RivetPluginInstaller } from './RivetInstaller';
import { PackageLoader } from '../model/schema/ThunderstoreSchema';

export const PackageLoaderInstallers: Record<PackageLoader, PackageInstaller> = {
    [PackageLoader.BEPINEX]: new BepInExInstaller(),
    [PackageLoader.BEPISLOADER]: new BepisLoaderInstaller(),
    [PackageLoader.GDWEAVE]: new GDWeaveInstaller(),
    [PackageLoader.GODOTML]: new GodotMLInstaller(),
    [PackageLoader.LOVELY]: new LovelyInstaller(),
    [PackageLoader.MELONLOADER]: new MelonLoaderInstaller(),
    [PackageLoader.NONE]: new NoOpInstaller(),
    [PackageLoader.NORTHSTAR]: new NorthstarInstaller(),
    [PackageLoader.RECURSIVE_MELONLOADER]: new RecursiveMelonLoaderInstaller(),
    [PackageLoader.RETURN_OF_MODDING]: new ReturnOfModdingInstaller(),
    [PackageLoader.RIVET]: new RivetInstaller(),
    [PackageLoader.SHIMLOADER]: new ShimloaderInstaller(),
    [PackageLoader.UMM]: new UMMInstaller(),
};

const installRulePluginInstaller = new InstallRulePluginInstaller();

export const PluginInstallers: Record<PackageLoader, PackageInstaller> = {
    [PackageLoader.BEPINEX]: installRulePluginInstaller,
    [PackageLoader.BEPISLOADER]: installRulePluginInstaller,
    [PackageLoader.GDWEAVE]: new GDWeavePluginInstaller(),
    [PackageLoader.GODOTML]: installRulePluginInstaller,
    [PackageLoader.LOVELY]: new LovelyPluginInstaller(),
    [PackageLoader.MELONLOADER]: installRulePluginInstaller,
    [PackageLoader.NORTHSTAR]: installRulePluginInstaller,
    [PackageLoader.NONE]: new DirectCopyInstaller(),
    [PackageLoader.RECURSIVE_MELONLOADER]: new RecursiveMelonLoaderPluginInstaller(),
    [PackageLoader.RETURN_OF_MODDING]: new ReturnOfModdingPluginInstaller(),
    [PackageLoader.RIVET]: new RivetPluginInstaller(),
    [PackageLoader.SHIMLOADER]: installRulePluginInstaller,
    [PackageLoader.UMM]: installRulePluginInstaller,
};
