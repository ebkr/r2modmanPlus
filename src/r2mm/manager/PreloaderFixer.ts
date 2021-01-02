import GameDirectoryResolverImpl from '../../r2mm/manager/GameDirectoryResolver';
import R2Error from '../../model/errors/R2Error';
import * as path from 'path';
import FsProvider from '../../providers/generic/file/FsProvider';
import { spawnSync } from 'child_process';
import ManagerInformation from '../../_managerinf/ManagerInformation';

export default class PreloaderFixer {

    public static async fix(): Promise<R2Error | void> {
        const fs = FsProvider.instance;
        const dirResult = await GameDirectoryResolverImpl.instance.getDirectory();
        if (dirResult instanceof R2Error) {
            return dirResult;
        }
        if (!await fs.exists(path.join(dirResult, 'Risk of Rain 2.exe'))) {
            return new R2Error('Risk of Rain 2 directory is invalid', 'could not find "Risk of Rain 2.exe"',
                'Set the Risk of Rain 2 directory in the settings section');
        }
        try {
            await fs.unlink(path.join(dirResult, 'Risk of Rain 2_Data', 'Managed'));
        } catch(e) {
            const err: Error = e;
            return new R2Error('Failed to remove Managed directory', err.message, `Try launching ${ManagerInformation.APP_NAME} as an administrator`);
        }
        try {
            spawnSync(`powershell`, ['start', 'steam://validate/632360']);
        } catch(e) {
            const err: Error = e;
            return new R2Error('Failed to start steam://validate', err.message, null);
        }
    }
}
