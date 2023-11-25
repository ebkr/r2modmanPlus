import VersionNumber from 'src/model/VersionNumber';
import { EventManager } from 'src/cli/EventManager';
import { CliProgressCallback, CliStateCallback } from 'src/cli/CliProvider';
import ThunderstorePackages from 'src/r2mm/data/ThunderstorePackages';
import R2Error from 'src/model/errors/R2Error';
import * as path from 'path';
import PathResolver from 'src/r2mm/manager/PathResolver';
import FsProvider from 'src/providers/generic/file/FsProvider';
import axios from 'axios';

export default class PackageDownloader {

    public static async downloadPackage(
        packageName: string,
        version: VersionNumber,
        downloadEventManager: EventManager<CliProgressCallback>,
        writeToDiskEventManager: EventManager<CliProgressCallback>,
        successStateManager: EventManager<CliStateCallback>)
        : Promise<void> {

        const packageMap = ThunderstorePackages.PACKAGES_MAP;
        if (!packageMap.has(packageName)) {
            successStateManager.publish({
                finished: false,
                error: new R2Error(`${packageName} not found`, `Unable to find package ${packageName}`, 'Refresh the mod list via the settings screen or try again later')
            } as CliStateCallback);
            return;
        }

        const pkg = packageMap.get(packageName)!;
        const pkgVersion = pkg.getVersions()
            .find(pv => pv.getVersionNumber().isEqualTo(version));

        if (pkgVersion === undefined) {
            successStateManager.publish({
                finished: false,
                error: new R2Error(`${packageName}-${version.toString()} not found`, `No version of ${packageName} matching ${version.toString()} was found`, 'Refresh the mod list via the settings screen or try again later')
            } as CliStateCallback);
            return;
        }

        const cacheDirectory = path.join(PathResolver.MOD_ROOT, 'cache');
        const writeDir = path.join(cacheDirectory, packageName, version.toString());
        const filePath = path.join(writeDir, `${packageName}-${version.toString()}.zip`);

        await FsProvider.instance.mkdirs(writeDir);
        if (await FsProvider.instance.exists(filePath)) {
            await FsProvider.instance.unlink(filePath);
        }

        axios.get(pkgVersion.getDownloadUrl(), {
            onDownloadProgress: progress => {
                downloadEventManager.publish({
                    currentBytes: progress.loaded,
                    totalBytes: progress.total
                } as CliProgressCallback);
            },
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/zip',
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then(response => {
                const buf: Buffer = Buffer.from(response.data);
                return FsProvider.instance.writeFile(filePath, buf);
            })
            .then(() => {
                successStateManager.publish({
                    finished: true
                } as CliStateCallback);
            })
            .catch(reason => {
                successStateManager.publish({
                    finished: false,
                    error: new R2Error(
                        `Failed to download ${packageName}-${version.toString()}`,
                        reason
                    )
                } as CliStateCallback);
            });
    }

}
