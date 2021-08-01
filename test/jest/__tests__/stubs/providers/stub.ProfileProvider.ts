import ProfileProvider from 'src/providers/ror2/model_implementation/ProfileProvider';

export default class StubProfileProvider extends ProfileProvider {

    ensureProfileDirectory(directory: string, profile: string): void {
        throw new Error("Stub access must be mocked or spied");
    }

}
