import TestSetup from '../../test-setup';
import { mount, shallowMount } from '@vue/test-utils';
import { Hero } from '../../../../../src/components/all';

type MountOptions = {
    propsData: {
        title: string,
        heroType: string,
        subtitle: string
    }
};

describe('Hero component', () => {


    const mountOptions = {
        props: ['title', 'heroType', 'subtitle'],
        propsData: {
            title: 'Some title',
            heroType: 'warning',
            subtitle: 'Some subtitle'
        }
    };

    beforeEach(() => {
        TestSetup.stubSetUp();
    });

    it('Has title text', () => {
        const m = shallowMount(Hero, mountOptions);
        const found = m.findComponent({ ref: 'title' });
        expect(found.text()).toBe(mountOptions.propsData!.title);
    });

    it('Has subtitle text', () => {
        const mount = shallowMount(Hero, mountOptions);
        const found = mount.findComponent({ ref: 'subtitle' });
        expect(found.text()).toBe(mountOptions.propsData.subtitle);
    });

    it('Has correct class', () => {
        const m = mount(Hero, mountOptions);
        const found = m.findComponent({ ref: 'section' });
        expect(found.classes().join(' ')).toBe(`c-hero`);
        console.log("vm:", found.vm);
        // expect().toBe(`c-hero--${mountOptions.propsData.heroType}`)
    });

});
