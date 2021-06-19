import 'mocha';
import PathResolver from '../../../src/r2mm/manager/PathResolver';
import FsProvider from '../../../src/providers/generic/file/FsProvider';
import Profile from '../../../src/model/Profile';
import FileUtils from '../../../src/utils/FileUtils';
import NodeFs from '../../../src/providers/generic/file/NodeFs';
import StubFsProvider from './stubs/providers/stub.FsProvider';
import StubInteractionProvider from './stubs/providers/stub.InteractionProvider';
import InteractionProvider from '../../../src/providers/ror2/system/InteractionProvider';
import StubLinkProvider from './stubs/providers/stub.LinkProvider';
import LinkProvider from '../../../src/providers/components/LinkProvider';

export default class TestSetup {

    public static setUp() {
        const fs = new NodeFs();
        FsProvider.provide(() => fs);
        PathResolver.APPDATA_DIR = '__test_data__';
        new Profile('Default');
    }

    public static async tearDown() {
        const fs = FsProvider.instance;
        await FileUtils.emptyDirectory(PathResolver.APPDATA_DIR);
        await fs.rmdir(PathResolver.APPDATA_DIR);
    }

    public static stubSetUp() {
        const fs = new StubFsProvider();
        FsProvider.provide(() => fs);

        const interactionProvider = new StubInteractionProvider();
        InteractionProvider.provide(() => interactionProvider);

        const linkProvider = new StubLinkProvider();
        LinkProvider.provide(() => linkProvider);
    }

}
