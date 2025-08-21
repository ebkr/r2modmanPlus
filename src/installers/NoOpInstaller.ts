import { InstallArgs, PackageInstaller } from './PackageInstaller';

/**
 * Doesn't do anything. Provides compatible API for games that
 * don't use package loaders, but do depend on profile directories.
 * In practice this never gets called as ModLoaderVariantRecord
 * naturally doesn't ever refer this, but it's required for type
 * safety and its existence simplifies the code.
 */
export class NoOpInstaller implements PackageInstaller {
    async install(args: InstallArgs): Promise<void> {}
    async uninstall(args: InstallArgs): Promise<void> {}
}
