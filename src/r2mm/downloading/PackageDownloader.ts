import ThunderstoreMod from '../../model/ThunderstoreMod';
import { PackageDownloadDto } from '../downloading/PackageDownloadDto';
import ThunderstoreCombo from '../../model/ThunderstoreCombo';
import ResolvedDependency from '../downloading/ResolvedDependency';
import ThunderstorePackages from '../data/ThunderstorePackages';
import ModDownloadProgressDto from '../downloading/ModDownloadProgressDto';
import ThunderstoreVersion from 'src/model/ThunderstoreVersion';

type DownloadCallback = (dto: PackageDownloadDto) => void;

export default class PackageDownloader {

    private resolveDependenciesForMod(mod: ThunderstoreCombo, existingDependencies: Map<string, ResolvedDependency>, packageMap: Map<String, ThunderstoreMod>, versionMap: Map<String, ThunderstoreVersion>) {
        const resolvedAtCurrentLevel: ThunderstoreCombo[] = [];
        mod.getVersion()
            .getDependencies()
            .forEach(version => {
                // Find exact dependency
                const dependency = versionMap.get(version);

                if (dependency) {
                    const combo = new ThunderstoreCombo();
                    combo.setMod(packageMap.get(dependency.getName())!);
                    combo.setVersion(dependency);
                    // If doesn't exist, add to map
                    if (!existingDependencies.has(dependency.getName())) {
                        resolvedAtCurrentLevel.push(combo);
                        existingDependencies.set(dependency.getName(), {
                            name: dependency.getName(),
                            version: dependency.getVersionNumber(),
                            combo: combo
                        });
                    } else {
                        // Only replace existing dependency if depended version is newer
                        const dependencyIsNewer = dependency.getVersionNumber()
                            .isNewerThan(existingDependencies.get(dependency.getName())!.version);
                        if (dependencyIsNewer) {
                            resolvedAtCurrentLevel.push(combo);
                            existingDependencies.set(dependency.getName(), {
                                name: dependency.getName(),
                                version: dependency.getVersionNumber(),
                                combo: combo
                            });
                        }
                    }
                }
            });
        // Find dependencies required at a deeper level
        resolvedAtCurrentLevel.forEach(value => this.resolveDependenciesForMod(value, existingDependencies, packageMap, versionMap));
    }

    public resolveDependencies(mods: ThunderstoreCombo[]): Array<ResolvedDependency> {
        const packageMap = ThunderstorePackages.PACKAGES_MAP;
        const versionMap = ThunderstorePackages.VERSIONS_MAP;
        const dependencyBuilder = new Map<string, ResolvedDependency>();

        mods.map(mod => this.resolveDependenciesForMod(
            mod,
            dependencyBuilder,
            packageMap,
            versionMap
        ));
        return [...dependencyBuilder.values()];
    }

    public sortDependencyOrder(deps: ResolvedDependency[]) {
        deps.sort((a, b) => {
            const isDependedOn = a.combo.getVersion()
                .getDependencies()
                .find(value => value.startsWith(b.combo.getMod().getFullName() + "-"));

            if (isDependedOn) {
                return 1;
            } else {
                return -1;
            }
        })
    }

    public download(mods: ThunderstoreCombo[], downloadCallback: DownloadCallback) {
        const dependencies = this.resolveDependencies(mods);
        this.sortDependencyOrder(dependencies);
        const makeProgressDto = (mod: ThunderstoreCombo, isDependency: boolean): ModDownloadProgressDto => {
            return {
                mod: mod.getVersion().getFullName(),
                downloadedSize: 0,
                downloadProgress: 0,
                totalSize: 0,
                isDependency: isDependency
            } as ModDownloadProgressDto;
        };
        const downloadDtos = [
            ...dependencies.sort().map(value => makeProgressDto(value.combo, true)),
            ...mods.map(value => makeProgressDto(value, false))
        ];
        const packageDto = {
            mods: downloadDtos,
            totalSize: 0,
            totalProgress: 0,
            hasErrored: false,
            currentPosition: 0,
            finalPosition: 0
        } as PackageDownloadDto;
    }

    private async performDownload(packageDto: PackageDownloadDto, downloadCallback: DownloadCallback) {
        // Prepare given dto
        packageDto.finalPosition = packageDto.mods.length;

        // Send dto to update screen with barebones information
        downloadCallback(packageDto);

        packageDto.mods.forEach(value => {
            // TODO - download mods and track progress
        })
    }

}
