import DexiePrep from 'app/test/jest/__tests__/impl/RollbackableSettings/dexie.prep';
import SettingsDexieStore from 'src/r2mm/manager/SettingsDexieStore';
import GameManager from 'src/model/game/GameManager';

describe("Setup legacy", () => {

    beforeAll(async () => {
        DexiePrep.initDexie();
    })

    test("Init legacy", async () => {


        const settingsStore = new SettingsDexieStore(GameManager.unsetGame());

        expect(settingsStore.getLatest()).not.toBeNull();

    })

})
