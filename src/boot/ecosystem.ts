import { defineBoot } from '#q-app/wrappers';
import {EcosystemSchema} from "src/model/schema/ThunderstoreSchema";

// @ts-ignore
export default defineBoot(async ({ app }) => {
    EcosystemSchema.init();
});
