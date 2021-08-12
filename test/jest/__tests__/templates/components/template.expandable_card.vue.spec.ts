import TestSetup from '../../test-setup';
import { shallowMount } from '@vue/test-utils';
import ExpandableCard from '../../../../../src/components/ExpandableCard.vue';

describe("ExpandableCard component", () => {

    let mountOptions: {
        propsData: {
            description: string,
            id: string,
            expandedByDefault: boolean,
            showSort: boolean,
            manualSortUp: boolean,
            manualSortDown: boolean,
            darkTheme: boolean,
            enabled: boolean
        },
        slots: {
            title: string,
            otherIcons: string,
            default: string
        }
    };

    beforeEach(() => {
        TestSetup.stubSetUp();
        mountOptions = Object.seal({
            propsData: {
                description: "This is a description",
                id: "some-id",
                expandedByDefault: false,
                showSort: false,
                manualSortUp: true,
                manualSortDown: true,
                darkTheme: false,
                enabled: true
            },
            slots: {
                title: "Title slot",
                otherIcons: "Icon slot",
                default: "Action slot"
            }
        });
    });

    it("Shows the title", () => {
        const mount = shallowMount(ExpandableCard, mountOptions);
        const found = mount.findComponent({ ref: "title"});
        expect(found.text()).toBe(mountOptions.slots.title);
    });

    it("Does not show the description if not expanded", () => {
        const mount = shallowMount(ExpandableCard, mountOptions);
        const found = mount.findComponent({ ref: "description"});
        expect(found.isVisible()).toBeFalsy();
    });

    it("Does show the description if expanded", () => {
        mountOptions.propsData.expandedByDefault = true;
        const mount = shallowMount(ExpandableCard, mountOptions);
        const found = mount.findComponent({ ref: "description"});
        expect(found.isVisible()).toBeTruthy();
    });

    it("Does not show the footer if not expanded", () => {
        const mount = shallowMount(ExpandableCard, mountOptions);
        const found = mount.findComponent({ ref: "footer"});
        expect(found.isVisible()).toBeFalsy();
    });

    it("Does show the footer if expanded", () => {
        mountOptions.propsData.expandedByDefault = true;
        const mount = shallowMount(ExpandableCard, mountOptions);
        const found = mount.findComponent({ ref: "footer"});
        expect(found.isVisible()).toBeTruthy();
    });

    it("Changes visibility on click", () => {
        const mount = shallowMount(ExpandableCard, mountOptions);
        expect((mount.vm as any).visible).toBeFalsy();
        const found = mount.findComponent({ ref: "card-expansion"});
        found.trigger("click");
        expect((mount.vm as any).visible).toBeTruthy();
    });

});
