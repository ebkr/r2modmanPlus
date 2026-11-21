import { describe, it, expect, vi, beforeEach } from 'vitest';
import LinkImpl from '../../../../src/r2mm/component_override/LinkImpl';

// Mock window.electron
(global as any).window = {
    electron: {
        openExternal: vi.fn(),
        selectFile: vi.fn(),
    }
};

describe('LinkImpl', () => {
    let linkImpl: LinkImpl;

    beforeEach(() => {
        linkImpl = new LinkImpl();
        vi.clearAllMocks();
    });

    it('should call openExternal when url is valid', () => {
        linkImpl.openLink('https://example.com');
        expect(window.electron.openExternal).toHaveBeenCalledWith('https://example.com');
    });

    it('should NOT call openExternal when url is null', () => {
        linkImpl.openLink(null as any);
        expect(window.electron.openExternal).not.toHaveBeenCalled();
    });

    it('should NOT call openExternal when url is undefined', () => {
        linkImpl.openLink(undefined as any);
        expect(window.electron.openExternal).not.toHaveBeenCalled();
    });

    it('should call selectFile when url is valid', () => {
        linkImpl.selectFile('path/to/file');
        expect(window.electron.selectFile).toHaveBeenCalledWith('path/to/file');
    });

    it('should NOT call selectFile when url is null', () => {
        linkImpl.selectFile(null as any);
        expect(window.electron.selectFile).not.toHaveBeenCalled();
    });
});
