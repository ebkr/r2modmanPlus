import FsProvider from '../../../src/providers/generic/file/FsProvider';
import StubFsProvider from '../stubs/providers/stub.FsProvider';
import StubInteractionProvider from '../stubs/providers/stub.InteractionProvider';
import InteractionProvider from '../../../src/providers/ror2/system/InteractionProvider';
import StubLinkProvider from '../stubs/providers/stub.LinkProvider';
import LinkProvider from '../../../src/providers/components/LinkProvider';
import StubProfileProvider from '../stubs/providers/stub.ProfileProvider';
import ProfileProvider from '../../../src/providers/ror2/model_implementation/ProfileProvider';

export default class TestSetup {

    public static stubSetUp() {
        const fs = new StubFsProvider();
        FsProvider.provide(() => fs);

        const profileProvider = new StubProfileProvider();
        ProfileProvider.provide(() => profileProvider);

        const interactionProvider = new StubInteractionProvider();
        InteractionProvider.provide(() => interactionProvider);

        const linkProvider = new StubLinkProvider();
        LinkProvider.provide(() => linkProvider);
    }

}
