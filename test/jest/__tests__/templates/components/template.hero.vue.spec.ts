import TestSetup from '../../test-setup';
import { shallowMount } from '@vue/test-utils';
import { Hero } from '../../../../../src/components/all';

type MountOptions = {
    propsData: {
        title: string,
        heroType: string,
        subtitle: string
    }
};

describe("Hero component", () => {


    let mountOptions: MountOptions;

    beforeEach(() => {
        TestSetup.stubSetUp();
        mountOptions = {
            propsData: {
                title: "Some title",
                heroType: "Hero Type",
                subtitle: "Some subtitle"
            }
        }
    });

    it("Has title text", () => {
        const mount = shallowMount(Hero, mountOptions);
        const found = mount.findComponent({ ref: "title"});
        expect(found.text()).toBe(mountOptions.propsData.title);
    });

    it("Has subtitle text", () => {
        const mount = shallowMount(Hero, mountOptions);
        const found = mount.findComponent({ ref: "subtitle"});
        expect(found.text()).toBe(mountOptions.propsData.subtitle);
    });

    it("Has correct class", () => {
        const mount = shallowMount(Hero, mountOptions);
        const found = mount.findComponent({ ref: "section"});
        expect(found.classes().join(" ")).toBe(`hero ${mountOptions.propsData.heroType}`);
    });

});
