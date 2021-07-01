import TestSetup from '../../test-setup';
import { shallowMount, Wrapper } from '@vue/test-utils';
import Link from 'components/Link.vue';
import Sinon from 'sinon';
import LinkProvider from '../../../../../src/providers/components/LinkProvider';

describe("Link component", () => {

    const sandbox = Sinon.createSandbox();

    beforeEach(() => {
        TestSetup.stubSetUp();
    });

    describe("File link has the correct display", () => {

        // @ts-ignore
        // Ignore because `before` runs prior.
        let mount: Wrapper<Link> = undefined;

        const mountOptions = {
            propsData: {
                url: "http://aaa",
                target: "file"
            },
            slots: {
                default: "Select file prompt"
            }
        }

        beforeEach(() => {
            mount = shallowMount(Link, mountOptions);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("Contains the correct text", () => {
            const link = mount.find("a");
            expect(link.text()).toBe(mountOptions.slots.default);
        });

        it("Is semantically correct", () => {
            const link = mount.find("a");
            expect(link.attributes()["data-semantic"]).toBe("file-selection");
        });

        it("Invokes the correct action when clicked", () => {
            sandbox.mock(LinkProvider.instance).expects("selectFile").exactly(1).calledWith(mountOptions.propsData.url);
            const link = mount.find("a");
            link.trigger("click");
            sandbox.verify();
        });

    });

    describe("External link has the correct display", () => {

        // @ts-ignore
        // Ignore because `before` runs prior.
        let mount: Wrapper<Link> = undefined;

        const mountOptions = {
            propsData: {
                url: "http://bbb",
                target: "external"
            },
            slots: {
                default: "Open external prompt"
            }
        }

        beforeEach(() => {
            mount = shallowMount(Link, mountOptions);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("Contains the correct text", () => {
            const link = mount.find("a");
            expect(link.text()).toBe(mountOptions.slots.default);
        });

        it("Is semantically correct", () => {
            const link = mount.find("a");
            expect(link.attributes()["data-semantic"]).toBe("external-link");
        });

        it("Invokes the correct action when clicked", () => {
            sandbox.mock(LinkProvider.instance).expects("openLink").exactly(1).calledWith(mountOptions.propsData.url);
            const link = mount.find("a");
            link.trigger("click");
            sandbox.verify();
        });

    });

    describe("Visual link has the correct display", () => {

        // @ts-ignore
        // Ignore because `before` runs prior.
        let mount: Wrapper<Link> = undefined;

        const mountOptions = {
            propsData: {
                url: "http://bbb"
            },
            slots: {
                default: "Just a visual indicator"
            }
        }

        beforeEach(() => {
            mount = shallowMount(Link, mountOptions);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("Contains the correct text", () => {
            const link = mount.find("a");
            expect(link.text()).toBe(mountOptions.slots.default);
        });

        it("Is semantically correct", () => {
            const link = mount.find("a");
            expect(link.attributes()["data-semantic"]).toBe("visual-indicator");
        });

        it("Does nothing on click", () => {
            const link = mount.find("a");
            link.trigger("click");
        });

    });

});
