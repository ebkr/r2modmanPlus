import { defineBoot } from '#q-app';
import {updateEcosystemReactives} from "@r2/r2mm/ecosystem/EcosystemSchema";
import FsProvider from "@r2/providers/generic/file/FsProvider";
import {NodeFsImplementation} from "@r2/providers/node/fs/NodeFsImplementation";

// @ts-ignore
export default defineBoot(async ({ app }) => {
    FsProvider.provide(() => NodeFsImplementation);
    await updateEcosystemReactives();
    // @ts-ignore
    FsProvider.provide(() => undefined);
});
