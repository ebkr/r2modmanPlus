export const MIN_PREVIEW_PANEL_WIDTH = 350;

export function clampPreviewPanelWidth(width: number, maxWidth: number): number {
    const effectiveMaxWidth = Math.max(MIN_PREVIEW_PANEL_WIDTH, maxWidth);
    return Math.min(
        Math.max(width, MIN_PREVIEW_PANEL_WIDTH),
        effectiveMaxWidth
    );
}
