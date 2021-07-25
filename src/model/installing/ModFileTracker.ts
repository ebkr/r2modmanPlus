// Designed to be used to record state of which mods install to where.
export default interface ModFileTracker {

    modName: string;
    files: [string, string][];

}
