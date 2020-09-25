import 'mocha';
import { assert } from 'chai';
import ProfileProvider from '../../../src/providers/ror2/model_implementation/ProfileProvider';
import ProfileImpl from '../../../src/r2mm/model_implementation/ProfileImpl';

describe('Test providers', () => {

    context("ProfileProvider", async () => {

        it("Not provided", () => {
            assert.throws(() => {
                ProfileProvider.instance;
            })
        })

        it("Provided", () => {
            ProfileProvider.provide(() => new ProfileImpl());
            assert.doesNotThrow(() => {
                ProfileProvider.instance;
            });
        })

    });

});
