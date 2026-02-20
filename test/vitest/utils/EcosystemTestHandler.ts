import { EcosystemSchema } from '../../../src/model/schema/ThunderstoreSchema';
import * as EcosystemData from '../../../public/data/ecosystem.json';
import { initModLoaderData } from '../../../src/r2mm/installing/profile_installers/ModLoaderVariantRecord';

export function replaceEcosystemWithRealData() {
    (EcosystemSchema as any)._ecosystem = EcosystemData;
    initModLoaderData();
}
