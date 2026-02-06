import { defineBoot } from '#q-app/wrappers';
import { EcosystemSchema } from "src/model/schema/ThunderstoreSchema";
import { initModLoaderData } from "src/r2mm/installing/profile_installers/ModLoaderVariantRecord";

export default defineBoot(async () => {
    await EcosystemSchema.load();
    initModLoaderData();
});
