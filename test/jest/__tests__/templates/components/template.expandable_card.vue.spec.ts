import Vuex, { Store } from 'vuex';
import TestSetup from '../../test-setup';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import ExpandableCard from '../../../../../src/components/ExpandableCard.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ExpandableCard component", () => {
    let actions: Record<string, typeof jest.fn>;
    let $store: Store<any>;

    let mountOptions: {
        propsData: {
            description: string,
            id: string,
            allowSorting: boolean,
            enabled: boolean
        },
        slots: {
            title: string,
            otherIcons: string,
            default: string
        },
        mocks: {
            $store: Store<any>,
        }
    };

    beforeEach(() => {
        TestSetup.stubSetUp();

        actions = {'loadModCardSettings': jest.fn()};  // Reset call count.
        $store = new Vuex.Store({
            modules: {
                profile: {
                    state: {
                        expandedByDefault: false
                    },
                    actions,
                    namespaced: true
                }
            }
        });

        mountOptions = Object.seal({
            propsData: {
                description: "This is a description",
                id: "some-id",
                allowSorting: false,
                enabled: true
            },
            slots: {
                title: "Title slot",
                otherIcons: "Icon slot",
                default: "Action slot"
            },
            mocks: {
                $store
            }
        });
    });

    it("Shows the title", async () => {
        const mount = shallowMount(ExpandableCard, mountOptions);
        await mount.vm.$nextTick();
        const found = mount.findComponent({ ref: "title"});
        expect(found.text()).toBe(mountOptions.slots.title);
        expect(actions.loadModCardSettings).toHaveBeenCalledTimes(1);
    });

    it("Does not show the description if not expanded", async () => {
        const mount = shallowMount(ExpandableCard, mountOptions);
        await mount.vm.$nextTick();
        const found = mount.findComponent({ ref: "description"});
        expect(found.isVisible()).toBeFalsy();
    });

    it("Does show the description if expanded", async () => {
        $store.state.profile.expandedByDefault = true;
        const mount = shallowMount(ExpandableCard, mountOptions);
        await mount.vm.$nextTick();
        const found = mount.findComponent({ ref: "description"});
        expect(found.isVisible()).toBeTruthy();
    });

    it("Does not show the footer if not expanded", async () => {
        const mount = shallowMount(ExpandableCard, mountOptions);
        await mount.vm.$nextTick();
        const found = mount.findComponent({ ref: "footer"});
        expect(found.isVisible()).toBeFalsy();
    });

    it("Does show the footer if expanded", async () => {
        $store.state.profile.expandedByDefault = true;
        const mount = shallowMount(ExpandableCard, mountOptions);
        await mount.vm.$nextTick();
        const found = mount.findComponent({ ref: "footer"});
        expect(found.isVisible()).toBeTruthy();
    });

    it("Changes visibility on click", async () => {
        const mount = shallowMount(ExpandableCard, mountOptions);
        await mount.vm.$nextTick();
        expect((mount.vm as any).visible).toBeFalsy();
        const found = mount.findComponent({ ref: "card-expansion"});
        found.trigger("click");
        expect((mount.vm as any).visible).toBeTruthy();
        expect(actions.loadModCardSettings).toHaveBeenCalledTimes(1);
    });

});
