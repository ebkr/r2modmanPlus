import { describe, expect, test } from 'vitest';
import {
    clampPreviewPanelWidth,
    MIN_PREVIEW_PANEL_WIDTH,
} from '../../../../src/utils/PreviewPanelResizeUtils';

describe('clampPreviewPanelWidth', () => {
    test('keeps a width within the available range', () => {
        expect(clampPreviewPanelWidth(450, 900)).toBe(450);
    });

    test('prevents the preview panel from becoming too narrow', () => {
        expect(clampPreviewPanelWidth(100, 900)).toBe(MIN_PREVIEW_PANEL_WIDTH);
    });

    test('prevents the preview panel from exceeding its available space', () => {
        expect(clampPreviewPanelWidth(1_000, 700)).toBe(700);
    });

    test('uses the minimum width when the available space is smaller', () => {
        expect(clampPreviewPanelWidth(450, 200)).toBe(MIN_PREVIEW_PANEL_WIDTH);
    });
});
