import { defineBoot } from '#q-app/wrappers';
import {updateEcosystemReactives} from "src/r2mm/ecosystem/EcosystemMerge";
import FsProvider from "src/providers/generic/file/FsProvider";
import {NodeFsImplementation} from "src/providers/node/fs/NodeFsImplementation";

// @ts-ignore
export default defineBoot(async ({ app }) => {
    FsProvider.provide(() => NodeFsImplementation);
    await updateEcosystemReactives();
    // @ts-ignore
    FsProvider.provide(() => undefined);
});
